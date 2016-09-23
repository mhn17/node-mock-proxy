
var MockResponse = function() {
	this.body = '';
};

MockResponse.prototype.setBody = function(body) {
	this.body = body;
};

MockResponse.prototype.getBody = function() {
	return this.body;
};

module.exports = MockResponse;