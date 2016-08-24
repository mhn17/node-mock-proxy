var ApiBridge = function() {
	this.apiConnector = new ApiConnector();
}

ApiBridge.prototype.enableMock = function(mockId, callback) {
	this.apiConnector.callApi("/api/mocks/" + mockId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.disableMock = function(mockId, callback) {
	this.apiConnector.callApi("/api/mocks/" + mockId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.getMockList = function(callback) {
	this.apiConnector.callApi("/api/mocks", "GET", null, callback);
};

ApiBridge.prototype.deleteMock = function(mockId, callback) {
	this.apiConnector.callApi("/api/mocks/" + mockId, "DELETE", null, callback);
};