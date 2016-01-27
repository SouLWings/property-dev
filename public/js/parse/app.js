var Post = Parse.Object.extend("Post");
var Agent = Parse.Object.extend("Agent");

$(document).ready(function(){

	$('#form-subscribe').submit(function(){
		var form = $(this);
		Parse.Cloud.run('addSubscription',{
			email: $(this).find("#input-email").val()
		}, {
			success: function(results) {
				$("#subscribe-success").show();
				//console.log("subscription success")/
				form.find("#input-email").val("");
			},
			error: function(error) {
				//console.log("subscription fail")
				alert("Fail to subscribe. Please check your internet connection.");
			}
		});

		return false;
	});

	$('#contact-negotiator-form').submit(function(){
		var form = $(this);
		Parse.Cloud.run('contactNegotiator',{
			agentEmail: $(".pemail").text(),
			subscribe: $("#inputAgree").is(':checked'),
			name: $(this).find("#inputName").val(),
			email: $(this).find("#inputEmail").val(),
			phone: $(this).find("#inputPhone").val(),
			msg: $(this).find("#inputMessage").val()
		}, {
			success: function(results) {
				$("#contactNegotiator-success").show();
				//console.log("subscription success")
				form.find("input, textarea").val("");
			},
			error: function(error) {
				//console.log("subscription fail")
				alert("Fail to subscribe. Please check your internet connection.");
			}
		});

		return false;
	});

	$('#login-form').submit(function(){
		var form = $(this);
		//console.log($('#form-action').val());
		//some code to freeze the UI or show some loading
		if($('#form-action').val() == 'register'){
			Parse.Cloud.run('signup',{
				email: $(this).find("input[name='email']").val(),
				password: $(this).find("input[name='password']").val()
			}, {
				success: function(results) {
					logout();
					alert("Registration successful");
				},
				error: function(error) {
					alert("Registration failed: "+ error.message);
				}
			});
		} else if ($('#form-action').val() == 'signin'){
			login($(this).find("input[name='email']").val(), $(this).find("input[name='password']").val(), {
				success:function(){
					location = 'agent.html';
					//alert("sign in successful");
				},
				error:function(error){
					alert(error.message);
				}
			});
		}

		return false;
	});

	$("#featured-property-card-holder, #special1-property-card-holder, #latest-property-card-holder, #post-list-holder, #listing-property-card-holder").on("click",".psubject",function(){
		//console.log($(this).parents(".template").data("id"));
		location = "property.html?q=" + $(this).text() + "&id=" + $(this).parents(".template").data("id");
	});

	$("#featured-property-card-holder, #special1-property-card-holder, #latest-property-card-holder, #post-list-holder, #listing-property-card-holder").on("click",".template img",function(){
		//console.log($(this).parents(".template").data("id"));
		location = "property.html?id=" + $(this).parents(".template").data("id");
	});

	/*
	loadData("Job", function(jobList){
		var container = $('#job-list-holder');
		container.html("");
		if(jobList.length > 0){
			for (var i = 0; i < jobList.length; i++) {
				container.append(generateCard(".job-card-template", jobList[i]));
			}
		} else {
			container.html("No data.");
		}
	}); */
});

function initHomepage(){
	var featuredPropertyQuery = getQuery("Post");
	featuredPropertyQuery.equalTo("featured", true);
	featuredPropertyQuery.equalTo("status", "Approved");
	loadDataToTemplate(featuredPropertyQuery, '#featured-property-card-holder', ".v-property-card-template");

	var special1PropertyQuery = getQuery("Post");
	special1PropertyQuery.equalTo("special1", true);
	special1PropertyQuery.equalTo("status", "Approved");
	loadDataToTemplate(special1PropertyQuery, '#special1-property-card-holder', ".v-property-card-template");

	var latestPropertyQuery = getQuery("Post");
	latestPropertyQuery.equalTo("status", "Approved");
	latestPropertyQuery.limit(3);
	loadDataToTemplate(latestPropertyQuery, '#latest-property-card-holder', ".h-property-card-template");

	$("#input-search").keyup(function(e){
		if(e.keyCode == 13){
			location="listing.html?q=" + $(this).val();
		}
	});

	$("#btn-search").click(function(){
		location="listing.html?q=" + $("#input-search").val();
	});

	$(".keywords").click(function(e){
		$("#input-search").val($(this).text());
		e.preventDefault();
		return false;
	});
}

function initPropertyPage(){
	var id = getUrlParams("id");
	if(id==''){
		location = 'index.html';
		return;
	}

	var query = new Parse.Query(Post);
	query.get(id, {
	  success: function(object) {
		object = object.toJSON();
		//console.log("initPropertyPage success");
		//console.log(object);
		var template = $('body');
		var prefix = ".p";
		$.each(object, function(key, val){
			if(key == "createdAt"){
				var date = new Date(val);
				template.find(prefix+key).text(date.getDate() +"-"+(date.getMonth()+1) +"-"+ date.getFullYear());
			} else if(key == "coverImg") {
				template.find(prefix+key+"bg").css("background-image","url('"+val.url+"')");
				//template.find(prefix+key).attr("src",val.url);
			} else if(key == "otherImgs") {
				//console.log(val);
				var imgURL = [];
				//for(img of val){
				for(var i = 0; i < val.length; i++){
					imgURL.push(val[i].url);
				}
				if(imgURL.length > 0){
					alanSlideShow({
						container:"#imgSlider2",
						imgs: imgURL
					});
				}

			} else {
				template.find(prefix+key).html(val);
			}

		});

		var latestPropertyQuery = getQuery("Post");
		latestPropertyQuery.equalTo("status", "Approved");
		latestPropertyQuery.limit(3);
		loadDataToTemplate(latestPropertyQuery, '#latest-property-card-holder', ".h-property-card-template");
	  },
	  error: function(object, error) {
		// The object was not retrieved successfully.
		// error is a Parse.Error with an error code and message.
		alert("no such property exist");
	  }
	});
}

function initListingPage(){
	var q = getUrlParams("q");
	if(q!=''){
		$("#inputKeyword").val(q.replace(/%20/g,' '));
	}

	$("#inputKeyword, .filter").change(function(){
		$(".listing-property-card").show();
		var keyword = $("#inputKeyword").val().toLowerCase();
		var saleRent = $("#inputSaleRent").val();
		var type = $("#inputType").val();
		var location = $("#inputLocation").val();
		var resultCount = $( ".listing-property-card" ).length - 1;

		$( ".listing-property-card" ).each(function(){
			if($(this).data("object") == undefined)
				return;

			var prop = $(this).data("object").toJSON();

			// check for keyword
			if(prop.type.toLowerCase().indexOf(keyword) == -1)
				if(prop.location.toLowerCase().indexOf(keyword) == -1)
					if(prop.subject.toLowerCase().indexOf(keyword) == -1)
						if(prop.shortDesc.toLowerCase().indexOf(keyword) == -1)
							if(prop.longDesc.toLowerCase().indexOf(keyword) == -1){
								$(this).hide();
								resultCount--;
							}


			// check for saleRent
			if(prop.saleRent.indexOf(saleRent) == -1){
				$(this).hide();
				resultCount--;
			}

			// check for type
			if(prop.type.indexOf(type) == -1){
				$(this).hide();
				resultCount--;
			}

			// check for location
			if(prop.location.indexOf(location) == -1){
				$(this).hide();
				resultCount--;
			}

		});

		$("#no_result_found").hide();
		if(resultCount == 0){
			$("#no_result_found").show();
		}

		$(".listing-property-card-template").show();
	});

	var listingPropertyQuery = getQuery("Post");
	listingPropertyQuery.equalTo("status", "Approved");
	loadDataToTemplate(listingPropertyQuery, '#listing-property-card-holder', ".listing-property-card-template", function(){
		$("#inputKeyword").trigger("change");
	});

	var latestPropertyQuery = getQuery("Post");
	latestPropertyQuery.equalTo("status", "Approved");
	latestPropertyQuery.limit(3);
	loadDataToTemplate(latestPropertyQuery, '#latest-property-card-holder', ".h-property-card-template");
}

function initAboutPage(){
	var latestPropertyQuery = getQuery("Post");
	latestPropertyQuery.equalTo("status", "Approved");
	latestPropertyQuery.limit(3);
	loadDataToTemplate(latestPropertyQuery, '#latest-property-card-holder', ".h-property-card-template");
}

/*
 * function for image slideShow in property page
 * parameter format:
 * 	{
 *		*Compulsory*
 *		container: (css selector for the slider element)
 *		imgs: (array of string url of the images)
 *
 *		*Optional*
 *		height: (height for the slider element)
 *		width: (width for the slider element)
 *		autoSlide: (boolean to trigger auto slideshow)
 *		slideDelay: (delay in milisecond to change image)
 *	}
 *
 */
function alanSlideShow(options){

	//console.log("slider param");
	//console.log(options);

	if(options.container == undefined || options.container == null || options.container.length == undefined){
		//console.log("alanSldier: invalid container")
		return;
	}

	var height = options.height || 470;
	var slideDelay = options.slideDelay || 7000;

	var container = $($(options.container)[0]);
	var coverImg = 	$("<div>").addClass("pcoverImgbg")
					//.css('height',height+"px")
					.append('<div class="slider-arrow arrow-left"><</div>')
					.append('<div class="slider-arrow arrow-right">></div>');

	coverImg.appendTo(container);

	var imgSelector = $("<div>").addClass("imgSelector text-center");
	var count = 1;
	var currImgCount = 1;

	//for(url of options.imgs){
	for(var i = 0; i < options.imgs.length; i++){
		$("<span>").addClass("imgContainer")
				.data("count",count++)
				.append('<span class="mist on"></span><img src="'+options.imgs[i]+'"/>')
				.appendTo(imgSelector);
	}

	imgSelector.appendTo(container);

	var timeout = getTimeOut();

	container.find(".imgContainer").click(function(){
		clearTimeout(timeout);
		timeout = getTimeOut();
		currImgCount = $(this).data("count");
		container.find(".pcoverImgbg").css("background-image", "url("+$(this).find("img").attr("src")+")");
		container.find(".imgSelector").find(".mist").addClass("on");
		$(this).find(".mist").removeClass("on");
	});

	container.find(".slider-arrow.arrow-left").click(function(){
		clearTimeout(timeout);
		timeout = getTimeOut();
		currImgCount--;
		if(currImgCount < 1)
			currImgCount = container.find(".imgContainer").length;
		container.find(".imgContainer:nth-child("+currImgCount+")").click();
	});

	container.find(".slider-arrow.arrow-right").click(function(){
		clearTimeout(timeout);
		timeout = getTimeOut();
		currImgCount++;
		if(currImgCount > container.find(".imgContainer").length)
			currImgCount = 1;
		container.find(".imgContainer:nth-child("+currImgCount+")").click();
	});

	container.find(".imgContainer").first().click();

	function getTimeOut(){
		return setTimeout(function(){
			currImgCount++;
			if(currImgCount > container.find(".imgContainer").length)
				currImgCount = 1;
			container.find(".imgContainer:nth-child("+currImgCount+")").click();

		},slideDelay);
	}
}
