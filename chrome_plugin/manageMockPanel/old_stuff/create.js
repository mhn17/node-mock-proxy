
document.addEventListener('DOMContentLoaded', function () {


	// Stuff to list mocks
	var containerList = document.getElementById('containerList');
	var listMocksButton = document.getElementById('refreshMocksButton');

	var manuallyCreateMock = document.getElementById('manuallyCreateMock');
	var containerManuallyCreate = document.getElementById('containerManuallyCreate');

	var requestList = document.getElementById("requestsPane");

	var trackedMocksPane = document.getElementById("trackedMocksPane");

	// Stuff to manually create mocks
	// ***********************************************************
	manuallyCreateMock.addEventListener('click', function () {
		containerList.style.display = 'none';
		requestList.style.display = 'none';
		containerManuallyCreate.style.display = 'block';
		trackedMocksPane.style.display = 'none';

		var formSubmit = document.getElementById('form_submit');
		var form = document.getElementById('formManuallyCreate');

		// Clear form data
		document.getElementById("form_id").value = "";
		form.reset();

		form.addEventListener("submit", function (event) {
			event.preventDefault();

			var data = {
				"id": document.getElementById('form_id').value,
				"name": document.getElementById('form_name').value,
				"description": document.getElementById('form_description').value,
				"requestUri": document.getElementById('form_requestUri').value,
				"requestMethod": document.getElementById('form_requestMethod').value,
				"requestBody": document.getElementById('form_requestBody').value,
				"responseBody": document.getElementById('form_responseBody').value
			};

			apiBridge.createMock(data, function (response) {
				console.log('createMock', response);
				listMocksButton.click();
			});


		});
	});

}, false);

// Function to fill the create new mock form to create a new mock
function createMockFromRequest(request) {
	if (request.requestBody && request.requestBody != null && Object.keys(request.requestBody).length > 0) {
		fillCreateMockFields(null, null, null,
							 request.requestUri, request.method, request.requestBody, request.response);
	} else {
		fillCreateMockFields(null, null, null,
							 request.requestUri, request.method, null, request.response);
	}
}

// Function to fill the create new mock form to update an existing mock
function updateMock(mockData) {
	// Only set id if it exists
	fillCreateMockFields(mockData.id, mockData.name, mockData.description,
						 mockData.request.uri, mockData.request.method,
						 mockData.request.body, mockData.response.body);
}

// Fills the the create new mock form
function fillCreateMockFields(id, name, desc, requestUri, method, requestBody, responseBody) {
	var createMockButton = document.getElementById("manuallyCreateMock");
	var idField = document.getElementById("form_id");
	var nameField = document.getElementById("form_name");
	var descField = document.getElementById("form_description");
	var requestUriField = document.getElementById("form_requestUri");
	var requestMethodField = document.getElementById("form_requestMethod");
	var requestBodyField = document.getElementById("form_requestBody");
	var responseBodyField = document.getElementById("form_responseBody");

	// Go to tab
	createMockButton.click();

	// Fill pane
	requestUriField.value = requestUri;
	requestMethodField.value = method;
	responseBodyField.value = responseBody;

	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (id) {
		idField.value = id;
	}

	if (name) {
		nameField.value = name;
	}

	if (desc) {
		descField.value = desc;
	}

	if (requestBody) {
		requestBodyField.value = requestBody;
	}
}