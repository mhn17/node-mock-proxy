var ApiBridge = function() {

}

ApiBridge.prototype.enableMock = function(mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.disableMock = function(mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.getMockList = function(callback) {
	this.sendRequest("/api/mocks", "GET", null, callback);
};

ApiBridge.prototype.deleteMock = function(mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "DELETE", null, callback);
};

ApiBridge.prototype.createMock = function(data, callback) {
	this.sendRequest("/api/mocks", "POST", data, callback);
};

ApiBridge.prototype.getReturnedMocks = function(limit, callback) {
	this.sendRequest("/api/mocks/getReturnedMocks" + "?limit=" + limit, "GET", null, callback);
};

ApiBridge.prototype.getRequestList = function(callback) {
	this.sendRequest("/api/requests", "GET", null, callback);
};

ApiBridge.prototype.clearRequestList = function(callback) {
	this.sendRequest("/api/requests", "DELETE", null, callback);
};

ApiBridge.prototype.getMock = function(mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "GET", null, callback);
};

ApiBridge.prototype.sendRequest = function(endpoint, method, data, callback) {
	var request = { "endpoint": endpoint, "method": method, "data": data};

	chrome.runtime.sendMessage(request, function(response) {
		callback(response);
	});
};

