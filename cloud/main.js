var Post = Parse.Object.extend("Post");
var Agent = Parse.Object.extend("Agent");

// modules
var Mailgun = require('mailgun');
Mailgun.initialize('sandbox54bff2c123394996b34e01f0c072990c.mailgun.org', 'key-42de377c0df35592ad8b2cc01b25ad05');

var subscriptionMail = "Dear Admin,<br/><br/>You have a new subscription request from <b>%email%</b>.<br/><br/>Regards,<br/>MailBot";
var adminMail = "katyyyt2208@gmail.com";

Parse.Cloud.define("addSubscription", function(request, response) {
	Mailgun.sendEmail({
		to: "alan_98797@hotmail.com",
		from: "mailbot@mylandprop.com",
		subject: "New subscription request",
		html: subscriptionMail.replace("%email%", request.params.email)
	}, {
		success: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			Mailgun.sendEmail({
				to: adminMail,
				from: "no-reply@mylandprop.com",
				subject: "New subscription request",
				html: subscriptionMail.replace("%email%", request.params.email)
			}, {
				success: function(httpResponse) {
					console.log("MailGun status: "+httpResponse.data.message);
					response.success("success");
				},
				error: function(httpResponse) {
					console.log("MailGun status: "+httpResponse.data.message);
					response.error(httpResponse.data.message);
				}
			});
		},
		error: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			response.error(httpResponse.data.message);
		}
	});

});

Parse.Cloud.define("addContactUs", function(request, response) {
	Mailgun.sendEmail({
		to: adminMail,
		from: "mailbot@mylandprop.com",
		subject: "New contact us request",
		html: "Name: "+request.params.fname + " " + request.params.lname +"<br/>Phone: "+request.params.phone+"<br/>Email: "+request.params.email+"<br/>Message: "+request.params.msg
	}, {
		success: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			response.success("success");
		},
		error: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			response.error(httpResponse.data.message);
		}
	});

});

Parse.Cloud.define("contactNegotiator", function(request, response) {
	Mailgun.sendEmail({
		to: request.params.agentEmail,
		from: "mailbot@mylandprop.com",
		subject: "New customer contact request",
		html: "Name: "+request.params.name+"<br/>Phone: "+request.params.phone+"<br/>Email: "+request.params.email+"<br/>Message: "+request.params.msg
	}, {
		success: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			if(request.params.subscribe){
				Mailgun.sendEmail({
					to: adminMail,
					from: "no-reply@mylandprop.com",
					subject: "New subscription request",
					html: subscriptionMail.replace("%email%", request.params.email)
				}, {
					success: function(httpResponse) {
						console.log("MailGun status: "+httpResponse.data.message);
						response.success("success");
					},
					error: function(httpResponse) {
						console.log("MailGun status: "+httpResponse.data.message);
						response.error(httpResponse.data.message);
					}
				});
			} else {
				response.success("success");
			}

		},
		error: function(httpResponse) {
			console.log("MailGun status: "+httpResponse.data.message);
			response.error(httpResponse.data.message);
		}
	});

});

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

Parse.Cloud.define("editPost", function(request, response) {
	if (request.user == null) {
		response.error("Authentication failed");
	}

	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.set("subject", request.params.subject);
			job.set("location", request.params.location);
			job.set("saleRent", request.params.saleRent);
			job.set("type", request.params.type);
			job.set("name", request.params.name);
			job.set("phone", request.params.phone);
			job.set("email", request.params.email);
			job.set("shortDesc", request.params.shortDesc);
			job.set("longDesc", request.params.longDesc);
			job.save(null, {
				success: function(job) {
					console.log("editPost "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("editPost Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("editPost get post by id Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});
});

Parse.Cloud.define("editCover", function(request, response) {
	if (request.user == null) {
		response.error("Authentication failed");
	}

	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.set("coverImg", request.params.coverImg);
			job.save(null, {
				success: function(job) {
					console.log("editCover "+request.params.val+"successs");
					response.success("success");
				},
				error: function(object, error) {
					console.log("editCover Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("editCover get post by id Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});
});

Parse.Cloud.define("addOtherImg", function(request, response) {
	if (request.user == null) {
		response.error("Authentication failed");
	}

	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			for(var i = 0; i < request.params.otherImgs.length; i++)
				job.add("otherImgs", request.params.otherImgs[i]);
			job.save(null, {
				success: function(job) {
					console.log("addOtherImg "+request.params.val+"successs");
					response.success(job);
				},
				error: function(object, error) {
					console.log("addOtherImg Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("addOtherImg get post by id Error: " + error.code + " " + error.message);
			response.error(error);
		}
	});
});

Parse.Cloud.define("removePostImg", function(request, response) {
	if (request.user == null) {
		response.error("Authentication failed");
	}
	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Post);
	query.get(request.params.id, {
		success: function(job) {
			job.remove("otherImgs", request.params.img);
			job.save(null, {
				success: function(job) {
					console.log("removePostImg "+request.params.val+"successs");
					response.success(job);
				},
				error: function(object, error) {
					console.log("removePostImg Error: " + error.code + " " + error.message);
					response.error(error);
				}
			})
		},
		error: function(object, error) {
			console.log("removePostImg get post by id Error: " + error.code + " " + error.message);
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
	acl.setPublicReadAccess(true);
	acl.setRoleReadAccess("admin", true);
	acl.setRoleWriteAccess("admin", true);
	acl.setReadAccess(request.user, true);
	acl.setWriteAccess(request.user, true);
	post.setACL(acl);

	post.save({
		user: request.user,
		subject: request.params.subject,
		location: request.params.location,
		saleRent: request.params.saleRent,
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
	if (request.user == null) {
		response.error("Authentication failed");
	}
	Parse.Cloud.useMasterKey();
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
