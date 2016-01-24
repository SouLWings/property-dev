Parse.initialize("yICswxr5amAnGVVPzIWwApo62ikbYJ95ODrc9rBL", "p3Bv2559bFtgBmWkuR6wHmPPIrmrDHO4D2fXAGvQ");
var G = {};

function lg(o){
	console.log(o);
}

function generateCard(templateName, object){
	var template = $($(templateName).first().clone());
	template.removeClass(templateName.replace(".",""));
	var prefix = "." + template.data("prefix");
	template.data("id", object.id);
	template.data("object", object);

	object = object.toJSON();
	$.each(object, function(key, val){
		if(val.url !== undefined){
			template.find(prefix+key).attr("src",val.url);
		} else if(key == "createdAt"){
			var date = new Date(val);
			template.find(prefix+key).text(date.getDate() +"-"+(date.getMonth()+1) +"-"+ date.getFullYear());
		} else {
			template.find(prefix+key).text(val);
		}

	});

	return template;
}

function getQuery(entity){
	var Entity = Parse.Object.extend(entity);
    var query = new Parse.Query(Entity);
    query.descending("createdAt");
	return query;
}

function loadData(query, callback){
    query.find({
		success: function(results) {
			//console.log("Successfully retrieved " + results.length + " "+query.className+"s.");
			callback(results);
		},
		error: function(error) {
		   console.log("Error: " + error.code + " " + error.message);
		   callback(error);
		}
	});
}

function loadDataToTemplate(query, holder, template, callback){
	//console.log("loadDataToTemplate for " +query.className);

	loadData(query, function(objectList){
		if(objectList.message !== undefined){
			alert(objectList.message)
			return;
		}

		var container = $(holder);
		//console.log(container);
		container.html("");
		if(objectList.length > 0){
			for (var i = 0; i < objectList.length; i++) {
				container.append(generateCard(template, objectList[i]));
			}
		} else {
			container.html("No data.");
		}

		if(callback !== undefined)
			callback();
	});
}

function login(email, password, callback){
    Parse.User.logIn(email, password, {
        success: function(user) {
			//console.log("logged in");
			if(callback != undefined)
				callback.success();
		},
        error: function(user, error) {
            console.log(error);
			callback.error(error);
		}
	});
}

function logout(){
    Parse.User.logOut();
    console.log("logged out");
	location = '/';
}

function getUrlParams(param) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
	if(vars[param]==undefined){
		return '';
	}
    return vars[param];
}

/*
		Sample usage
		loadData("Parent", function(parentList){
			G.parents = [];
			G.parentsJSON = [];
			var container = $('#parent_list_holder');
			container.html("");
			if(parentList.length > 0){
				for (var i = 0; i < parentList.length; i++) {
					container.append(generateCard(".parent-card-template", parentList[i]));
					G.parents.push(parentList[i]);
					G.parentsJSON.push(parentList[i].toJSON);
				}
			} else {
				container.html("No data.");
			}
		});

		object.save({
			additional_info: form.find('#additional-info').val(),
			book_before: form.find('input[name="optionsRadios"]:checked').val()
		}, {
			success: function(tutorRequest) {

			},
			error: function(object, error) {

			}
		});

		Parse.Cloud.run('cloudFunc',{
			email: $(this).find("input[name='email']").val()
		}, {
			success: function(results) {

			},
			error: function(error) {

			}
		});



	var fileUploadControl = $("input[name='cert1']")[0];
	var parseFileCert1 = null;
	if (fileUploadControl.files.length > 0) {
		var file = fileUploadControl.files[0];
		var name = fileUploadControl.files[0].name;

		parseFileCert1 = new Parse.File(name, file);
	}
*/
