var fs = require('fs');

var Mock = function() {
	this.fileName = "";

	this.id = "";
	this.name = "";
	this.description = "";
	this.requestUri = "";
	this.requestMethod = "";
	this.requestBody = "";
	this.responseBody = "";

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

Mock.prototype.setRequestUri = function(requestUri) {
	this.requestUri = requestUri;
};

Mock.prototype.getRequestUri = function() {
	return this.requestUri;
};

Mock.prototype.setRequestMethod = function(requestMethod) {
	this.requestMethod = requestMethod;
};

Mock.prototype.getRequestMethod = function() {
	return this.requestMethod;
};

Mock.prototype.setRequestBody = function(requestBody) {
	this.requestBody = requestBody;
};

Mock.prototype.getRequestBody = function() {
	return this.requestBody;
};

Mock.prototype.setResponseBody = function(responseBody) {
	this.responseBody = responseBody;
};

Mock.prototype.getResponseBody = function() {
	return this.responseBody;
};

Mock.prototype.readFromFile = function() {
	if (!this.getFileName()) {
		throw new Error("File name not set");
	}

	var that = this;

	var data = fs.readFileSync(this.getFileName(), {"encoding": "utf-8"});
	if (data) {
		var jsonData = JSON.parse(data);
		that.setId(jsonData.id);
		that.setName(jsonData.name);
		that.setDescription(jsonData.description);
		that.setRequestUri(jsonData.request.uri);
		that.setRequestMethod(jsonData.request.method);
		that.setRequestBody(jsonData.request.body);
		that.setResponseBody(jsonData.response.body);
	} else {
		throw new Error("Could nor read mock file " + this.getFileName());
	}
};

Mock.prototype.safeToFile = function() {
	// @ToDo
};

Mock.prototype.overrideConfig = function(config) {
	this.config = config;
};

module.exports = Mock;