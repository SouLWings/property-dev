var Post = Parse.Object.extend("Post");
var Agent = Parse.Object.extend("Agent");

$(document).ready(function(){
	
	$('#login-form').submit(function(){
		var form = $(this);
		console.log($('#form-action').val());
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
	
	$("body").on("click",".psubject",function(){
		//console.log($(this).parents(".template").data("id"));
		location = "property.html?q=" + $(this).text() + "&id=" + $(this).parents(".template").data("id");
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
	})
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
		console.log("initPropertyPage success");
		console.log(object);
		var template = $('body');
		var prefix = ".p";
		$.each(object, function(key, val){
			/* if(val.url !== undefined){
				template.find(prefix+key).attr("src",val.url);
			} else */ if(key == "createdAt"){
				var date = new Date(val);
				template.find(prefix+key).text(date.getDate() +"-"+(date.getMonth()+1) +"-"+ date.getFullYear());
			} else if(key == "coverImg") {
				template.find(prefix+key+"bg").css("background-image","url('"+val.url+"')");
				//template.find(prefix+key).attr("src",val.url);
			} else {
				template.find(prefix+key).html(val);
			}
			
		});
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
		$("#inputKeyword").val(q);
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
	latestPropertyQuery.equalTo("status", "Approved");
	loadDataToTemplate(listingPropertyQuery, '#listing-property-card-holder', ".listing-property-card-template", function(){
		$("#inputKeyword").trigger("change");
	});
	
	var latestPropertyQuery = getQuery("Post");
	latestPropertyQuery.equalTo("status", "Approved");
	latestPropertyQuery.limit(3);
	loadDataToTemplate(latestPropertyQuery, '#latest-property-card-holder', ".h-property-card-template");
}
