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

Parse.Cloud.define("submitNewPost", function(request, response) {
	if (request.user == null) {
		response.error("Authentication failed");
	}
	
	Parse.Cloud.useMasterKey();
	
	var post = new Post();
	
	var acl = new Parse.ACL();
	acl.setRoleReadAccess("admin", true);
	acl.setRoleWriteAccess("admin", true);
	acl.setReadAccess(request.user, true);
	acl.setWriteAccess(request.user, true);
	post.setACL(acl);
	
	post.save({
		user: request.user,
		subject: request.params.subject,
		location: request.params.location,
		saleRent: request.params.subject,
		type: request.params.type,
		name: request.params.name,
		phone: request.params.phone,
		email: request.params.email,
		shortDesc: request.params.shortDesc,
		longDesc: request.params.longDesc,
		status: "Pending",
		featured: request.params.featured,
		special1: request.params.special1,
		coverImg: request.params.coverImg,
		otherImgs: request.params.otherImgs
	}, {
		success: function(result) {
			console.log("submitNewPost success: " + result);
			response.success("success");
		},
		error: function(object, error) {
			
			console.log("submitNewPost Error: " + error.code + " " + error.message);
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
					console.log("set special1 "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("set special1 Error: " + error.code + " " + error.message);
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

Parse.Cloud.define("setPostStatus", function(request, response) {
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.set("status", request.params.val);
			job.save(null, {
				success: function(job) {
					console.log("set status "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("set status Error: " + error.code + " " + error.message);
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
