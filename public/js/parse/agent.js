var pageloader = $("#page-loader");
var mapLoaded = false;
var coverImgFile = null;
var otherImgFiles = [];
var uploading = 0;

$(document).ready(function(){

	
	$("#inputSubject").val("asd"),
	$("#inputLocation").val("asd"),
	$("#inputSaleRent").val("asd"),
	$("#inputType").val("asd"),
	$("#inputName").val("asd"),
	$("#inputPhone").val("asd"),
	$("#inputEmail").val("asd"),
	$("#inputShortDesc").val("asd"),
	$("#inputLongDesc").val("asd"),
	
	/* $(".page-section").hide();
	pageloader.fadeOut(500,function(){
			
		if(localStorage.getItem("curr_page") != null){
			goTo(localStorage.getItem("curr_page"));
		} else {
			$("#page-new-post").show();
		}
	}); */
	
	$(".nav-link").click(function(){
		goTo($(this).data("link"));
	});	
	
	$('#new-post-form').submit(function(){
		var form = $(this);
		
		form.find("button").data("html", form.find("button").html());
		form.find("button").html();
		//some code to freeze the UI or show some loading
		
		var coverImg = $("#inputCoverImage")[0];
		if (coverImg.files.length > 0) {
			uploading++;
			var file = coverImg.files[0];
			var name = coverImg.files[0].name;
	   
			coverImgFile = new Parse.File(name, file);
			coverImgFile.save().then(function() {
				uploading--;
					console.log(coverImgFile);
					console.log("uploading: " + uploading);
				if(uploading == 0){
					submitNewPost();
				}
			}, function(error) {
			  alert("Error uploading file "+name);
			});
		}
		
		var otherImg = $("#inputOtherImage")[0];
		if (otherImg.files.length > 0) {
			otherImgFiles = [];
			for(var i = 0; i < otherImg.files.length; i++){
				uploading++;
				var file = otherImg.files[i];
				var name = otherImg.files[i].name;
	   
				var aImgFile = new Parse.File(name, file);
				aImgFile.save().then(function() {
					otherImgFiles.push(aImgFile);
					uploading--;
					console.log(otherImgFiles);
					console.log("uploading: " + uploading);
					if(uploading == 0){
						submitNewPost();
					}
				}, function(error) {
				  alert("Error uploading file "+name);
				});
			}
		}
		
		if(uploading == 0){
			submitNewPost();
		}

		function submitNewPost(){
			
			Parse.Cloud.run('submitNewPost',{
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
					console.log("success");
					console.log(results);
					//form.find("input").val("");
					//form.find("select").val("");
					//form.find("textarea").val("");
					alert("new posting success");
				},
				error: function(error) {
					alert("new posting failed: " + error.message);
				}
			});
		}
		
		return false;
	});
	
	$("#post-list-holder").on('click','.pfeatured',function(){
		var btn = $(this);
		btn.toggleClass("btn-success btn-default");
		
		console.log("calling to cloudFunc setPostFeatured");
		Parse.Cloud.run('setPostFeatured',{
			val: $(this).hasClass("btn-success"),
			id: $(this).parents(".post-card").data("id")
		}, {
			success: function(results) {
				console.log(results);
			},
			error: function(error) {
				btn.toggleClass("btn-success btn-default");
				alert("Failed to update. Please try again.");
				console.log(error);
			}
		});
	});
	
	$("#post-list-holder").on('click','.pspecial1',function(){
		var btn = $(this);
		btn.toggleClass("btn-success btn-default");
		
		console.log("calling to cloudFunc setPostSpecial1");
		Parse.Cloud.run('setPostSpecial1',{
			val: $(this).hasClass("btn-success"),
			id: $(this).parents(".post-card").data("id")
		}, {
			success: function(results) {
				console.log(results);
			},
			error: function(error) {
				btn.toggleClass("btn-success btn-default");
				alert("Failed to update. Please try again.");
				console.log(error);
			}
		});
	});
	
	$("#post-list-holder").on('click','.pstatus',function(){
		var btn = $(this);
		btn.toggleClass("btn-success btn-default");
		
		console.log("calling to cloudFunc setPostStatus");
		Parse.Cloud.run('setPostStatus',{
			val: $(this).hasClass("btn-success")?"Approved":"Pending",
			id: $(this).parents(".post-card").data("id")
		}, {
			success: function(results) {
				console.log(results);
			},
			error: function(error) {
				btn.toggleClass("btn-success btn-default");
				alert("Failed to update. Please try again.");
				console.log(error);
			}
		});
	});
});

function loadPost(){
	
	loadData(getQuery("Post"), function(postList){
		G.posts = [];
		G.postsJSON = [];
		var container = $('#post-list-holder');
		container.html("");
		if(postList.length > 0){
			for (var i = 0; i < postList.length; i++) {
				container.append(generatePostCard(".post-card-template", postList[i]));
				G.posts.push(postList[i]);
				G.postsJSON.push(postList[i].toJSON);
			}
		} else {
			container.html("No data.");
		}
	});
}

function generatePostCard(templateName, object){
	var template = $($(templateName).first().clone());
	template.removeClass(templateName.replace(".",""));
	var prefix = "." + template.data("prefix");
	template.data("id", object.id);
	template.data("object", object);
	
	object = object.toJSON();
	$.each(object, function(key, val){
		if(val.url !== undefined){
			template.find(prefix+key).attr("src",val.url);
		} else if (key == "createdAt"){
			var date = new Date(val);
			template.find(prefix+key).text(date.getDate() +"-"+(date.getMonth()+1) +"-"+ date.getFullYear());
		} else if (key == "featured" || key == "special1"){
			if(val)
				template.find(prefix+key).toggleClass("btn-success btn-default");
		} else if (key == "status"){
			if(val=="Approved")
				template.find(prefix+key).toggleClass("btn-success btn-default");
		} else {
			template.find(prefix+key).text(val);
		}
		
	});
	
	return template;
}

function goTo(page){
	history.pushState({}, "", "agent.html?p="+page);
	var loadingTime = 150;
	if(page=='my-property')
		loadingTime = 2000;
	
	localStorage.setItem("curr_page",page);
	if(page == "my-property")
		loadPost();
	
	page = "#page-" + page;
	console.log("showing " + page + " page")
	pageloader.fadeIn(150, function(){
		$(".page-section").hide();
		$(page).show();
		/* if(page == "#page-requester"){
			$('body').append($('<input id="pac-input" class="controls" type="text" placeholder="Search Box">'));
			initMap();
			maploaded = true;
			console.log("maploaded");
		} */
		pageloader.fadeOut();
	});
}

window.onpopstate = function(event) {
	var q = getUrlParams("p");
	if(q!=''){
		goTo(q);
	}
};