// Constructor to init stuff
var PaneCreateMock = function() {

	this.$container = $('#PaneCreateMock');
	this.$form = $('#formManuallyCreate');
	this.apiBridge = new ApiBridge();
	this.languageDetector = new LanguageDetector();
	this.bindEvents();
};

// Reset the form to its empty state
PaneCreateMock.prototype.draw = function() {
	this.$form.trigger('reset');
	$('#form_id').val('');
};

// Bind events to send the request to the server
PaneCreateMock.prototype.bindEvents = function() {

	var that = this;

	// Jquery serialize does not create the data as we want it, grml
	this.$form.submit(function (event) {
		event.preventDefault();
		var data = {
			'id': $('#form_id').val(),
			'name': $('#form_name').val(),
			'description': $('#form_description').val(),
			'requestUri': $('#form_requestUri').val(),
			'requestMethod': $('#form_requestMethod').val(),
			'requestBody': $('#form_requestBody').val(),
			'responseBody': $('#form_responseBody').val()
		};

		// Send create/update request to server
		that.apiBridge.createMock(data, function (response) {
			console.log('createMock', response);
			that.draw();
			new UiNavigation().switchPanel('PaneMockList');
		});
	});
};

// Fills the the create new mock form
PaneCreateMock.prototype.fillCreateMockFields = function (id, name, desc, requestUri, method, requestBody, responseBody) {
	var $createMockButton = $('#manuallyCreateMock');
	var $idField = $('#form_id');
	var $nameField = $('#form_name');
	var $descField = $('#form_description');
	var $requestUriField = $('#form_requestUri');
	var $requestMethodField = $('#form_requestMethod');
	var $requestBodyField = $('#form_requestBody');
	var $responseBodyField = $('#form_responseBody');

	// Go to create tab
	new UiNavigation().switchPanel('PaneCreateMock');

	// Autoformat code
	var responseBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(responseBody);
	var requestBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(requestBody);

	// Fill pane
	$requestUriField.val(requestUri);
	$requestMethodField.val(method);
	$responseBodyField.val(responseBodyFormatted);

	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (id) {
		$idField.val(id);
	}

	if (name) {
		$nameField.val(name);
	}

	if (desc) {
		$descField.val(desc);
	}

	if (requestBodyFormatted) {
		$requestBodyField.val(requestBodyFormatted);
	}
}