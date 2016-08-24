var ApiConnector = function() {

};

ApiConnector.prototype.callApi =  function(endpoint, method, data, callback) {
	console.log('callApi', endpoint, method, data, callback);

	var xhr = new XMLHttpRequest();
	xhr.open(method, localStorage.mockProxyServerTargetEndpoint + endpoint, false);

	if (typeof data === 'object' && data !== null) {
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(JSON.stringify(data));
	}
	else {
		xhr.send();
	}

	var result = xhr.responseText;
	var jsonResult = JSON.parse(result)
	// port.postMessage({result: jsonResult});

	console.log('callApi', endpoint, method, data, callback);

	callback(jsonResult);
};


