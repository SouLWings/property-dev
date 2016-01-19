
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
