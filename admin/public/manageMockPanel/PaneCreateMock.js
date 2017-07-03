// Constructor to init stuff
var PaneCreateMock = function() {
	this.__providePaneElements();
	this.apiBridge = new ApiBridge();
	this.languageDetector = new LanguageDetector();
	this.bindEvents();
};

// Reset the form to its empty state
PaneCreateMock.prototype.draw = function(data) {
	var that = this;

	// Reset form to default sate before doing anything
	this.$form.trigger('reset');
	$('#form_id').val('');

	// Hide the delete button if a mock is being created
	this.$deleteButton.hide();

	// If no data was given do not try to fill anything in
	if(!data) {
		return;
	}

	// Autoformat code
	var responseBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(data.response.body);

	// Fill pane
	this.$requestUriField.val(data.request.uri);
	this.$requestMethodField.val(data.request.method);
	this.$responseBodyField.val(responseBodyFormatted);

	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (data.id) {
		this.$idField.val(data.id);
		// Display delete button if a mock gets edited
		this.$deleteButton.show();
	}

	if (data.name) {
		this.$nameField.val(data.name);
	}

	if (data.description) {
		this.$descField.val(data.description);
	}

	if (data.statusCode) {
		this.$statusCodeField.val(data.statusCode);
	}

	if (data.request.body) {
		this.$requestBodyField.val(data.request.body);
	}

	// Check the checkbox, if the mock is enabled
	this.apiBridge.getMockList(function (mockList) {
		var resultMock = mockList.find(function (mock) {
			return mock.id === data.id;
		});

		if(resultMock && resultMock.enabled) {
			that.$enableMockCheckbox.prop('checked', true);
		}
	});
};

// Bind events to send the request to the server
PaneCreateMock.prototype.bindEvents = function() {
	var that = this;
	this.$container.find('*.PaneCreateMock').off();

	// Jquery serialize does not create the data as we want it, grml
	// Submit the data and go back to mock list
	this.$form.on('submit.PaneCreateMock', function (event) {
		event.preventDefault();
		var requestData = that._getRequestData();

		// Send create/update request to server and enable/disable the mock afterwards
		that.apiBridge.createMock(requestData, function (response) {
			if(that.$enableMockCheckbox.is(':checked')){
				that.apiBridge.enableMock(response.id, function () {
					that.draw();
					new UiNavigation().switchPanel('PaneMockList');
				});
			} else {
				that.apiBridge.disableMock(response.id, function () {
					that.draw();
					new UiNavigation().switchPanel('PaneMockList');
				})
			}
		});
	});

	// Update the mock without going to the mock list and enable/disable the mock afterwards
	this.$form.on('click.PaneMockList', 'button[data-action=apply]', function (event) {
		event.preventDefault();
		var requestData = that._getRequestData();

		// Send create/update request to server
		that.apiBridge.createMock(requestData, function (response) {
			if(that.$enableMockCheckbox.is(':checked')){
				that.apiBridge.enableMock(response.id, function () {
					that.$idField.val(response.id);
					that.draw(that._getRequestData());
				});
				that.draw(requestData);
			} else {
				that.apiBridge.disableMock(response.id, function () {
					that.$idField.val(response.id);
					that.draw(that._getRequestData());
				});
			}
		});
	});

	// Delete this mock
	this.$form.on('click.PaneMockList', 'button[data-action=delete]', function (event) {
		event.preventDefault();

		// Deletes the mock on the server and redirects the user to the mock list
		that.apiBridge.deleteMock(that.$idField.val(), function (response) {
			new UiNavigation().switchPanel('PaneMockList');
		});
	});
};

// Gets the data from the form fields, creates an object out of them and returns it for further usage for the createMock request
PaneCreateMock.prototype._getRequestData = function () {
	return {
		'id': this.$idField.val(),
		'name': this.$nameField.val(),
		'description': this.$descField.val(),
		'statusCode': this.$statusCodeField.val(),
		'request': {
			'uri': this.$requestUriField.val(),
			'method': this.$requestMethodField.val(),
			'body': this.$requestBodyField.val()
		},
		'response': {
			'body': this.$responseBodyField.val()
		}
	};
};

// Provide form elements to avoid multiple declarations
PaneCreateMock.prototype.__providePaneElements = function () {
	this.$container = $('#PaneCreateMock');
	this.$form = $('#formManuallyCreate');
	this.$idField = this.$container.find('#form_id');
	this.$nameField = this.$container.find('#form_name');
	this.$descField = this.$container.find('#form_description');
	this.$statusCodeField = this.$container.find('#form_statusCode');
	this.$requestUriField = this.$container.find('#form_requestUri');
	this.$requestMethodField = this.$container.find('#form_requestMethod');
	this.$requestBodyField = this.$container.find('#form_requestBody');
	this.$responseBodyField = this.$container.find('#form_responseBody');
	this.$deleteButton = this.$container.find('#deleteMockButton');
	this.$enableMockCheckbox = this.$container.find('#activateMockCheckbox');
};