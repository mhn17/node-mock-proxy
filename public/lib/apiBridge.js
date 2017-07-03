
var ApiBridge = function () {};

ApiBridge.prototype.webSocket = function(endpoint, receiveCallBack) {
	var connection = new WebSocket("ws://" + this.getServerEndpoint().replace("http://", "") + endpoint);

	connection.onopen = function () {
		connection.send('Ping'); // Send the message 'Ping' to the server
	};

	// Log errors
	connection.onerror = function (error) {
		console.log('WebSocket Error ' + error);
	};

	// Log messages from the server
	connection.onmessage = function (e) {
		receiveCallBack(JSON.parse(e.data));
	};

	return connection;
};

ApiBridge.prototype.sendRequest = function (endpoint, method, data, callback) {

	console.log('sendRequest', endpoint, method, data);

		var xhr = new XMLHttpRequest();
		xhr.open(method, this.getServerEndpoint() + endpoint, true);
		xhr.onload = function (event) {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var payload = JSON.parse(xhr.responseText);
				callback(payload);
			}
		};

		if (typeof data === 'object' && data !== null) {
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(data));
		}
		else {
			xhr.send(null);
		}
};

ApiBridge.prototype.enableMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.disableMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.getMockList = function (callback) {
	this.sendRequest("/api/mocks", "GET", null, callback);
};

ApiBridge.prototype.deleteMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "DELETE", null, callback);
};

ApiBridge.prototype.createMock = function (data, callback) {
	this.sendRequest("/api/mocks", "POST", data, callback);
};

ApiBridge.prototype.getReturnedMocks = function (limit, callback) {
	this.sendRequest("/api/mocks/getReturnedMocks" + "?limit=" + limit, "GET", null, callback);
};

ApiBridge.prototype.getRequestList = function (callback) {
	this.sendRequest("/api/requests", "GET", null, callback);
};

ApiBridge.prototype.clearRequestList = function (callback) {
	this.sendRequest("/api/requests", "DELETE", null, callback);
};

ApiBridge.prototype.getMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "GET", null, callback);
};

ApiBridge.prototype.getRequest = function (requestId, callback) {
	this.sendRequest("/api/requests/" + requestId, "GET", null, callback);
};

ApiBridge.prototype.getMockSetList = function(callback) {
	this.sendRequest("/api/mock-sets", "GET", null, callback);
};

ApiBridge.prototype.getMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId, "GET", null, callback);
};

ApiBridge.prototype.deleteMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId, "DELETE", null, callback);
};

ApiBridge.prototype.enableMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.enableAllMockSets = function(callback) {
	this.sendRequest("/api/mock-sets/enableAll", "PUT", null, callback);
};

ApiBridge.prototype.disableMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.disableAllMockSets = function(callback) {
	this.sendRequest("/api/mock-sets/disableAll", "PUT", null, callback);
};

ApiBridge.prototype.createMockSet = function(data, callback) {
	this.sendRequest("/api/mock-sets", "POST", data, callback);
};

/**
 * Returns the server endpoint/host to which the requests will be send. The value will be retrieved from the local storage.
 *
 * @return {String} Returns the server endpoint/host to which the requests will be send.
 * **/
ApiBridge.prototype.getServerEndpoint = function () {
	return location.protocol
		+ '//' + location.hostname + (location.port ? ':' + location.port : '');
};