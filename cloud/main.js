var Post = Parse.Object.extend("Post");
var Agent = Parse.Object.extend("Agent");

Parse.Cloud.define("signup", function(request, response) {
	var user = new Parse.User();
	user.set("username", request.params.email);
	user.set("password", request.params.password);
	user.set("email", request.params.email);

	user.signUp(null, {
		success: function(user1) {
			console.log("Signup successs: "+user1.get("username"));
			response.success("success");
		},
		error: function(user, error) {
			console.log("Signup Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});
});

Parse.Cloud.define("setPostFeatured", function(request, response) {
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.set("featured", request.params.val);
			job.save(null, {
				success: function(job) {
					console.log("set featured "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("set featured Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("get post by id Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});	
});


Parse.Cloud.define("setPostSpecial1", function(request, response) {
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.set("special1", request.params.val);
			job.save(null, {
				success: function(job) {
					console.log("set featured "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("set featured Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("get post by id Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});	
});
