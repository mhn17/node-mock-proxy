
var MockRequest = function() {
	this.uri = '';
	this.method = 'GET';
	this.body = '';
};

MockRequest.prototype.setUri = function(uri) {
	this.uri = uri;
};

MockRequest.prototype.getUri = function() {
	return this.uri;
};

MockRequest.prototype.setMethod = function(method) {
	this.method = method;
};

MockRequest.prototype.getMethod = function() {
	return this.method;
};

MockRequest.prototype.setBody = function(body) {
	this.body = body;
};

MockRequest.prototype.getBody = function() {
	return this.body;
};

module.exports = MockRequest;