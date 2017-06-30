console.log('onMessage.addListener loaded');

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var xhr = new XMLHttpRequest();
		xhr.open(request.method, request.endpoint, false);

		if (typeof request.data === 'object' && request.data !== null) {
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(request.data));
		}
		else {
			xhr.send();
		}

		var result = xhr.responseText;
		var jsonResult = JSON.parse(result);
		sendResponse(jsonResult);
	});