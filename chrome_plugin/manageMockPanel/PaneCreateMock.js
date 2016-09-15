// Constructor to init stuff
var PaneCreateMock = function() {

	this.$container = $('#PaneCreateMock');
	this.$form = $('#formManuallyCreate');
	this.apiBridge = new ApiBridge();

	this.bindEvents();
};

// Reset the form to its empty state
PaneCreateMock.prototype.draw = function() {
	this.$form.trigger('reset');
};

// Bind events to send the request to the server
PaneCreateMock.prototype.bindEvents = function() {

	var that = this;

	// Jquery serialize does not create the data as we want it, grml
	this.$form.submit(function (event) {
		event.preventDefault();
		var data = {
			'id': document.getElementById('form_id').value,
			'name': document.getElementById('form_name').value,
			'description': document.getElementById('form_description').value,
			'requestUri': document.getElementById('form_requestUri').value,
			'requestMethod': document.getElementById('form_requestMethod').value,
			'requestBody': document.getElementById('form_requestBody').value,
			'responseBody': document.getElementById('form_responseBody').value
		};

		// Send create/update request to server
		that.apiBridge.createMock(data, function (response) {
			console.log('createMock', response);
			that.draw();
		});
	});

};