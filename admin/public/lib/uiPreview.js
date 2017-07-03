// Constructor to init stuff
var UiPreview = function() {
	this.languageDetector = new LanguageDetector();
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

UiPreview.prototype.setContent = function(content) {
	this.content = content;
	return this;
};

// Show the popup
// param language: The language is used to format the code. If no language is given, auto code formatting will be tried.
UiPreview.prototype.show = function(language) {


	var content = this.content;

	$('#previewWindow #previewLanguage button[data-language]').removeClass('active');
	$('#previewWindow #previewLanguage button[data-language="' + language + '"]').addClass('active');

	// Try to autoformat code if no parameter was given
	if (typeof(language) === 'undefined') {
		language = this.languageDetector.autoDetectLanguage(content);
	}

	// Try to format code if a parameter was given
	try {
		content = this.languageDetector.formatCode(content, language);

		// If no supported language was given, try autoformat.
		if (language) {
			content = this.languageDetector.highlightCode(content, language);
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