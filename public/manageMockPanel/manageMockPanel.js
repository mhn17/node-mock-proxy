
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

	$('head').append('<link rel="stylesheet" href=' + styleSheetName + '"../css/.css">');
	$('body').addClass(styleSheetName);

	new UiNavigation();
});