

// If the local storage value does not exist (user never changed anything ot it is empty), then warn the user
// and use a default value
new LocalStorageHandler().setDefaultEndpointIfNoEndpointIsSet();

$(document).ready(function() {

	// css & bodyclass for panel or popups
	var styleSheetName = '';
	if (document.location.hash === '#popup') {
		styleSheetName = 'popup';
	}
	else if (document.location.hash === '#panel') {
		styleSheetName = 'panel';
	}
	else {
		styleSheetName = 'page';
	}

	$('head').append('<link rel="stylesheet" href="../css/' + styleSheetName + '.css">');
	$('body').addClass(styleSheetName);

	new UiNavigation();
});