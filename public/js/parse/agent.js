var pageloader = $("#page-loader");
var mapLoaded = false;
var uploading = 0;

$(document).ready(function() {

    $("#inputSubject").val("asd");
    $("#inputLocation").val("asd");
    $("#inputSaleRent").val("For Sale");
    $("#inputType").val("Apartments");
    $("#inputName").val("asd");
    $("#inputPhone").val("asd");
    $("#inputEmail").val("asd");
    $("#inputShortDesc").val("asd");
    $("#inputLongDesc").val("asd");

    /* $(".page-section").hide();
    pageloader.fadeOut(500,function(){

    	if(localStorage.getItem("curr_page") != null){
    		goTo(localStorage.getItem("curr_page"));
    	} else {
    		$("#page-new-post").show();/
    	}
    }); */

    $(".nav-link").click(function(e) {
        goTo($(this).data("link"));
        e.preventDefault();
        return false;
    });

    $('#edit-post-form').submit(function() {
        var form = $(this);

        form.find("button").data("html", form.find("button").html());
        form.find("button").html('<i class="fa fa-gear fa-spin"></i>');

        Parse.Cloud.run('editPost', {
            id: form.data("object").id,
            subject: form.find("input[name='inputSubject']").val(),
            location: form.find("input[name='inputLocation']").val(),
            saleRent: form.find("select[name='inputSaleRent']").val(),
            type: form.find("select[name='inputType']").val(),
            name: form.find("input[name='inputName']").val(),
            phone: form.find("input[name='inputPhone']").val(),
            email: form.find("input[name='inputEmail']").val(),
            shortDesc: form.find("textarea[name='inputShortDesc']").val(),
            longDesc: form.find("textarea[name='inputLongDesc']").val()
        }, {
            success: function(results) {
                alert("Data updated!");
                form.find("button").html(form.find("button").data("html"));
            },
            error: function(error) {
                alert("editPost failed: " + error.message);
                form.find("button").html(form.find("button").data("html"));
            }
        });

        return false;
    });

    $('#edit-slideshow-form').submit(function(){
        var form = $(this);

        form.find("button").data("html", form.find("button").html());
        form.find("button").html('<i class="fa fa-gear fa-spin"></i>');

		var otherImgFiles = [];
		var otherImg = $("#addOtherImgs")[0];

		if(otherImg.files == undefined)
			return;

		if (otherImg.files.length > 0) {
			var file = [];
			var name = [];
			for (var i = 0; i < otherImg.files.length; i++) {
				uploading++;
				file = otherImg.files[i];
				name = otherImg.files[i].name;

				var aImgFile = new Parse.File(name, file);
				otherImgFiles.push(aImgFile);
				aImgFile.save().then(function() {
					uploading--;
					//console.log(otherImgFiles);
					//console.log("uploading: " + uploading);
					if (uploading == 0) {
						Parse.Cloud.run('addOtherImg',{
		                    id: $('#edit-post-form').data("object").id,
		                    otherImgs: otherImgFiles
		                }, {
		                    success: function(post) {
								populateEditForm(post);
		                        form.find("button").html(form.find("button").data("html"));
		                    },
		                    error: function(error) {
		                        alert("editCover failed: " + error.message);
		                        form.find("button").html(form.find("button").data("html"));
		                    }
		                });
					}
				}, function(error) {
					alert("Error uploading file " + name);
				});
			}
		}

        return false;
    });

    $('#edit-cover-form').submit(function(){
        var form = $(this);

        form.find("button").data("html", form.find("button").html());
        form.find("button").html('<i class="fa fa-gear fa-spin"></i>');

        var coverImgFile = null;
        var coverImg = $("#newCoverImg")[0];
        if (coverImg.files.length > 0) {
            var file = coverImg.files[0];
            var name = coverImg.files[0].name;

            coverImgFile = new Parse.File(name, file);
            coverImgFile.save().then(function() {

                Parse.Cloud.run('editCover',{
                    id: $('#edit-post-form').data("object").id,
                    coverImg: coverImgFile
                }, {
                    success: function(results) {
						form.find("#currCoverImg").attr("src",coverImgFile._url);
						$("#newCoverImg").val("");
                        form.find("button").html(form.find("button").data("html"));
                    },
                    error: function(error) {
                        alert("editCover failed: " + error.message);
                        form.find("button").html(form.find("button").data("html"));
                    }
                });
            }, function(error) {
                alert("Error uploading file " + name);
                form.find("button").html(form.find("button").data("html"));
            });
        }


        return false;
    });

    $('#new-post-form').submit(function() {
        var form = $(this);

        form.find("button").data("html", form.find("button").html());
        form.find("button").html('<i class="fa fa-gear fa-spin"></i>');


        var coverImgFile = null;
        var coverImg = $("#inputCoverImage")[0];
        if (coverImg.files.length > 0) {
            uploading++;
            var file = coverImg.files[0];
            var name = coverImg.files[0].name;

            coverImgFile = new Parse.File(name, file);
            coverImgFile.save().then(function() {
                uploading--;
                //console.log(coverImgFile);
                //console.log("uploading: " + uploading);
                if (uploading == 0) {
                    submitNewPost();
                }
            }, function(error) {
                alert("Error uploading file " + name);
            });
        }

        var otherImgFiles = [];
        var otherImg = $("#inputOtherImage")[0];
        if (otherImg.files.length > 0) {
            otherImgFiles = [];
            var file = [];
            var name = [];
            var aImgFile = [];
            for (var i = 0; i < otherImg.files.length; i++) {
                uploading++;
                file = otherImg.files[i];
                name = otherImg.files[i].name;

                var aImgFile = new Parse.File(name, file);
                otherImgFiles.push(aImgFile);
                aImgFile.save().then(function() {
                    uploading--;
                    //console.log(otherImgFiles);
                    //console.log("uploading: " + uploading);
                    if (uploading == 0) {
                        submitNewPost();
                    }
                }, function(error) {
                    alert("Error uploading file " + name);
                });
            }
        }

        if (uploading == 0) {
            submitNewPost();
        }

        function submitNewPost() {

            Parse.Cloud.run('submitNewPost', {
                subject: form.find("#inputSubject").val(),
                location: form.find("#inputLocation").val(),
                saleRent: form.find("#inputSaleRent").val(),
                type: form.find("#inputType").val(),
                name: form.find("#inputName").val(),
                phone: form.find("#inputPhone").val(),
                email: form.find("#inputEmail").val(),
                shortDesc: form.find("#inputShortDesc").val(),
                longDesc: form.find("#inputLongDesc").val(),
                featured: false,
                special1: false,
                coverImg: coverImgFile,
                otherImgs: otherImgFiles
            }, {
                success: function(results) {
                    //console.log("success");
                    //console.log(results);
                    //form.find("input").val("");
                    //form.find("select").val("");
                    //form.find("textarea").val("");
                    alert("new posting success");
                    goTo("my-property");
                    form.find("button").html(form.find("button").data("html"));
                },
                error: function(error) {
                    alert("new posting failed: " + error.message);
                    form.find("button").html(form.find("button").data("html"));
                }
            });
        }

        return false;
    });

    $("#post-list-holder").on('click', '.pfeatured', function() {
        var btn = $(this);
        btn.toggleClass("btn-success btn-default");

        //console.log("calling to cloudFunc setPostFeatured");
        Parse.Cloud.run('setPostFeatured', {
            val: $(this).hasClass("btn-success"),
            id: $(this).parents(".post-card").data("id")
        }, {
            success: function(results) {
                //console.log(results);
            },
            error: function(error) {
                btn.toggleClass("btn-success btn-default");
                alert("Failed to update. Please try again.");
                //console.log(error);
            }
        });
    });

    $("#post-list-holder").on('click', '.pspecial1', function() {
        var btn = $(this);
        btn.toggleClass("btn-success btn-default");

        //console.log("calling to cloudFunc setPostSpecial1");
        Parse.Cloud.run('setPostSpecial1', {
            val: $(this).hasClass("btn-success"),
            id: $(this).parents(".post-card").data("id")
        }, {
            success: function(results) {
                //console.log(results);
            },
            error: function(error) {
                btn.toggleClass("btn-success btn-default");
                alert("Failed to update. Please try again.");
                //console.log(error);
            }
        });
    });

    $("#post-list-holder").on('click', '.pstatus', function() {
        var btn = $(this);
        btn.toggleClass("btn-success btn-default");
        var status = $(this).hasClass("btn-success") ? "Approved" : "Pending";
        //console.log("calling to cloudFunc setPostStatus");
        Parse.Cloud.run('setPostStatus', {
            val: status,
            id: $(this).parents(".post-card").data("id")
        }, {
            success: function(results) {
                //console.log(results);
                btn.parents(".post-card").find(".status-hint").toggleClass("label-success label-warning");

            },
            error: function(error) {
                btn.toggleClass("btn-success btn-default");
                alert("Failed to update. Please try again.");
                //console.log(error);
            }
        });
    });

    $("#post-list-holder").on('click', '.btn-edit', function() {
		var form = $("#edit-post-form");
	    form.data("object", $(this).parents(".template").data("object"));
        populateEditForm($(this).parents(".template").data("object"));
        goTo("edit-post");
    });

    $("#post-list-holder").on('click', '.btn-delete', function() {
        if (!confirm("Sure to delete?"))
            return;
        var template = $(this).parents(".template");
        //console.log("calling to cloudFunc setPostStatus to delete");
        Parse.Cloud.run('setPostStatus', {
            val: "Trashed",
            id: $(this).parents(".post-card").data("id")
        }, {
            success: function(results) {
                //console.log(results);
                template.fadeOut();
            },
            error: function(error) {
                alert("Failed to delete. Please try again.");
                //console.log(error);
            }
        });
    });

    $("#other-img-remove-card-holder").on('click', '.btn-remove-img', function() {
		var imgSpan = $(this).parents("span");
		imgSpan.find(".fa").toggleClass("fa-remove fa-gear fa-spin");
        Parse.Cloud.run('removePostImg', {
            img: imgSpan.data("file"),
            id: $('#edit-post-form').data("object").id
        }, {
            success: function(results) {
				imgSpan.fadeOut();
                $('#edit-slideshow-form').find("button").html($('#edit-slideshow-form').find("button").data("html"));
				imgSpan.find(".fa").toggleClass("fa-remove fa-gear fa-spin");
            },
            error: function(error) {
                alert("new posting failed: " + error.message);
                $('#edit-slideshow-form').find("button").html($('#edit-slideshow-form').find("button").data("html"));
				imgSpan.find(".fa").toggleClass("fa-remove fa-gear fa-spin");
            }
        });
    });
});

function populateEditForm(post){

	var obj = post.toJSON();
	var form = $("#edit-post-form");
    form.find("input[name='inputSubject']").val(obj.subject);
    form.find("input[name='inputLocation']").val(obj.location);
    form.find("select[name='inputSaleRent']").val(obj.saleRent);
    form.find("select[name='inputType']").val(obj.type);
    form.find("input[name='inputName']").val(obj.name);
    form.find("input[name='inputPhone']").val(obj.phone);
    form.find("input[name='inputEmail']").val(obj.email);
    form.find("textarea[name='inputShortDesc']").val(obj.shortDesc);
    form.find("textarea[name='inputLongDesc']").val(obj.longDesc);

    $("#currCoverImg").attr("src", obj.coverImg.url);

    $("#other-img-remove-card-holder").html("");

    for (var i = 0; i < obj.otherImgs.length; i++) {
		var elem = $(generateImgRemovalCard(".post-card-template", obj.otherImgs[i]));
		elem.data("file", obj.otherImgs[i]);
        $("#other-img-remove-card-holder").append(elem);
		elem.data("file", obj.otherImgs[i]);
    }
}

function loadPost() {
    var container = $('#post-list-holder');
    container.html('<center><i class="fa fa-gear fa-spin fa-5x"></i></center>');

    loadData(getQuery("Post"), function(postList) {
        G.posts = [];
        G.postsJSON = [];
        container.html("");
		$('#post-list-holder').css("opacity","0");
		$('#post-list-holder').css("padding-top","20px");
        if (postList.length > 0) {
            for (var i = 0; i < postList.length; i++) {
                container.append(generatePostCard(".post-card-template", postList[i]));
                G.posts.push(postList[i]);
                G.postsJSON.push(postList[i].toJSON);
            }
        } else {
            container.html("No data.");
        }
		container.animate({'opacity': '1', 'paddingTop': 0});
    });
}

function generateImgRemovalCard(templateName, file) {
    var elem = '<span style="position:relative;height:140px;display:inline-block"><img src="' + file.url + '" style="height:140px"/><a class="btn btn-sm btn-danger btn-remove-img" style="position:absolute;right:5px;top:5px"><i class="fa fa-remove"></i></a></span>'

    return elem;
}

function generatePostCard(templateName, object) {
    var template = $($(templateName).first().clone());
    template.removeClass(templateName.replace(".", ""));
    var prefix = "." + template.data("prefix");
    template.data("id", object.id);
    template.data("object", object);

    if (object.get("status") == "Trashed")
        return "";

    object = object.toJSON();
    $.each(object, function(key, val) {
        if (val.url !== undefined) {
            template.find(prefix + key).attr("src", val.url);
        } else if (key == "createdAt") {
            var date = new Date(val);
            template.find(prefix + key).text(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear());
        } else if (key == "featured" || key == "special1") {
            if (val)
                template.find(prefix + key).toggleClass("btn-success btn-default");
        } else if (key == "status") {
            if (val == "Approved") {
                template.find(prefix + key).toggleClass("btn-success btn-default");
                template.find(".status-hint").toggleClass("label-success label-warning");
            }
        } else {
            template.find(prefix + key).text(val);
        }

    });

    return template;
}

function goTo(page) {
    history.pushState({}, "", "agent.html?p=" + page);
    var loadingTime = 150;
    if (page == 'my-property')
        loadingTime = 2000;

    localStorage.setItem("curr_page", page);
    if (page == "my-property"){
		loadPost();
	}

    page = "#page-" + page;
    //console.log("showing " + page + " page")
    pageloader.fadeIn(150, function() {
        $(".page-section").hide();
        $(page).show();
        /* if(page == "#page-requester"){
        	$('body').append($('<input id="pac-input" class="controls" type="text" placeholder="Search Box">'));
        	initMap();
        	maploaded = true;
        	//console.log("maploaded");
        } */
        pageloader.fadeOut();
    });
}

window.onpopstate = function(event) {
    var q = getUrlParams("p");
    if (q != '') {
        goTo(q);
    }
};
