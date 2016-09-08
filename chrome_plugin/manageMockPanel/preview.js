var Preview = function() {

	this.supportedLanguages = ['xml', 'json'];
	this.bindEvents();
	this.content = '';
};

Preview.prototype.bindEvents = function() {
	var that = this;

	$(document).unbind('.preview')

	$('#previewWindow #previewLanguage button')
		.off('click.preview')
		.on('click.preview', function() {
			var mode = $(this).data('language');
			that.show(mode);
		});

	$('#previewWindow .closeButton')
		.off('click.preview')
		.on('click.preview', function() {
				var mode = $(this).data('language');
			that.close();
		});
};

Preview.prototype.autoDetectLanguage = function() {
	var language = null;
	var autoDetect = hljs.highlightAuto(this.content);
	if ($.inArray(autoDetect.language, this.supportedLanguages) !== -1) {
		language = autoDetect.language;
	}
	else {
		if ($.inArray(autoDetect.second_best.language, this.supportedLanguages) !== -1) {
			language = autoDetect.second_best.language;
		}
	}
	return language;
};

Preview.prototype.setContent = function(content) {
	this.content = content;
	return this;
};

Preview.prototype.show = function(language) {

	if (typeof(language) === 'undefined') {
		language = this.autoDetectLanguage();
	}

	var content = this.content;
	try {
		if (language === 'xml') {
			content = vkbeautify.xml(content);
		}

		if (language === 'json') {
			content = vkbeautify.json(content);
		}

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

Preview.prototype.close = function(language) {
	$('#previewWindow').hide();
};