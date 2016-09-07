
document.addEventListener('DOMContentLoaded', function () {

	// Stuff to list mocks
	var containerList = document.getElementById('containerList');
	var listMocksButton = document.getElementById('refreshMocksButton');

	var manuallyCreateMock = document.getElementById('manuallyCreateMock');
	var containerManuallyCreate = document.getElementById('containerManuallyCreate');

	var requestList = document.getElementById("requestsPane");
	var listRequestButton = document.getElementById('refreshRequestsButton');

	var trackedMocksPane = document.getElementById("trackedMocksPane");

	// start with mocklist
	window.setTimeout(function() {
		listMocksButton.click();
	}, 10);


	// Stuff to list requests
	// ***********************************************************
	listRequestButton.addEventListener('click', function () {

		containerList.style.display = 'none';
		containerManuallyCreate.style.display = 'none';
		requestList.style.display = 'block';
		trackedMocksPane.style.display = 'none';

		// Get the list of requests and add them to the list
		apiBridge.getRequestList(function (requestList) {
			// Delete old content
			var contentTableBody = document.getElementById("requestList").getElementsByTagName("tbody")[0];
			contentTableBody.innerHTML = "";

			// Create new element and add results!
			// Gets a lot shorter when I find out how to use jQuery in here properly
			requestList.forEach(function (entry) {
				var tableRow = document.createElement("tr");
				var tableCell;

				// Add different text information
				// ***********************************************************

				// Uri
				textNode = document.createTextNode(entry.requestUri);
				tableCell = document.createElement("td");
				tableCell.appendChild(textNode);
				tableRow.appendChild(tableCell);

				// Method
				textNode = document.createTextNode(entry.method);
				tableCell = document.createElement("td");
				tableCell.appendChild(textNode);
				tableRow.appendChild(tableCell);

				// Button to add the request to the mocks
				// ***********************************************************
				var addButton = document.createElement("button");
				tableCell = document.createElement("td");
				addButton.innerHTML = "Add";

				// Register event listener to checkboxes
				addButton.addEventListener("click", function () {
					createMockFromRequest(entry);
				});

				tableCell.appendChild(addButton);
				tableRow.appendChild(tableCell);

				// Button for the preview
				// ***********************************************************
				var previewButton = document.createElement("button");
				tableCell = document.createElement("td");
				previewButton.innerHTML = "Preview";

				// Register event listener to checkboxes
				previewButton.addEventListener("click", function () {
					alert("Response:\n" + entry.response);
				});

				tableCell.appendChild(previewButton);
				tableRow.appendChild(tableCell)

				// Add the whole content to the page
				// ***********************************************************
				contentTableBody.appendChild(tableRow);
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