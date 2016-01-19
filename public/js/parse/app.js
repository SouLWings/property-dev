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
					alert("sign in successful");
				}, 
				error:function(error){
					alert(error.message);
				}
			});
		}
		
		return false;
	});	
	
	/*loadDataToTemplate("Job", '#job-list-holder', ".job-card-template");
	
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
