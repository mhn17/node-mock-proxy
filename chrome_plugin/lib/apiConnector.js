chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('callApi', request.endpoint, request.method, request.data);

		var xhr = new XMLHttpRequest();
		xhr.open(request.method, localStorage.mockProxyServerTargetEndpoint + request.endpoint, false);

		if (typeof request.data === 'object' && request.data !== null) {
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(request.data));
		}
		else {
			xhr.send();
		}

		var result = xhr.responseText;
		var jsonResult = JSON.parse(result)

		sendResponse(jsonResult);
	});