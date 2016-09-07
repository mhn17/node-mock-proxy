var apiBridge = new ApiBridge();

// If the local storage value does not exist (user never changed anything ot it is empty), then warn the user
// and use a default value
if (!localStorage.mockProxyServerTargetEndpoint) {
	localStorage.mockProxyServerTargetEndpoint = "http://localhost:8001";
	alert("No target endpoint configuration found. Requests target is: " + localStorage.mockProxyServerTargetEndpoint);
}


document.addEventListener('DOMContentLoaded', function () {

	// css & bodyclass for panel or popups
	var styleSheetName = '';
	if (document.location.hash === '#popup') {
		styleSheetName = 'popup';
	}
	else {
		styleSheetName = 'panel';
	}

	// css
	var styleSheet = document.createElement('link');
	styleSheet.setAttribute('rel', 'stylesheet');
	styleSheet.setAttribute('href', '../css/'+styleSheetName+'.css');
	document.getElementsByTagName('head')[0].appendChild(styleSheet);

	// bodyclass
	var body = document.getElementsByTagName('body')[0];
	body.setAttribute('class', (body.getAttribute('class') ? body.getAttribute('class'):'') +' '+styleSheetName);


	var listMocksButton = document.getElementById('refreshMocksButton');
	var containerList = document.getElementById('containerList');
	var manuallyCreateMock = document.getElementById('manuallyCreateMock');
	var requestList = document.getElementById("requestsPane");
	var trackedMocksPane = document.getElementById("trackedMocksPane");

	containerList.style.display = 'none';
	containerManuallyCreate.style.display = 'none';
	requestList.style.display = 'none';
	trackedMocksPane.style.display = 'none';


	window.setTimeout(function() {
		listMocksButton.click();
	}, 10);

}, false);
