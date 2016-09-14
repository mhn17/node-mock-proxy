

// If the local storage value does not exist (user never changed anything ot it is empty), then warn the user
// and use a default value
if (!localStorage.mockProxyServerTargetEndpoint) {
	localStorage.mockProxyServerTargetEndpoint = "http://localhost:8001";
	alert("No target endpoint configuration found. Requests target is: " + localStorage.mockProxyServerTargetEndpoint);
}


$(document).ready(function() {

	// css & bodyclass for panel or popups
	var styleSheetName = '';
	if (document.location.hash === '#popup') {
		styleSheetName = 'popup';
	}
	else {
		styleSheetName = 'panel';
	}

	$('head').append('<link rel="stylesheet" href="../css/'+styleSheetName+'.css">');
	$('body').addClass(styleSheetName);

	new UiNavigation();
});