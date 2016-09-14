// Constructor to init stuff
var UiPreview = function() {

	this.supportedLanguages = ['xml', 'json'];
	this.bindEvents();
	this.content = '';
};

// Bind events for buttons
UiPreview.prototype.bindEvents = function() {
	var that = this;

	// Unbind old events
	$(document).unbind('.preview')

	// Format code by displaying the pane anew with a parameter
	$('#previewWindow #previewLanguage button')
		.off('click.preview')
		.on('click.preview', function() {
			var mode = $(this).data('language');
			that.show(mode);
		});

	// Close by X button click
	$('#previewWindow .closeButton')
		.off('click.preview')
		.on('click.preview', function() {
				var mode = $(this).data('language');
			that.close();
		});

	// Close by pressing the escape key
	$(document).on('keydown', function(event) {
		if ($('#previewWindow').is(':visible')) {
			if (event.keyCode === 27) {
				event.preventDefault();
				that.close();
			}
		}
	});

};

// Try to autodetect language
UiPreview.prototype.autoDetectLanguage = function() {
	var language = null;
	var autoDetect = hljs.highlightAuto(this.content);

	// Try to find the best language else use the second best identified by the 3rd party library
	if ($.inArray(autoDetect.language, this.supportedLanguages) !== -1) {
		language = autoDetect.language;
	}
	else {
		if ($.inArray(autoDetect.second_best.language, this.supportedLanguages) !== -1) {
			language = autoDetect.second_best.language;
		}
	}

	// Else give plaintext
	return language;
};

UiPreview.prototype.setContent = function(content) {
	this.content = content;
	return this;
};

// Show the popup
// param language: The language is used to format the code. If no language is given, auto code formating will be tried.
UiPreview.prototype.show = function(language) {

	// Try to autoformat code if no parameter was given
	if (typeof(language) === 'undefined') {
		language = this.autoDetectLanguage();
	}

	var content = this.content;
	// Try to format code if a parameter was given
	try {
		if (language === 'xml') {
			content = vkbeautify.xml(content);
		}

		if (language === 'json') {
			content = vkbeautify.json(content);
		}

		// If no supported language was given, try autoformat.
		if (language) {
			content = hljs.highlight(language, content).value;
			$('#previewWindow').find('code').html(content);
		}
		else {
			$('#previewWindow').find('code').text(content);
		}
	}
	catch(e) {
		$('#previewWindow').find('code').text(e);
	}

	$('#previewWindow').show();
};

// Close the popup
UiPreview.prototype.close = function() {
	$('#previewWindow').hide();
};