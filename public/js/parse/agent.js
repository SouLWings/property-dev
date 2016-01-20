var pageloader = $("#page-loader");
var mapLoaded = false;

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
	
	$(".page-section").hide();
	pageloader.fadeOut(500,function(){
			
		if(localStorage.getItem("curr_page") != null){
			goTo(localStorage.getItem("curr_page"));
		} else {
			$("#page-new-post").show();
		}
	});
	
	$(".nav-link").click(function(){
		goTo($(this).data("link"));
	});	
	
	$('#new-post-form').submit(function(){
		var form = $(this);
		
		//some code to freeze the UI or show some loading
		
		var coverImg = $("#inputCoverImage")[0];
		var coverImgFile = null;
		if (coverImg.files.length > 0) {
			var file = coverImg.files[0];
			var name = coverImg.files[0].name;
	   
			coverImgFile = new Parse.File(name, file);
		}
		
		var otherImg = $("#inputOtherImage")[0];
		var otherImgFiles = [];
		if (otherImg.files.length > 0) {
			for(var i = 0; i < otherImg.files.length; i++){
				var file = otherImg.files[i];
				var name = otherImg.files[i].name;
	   
				otherImgFiles.push(new Parse.File(name, file));
			}
		}
		
		var post = new Post();
		post.save({
			subject: $(this).find("#inputSubject").val(),
			location: $(this).find("#inputLocation").val(),
			saleRent: $(this).find("#inputSaleRent").val(),
			type: $(this).find("#inputType").val(),
			name: $(this).find("#inputName").val(),
			phone: $(this).find("#inputPhone").val(),
			email: $(this).find("#inputEmail").val(),
			shortDesc: $(this).find("#inputShortDesc").val(),
			longDesc: $(this).find("#inputLongDesc").val(),
			featured: false,
			special1: false,
			coverImg: coverImgFile,
			otherImgs: otherImgFiles
		}, {
			success: function(result) {
				console.log("success");
				console.log(result);
				//form.find("input").val("");
				//form.find("select").val("");
				//form.find("textarea").val("");
			},
			error: function(error) {
				alert("new posting failed: " + error.message);
			}
		});
			
		return false;
	});
	
	$("#post-list-holder").on('click','.pfeatured',function(){
		$(this).toggleClass("btn-success btn-default");
		
		console.log($(this).hasClass("btn-success"));
		console.log($(this).parents(".post-card").data("object"));
		//return;
		
		console.log("calling to cloudFunc setPostFeatured");
		Parse.Cloud.run('setPostFeatured',{
			val: $(this).hasClass("btn-success"),
			id: $(this).parents(".post-card").data("id")
		}, {
			success: function(results) {
				console.log(results);
			},
			error: function(error) {
				$(this).toggleClass("btn-success btn-default");
				alert("Failed to update. Please try again.");
				console.log(error);
			}
		});
	});
	
	$("#post-list-holder").on('click','.pspecial1',function(){
		$(this).toggleClass("btn-success btn-default");
		
		console.log($(this).hasClass("btn-success"));
		console.log($(this).parents(".post-card").data("object"));
		//return;
		
		console.log("calling to cloudFunc setPostSpecial1");
		Parse.Cloud.run('setPostSpecial1',{
			val: $(this).hasClass("btn-success"),
			id: $(this).parents(".post-card").data("id")
		}, {
			success: function(results) {
				console.log(results);
			},
			error: function(error) {
				$(this).toggleClass("btn-success btn-default");
				alert("Failed to update. Please try again.");
				console.log(error);
			}
		});
	});
});

function loadPost(){
	
	loadData("Post", function(postList){
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
		}  else if (key == "featured" || key == "special1"){
			if(val)
				template.find(prefix+key).toggleClass("btn-success btn-default");
		} else {
			template.find(prefix+key).text(val);
		}
		
	});
	
	return template;
}

function goTo(page){
	localStorage.setItem("curr_page",page);
	if(page == "my-property")
		loadPost();
	
	page = "#page-" + page;
	console.log("showing " + page + " page")
	pageloader.fadeIn(150, function(){
		$(".page-section").hide();
		$(page).show();
		if(page == "#page-requester"){
			$('body').append($('<input id="pac-input" class="controls" type="text" placeholder="Search Box">'));
			initMap();
			maploaded = true;
			console.log("maploaded");
		}
		pageloader.fadeOut();
	});
}