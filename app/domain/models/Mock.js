var fs = require('fs');
var uuid = require('node-uuid');
var sanitize = require('sanitize-filename');
var camelCase = require('camelcase');
var pathService = require('services/PathService');
var Request = require('domain/models/MockRequest');
var Response = require('domain/models/MockResponse');

var Mock = function() {
	this.fileName = "";

	this.id = "";
	this.name = "";
	this.description = "";
	this.request = null;
	this.response = null;

	return this;
};

Mock.prototype.setFileName = function(fileName) {
	this.fileName = fileName;
};

Mock.prototype.getFileName = function() {
	return this.fileName;
};

Mock.prototype.setId = function(id) {
	this.id = id;
};

Mock.prototype.getId = function() {
	return this.id;
};

Mock.prototype.setName = function(name) {
	this.name = name;
};

Mock.prototype.getName = function() {
	return this.name;
};

Mock.prototype.setDescription = function(description) {
	this.description = description;
};

Mock.prototype.getDescription = function() {
	return this.description;
};

Mock.prototype.setRequest = function(request) {
	this.request = request;
};

Mock.prototype.getRequest = function() {
	return this.request;
};

Mock.prototype.setResponse = function(response) {
	this.response = response;
};

Mock.prototype.getResponse = function() {
	return this.response;
};


Mock.prototype.readFromFile = function() {
	if (!this.getFileName()) {
		throw new Error("File name not set");
	}

	var that = this;

	try {
		var data = fs.readFileSync(this.getFileName(), {"encoding": "utf-8"});
		var jsonData = JSON.parse(data);

		var request = new Request();
		request.setUri(jsonData.request.uri);
		request.setMethod(jsonData.request.method);
		request.setBody(jsonData.request.body);

		var response = new Response();
		response.setBody(jsonData.response.body);

		that.setId(jsonData.id);
		that.setName(jsonData.name);
		that.setDescription(jsonData.description);
		that.setRequest(request);
		that.setResponse(response);

	} catch (e) {
		throw new Error("Could not read mock file " + this.getFileName());
	}
};

Mock.prototype.saveToFile = function() {
	if (!this.getId()) {
		this.setId(uuid.v1());
	}

	if (!this.getFileName()) {
		var fileName = pathService.getMockAvailableFolderPath() + camelCase(sanitize(this.getName())) + ".json";
		this.setFileName(fileName);
	}

	var content = {
		"id": this.getId(),
		"name": this.getName(),
		"description": this.getDescription(),
		"request": {
			"uri": this.getRequest().getUri(),
			"method": this.getRequest().getMethod(),
			"body": this.getRequest().getBody()
		},
		"response": {
			"body": this.getResponse().getBody()
		}
	};

	try {
		fs.writeFileSync(this.getFileName(), JSON.stringify(content), 'utf8');
	} catch (e) {
		throw new Error("Could not write mock file " + this.getFileName());
	}
};

module.exports = Mock;