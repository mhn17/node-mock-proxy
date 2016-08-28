var apiBridge = new ApiBridge();

// If the local storage value does not exist (user never changed anything ot it is empty), then warn the user
// and use a default value
if(!localStorage.mockProxyServerTargetEndpoint){
    localStorage.mockProxyServerTargetEndpoint = "http://localhost:8001";
    alert("No target endpoint configuration found. Requests target is: " + localStorage.mockProxyServerTargetEndpoint);
}

document.addEventListener('DOMContentLoaded', function() {

        // Stuff to list mocks
	var containerList = document.getElementById('containerList');
	var listMocksButton = document.getElementById('refreshMocksButton');

	var manuallyCreateMock = document.getElementById('manuallyCreateMock');
	var containerManuallyCreate = document.getElementById('containerManuallyCreate');

	var requestList = document.getElementById("requestsPane");
	var listRequestButton = document.getElementById('refreshRequestsButton');

	// INITIALIZE
	containerList.style.display = 'none';
	containerManuallyCreate.style.display = 'none';
	requestList.style.display = 'none';
        
	// Stuff to list requests
	// ***********************************************************
	listRequestButton.addEventListener('click', function() {

		containerList.style.display = 'none';
		containerManuallyCreate.style.display = 'none';
		requestList.style.display = 'block';

		// Get the list of requests and add them to the list
		apiBridge.getRequestList(function (requestList) {
                        // Delete old content
                        var contentTableBody = document.getElementById("requestList").getElementsByTagName("tbody")[0];
                        contentTableBody.innerHTML = "";
                        
                        // Create new element and add results!
                        // Gets a lot shorter when I find out how to use jQuery in here properly
                        requestList.forEach(function(entry) {
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
                            addButton.addEventListener("click", function(){
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
                            previewButton.addEventListener("click", function(){
                                    alert("Response:\n" + entry.response);
                            });
                            
                            tableCell.appendChild(previewButton);
                            tableRow.appendChild(tableCell)
                            
                            // Add the whole content to the page
                            // ***********************************************************
                            contentTableBody.appendChild(tableRow);
                    });
		});
                
            // Save last request as mock
            // ***********************************************************
            var saveLastRequestButton = document.getElementById('saveLastRequest');
            saveLastRequestButton.addEventListener('click', function() {
                apiBridge.getRequestList(function (requestList){
                    // Need extra error handling here?
                    var lastRequest = requestList[requestList.length - 1];
                    
                    createMockFromRequest(lastRequest);
                });
            });    
                
            // Clear the request list
            // ***********************************************************
            var clearRequestButton = document.getElementById('clearRequests');
            clearRequestButton.addEventListener('click', function() {
                apiBridge.clearRequestList(function(){
                        console.log("Request list cleared.");
                        alert("cleared");
                    });
                }, false);
	});


	// Stuff to manually create mocks
	// ***********************************************************
	manuallyCreateMock.addEventListener('click', function() {
		containerList.style.display = 'none';
		requestList.style.display = 'none';
		containerManuallyCreate.style.display = 'block';

		var formSubmit = document.getElementById('form_submit');
		var form = document.getElementById('formManuallyCreate');
                form.reset();
                
		form.addEventListener("submit", function(event){
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

			apiBridge.createMock(data, function(response) {
				console.log('createMock', response);
				listMocksButton.click();
			});


		});
	});

	// Stuff to list mocks
	// ***********************************************************
    listMocksButton.addEventListener('click', function() {

		containerList.style.display = 'block';
		containerManuallyCreate.style.display = 'none';
		requestList.style.display = 'none';

		apiBridge.getMockList(function(mockList) {
			var contentTableBody = document.getElementById("mockList").getElementsByTagName('tbody')[0];

			// delete the content
			contentTableBody.innerHTML = '';

			// Create new element and add results!
			// Gets a lot shorter when I find out how to use jQuery in here properly
			mockList.forEach(function(mockdata) {

				var tableRow = document.createElement("tr");
				var tableCell;

				// Enabled
				// ***********************************************************
				var enableCheckbox = document.createElement("input");
				enableCheckbox.setAttribute("type", "checkbox");
				enableCheckbox.setAttribute("id", "enable_" + mockdata.id);
				enableCheckbox.checked = mockdata.enabled;

				tableCell = document.createElement("td");
				tableCell.appendChild(enableCheckbox);
				tableRow.appendChild(tableCell);

				enableCheckbox.addEventListener("change", function(){
					if(this.checked){
						apiBridge.enableMock(mockdata.id, function(response) {
							console.log('enableMock', response);
						});
					} else {
						apiBridge.disableMock(mockdata.id, function(response) {
							console.log('disableMock', response);
						});
					}
				});


				// name
				// ***********************************************************
				var labelNode = document.createElement("label");
				labelNode.setAttribute("for", "enable_"+mockdata.id);
				var textNode = document.createTextNode(mockdata.name);
				labelNode.appendChild(textNode);
				tableCell = document.createElement("td");
				tableCell.appendChild(labelNode);
				tableRow.appendChild(tableCell);


				// description
				// ***********************************************************
				var textNode = document.createTextNode(mockdata.description);
				tableCell = document.createElement("td");
				tableCell.appendChild(textNode);
				tableRow.appendChild(tableCell);


				// delete button
				// ***********************************************************
				var deleteButton = document.createElement("button");
				deleteButton.innerHTML = "Delete";
				tableCell = document.createElement("td");
				tableCell.appendChild(deleteButton);
				tableRow.appendChild(tableCell);

				// Send delete request and refresh mock list
				deleteButton.addEventListener("click", function(){
					apiBridge.deleteMock(mockdata.id, function(response) {
						listMocksButton.click();
						console.log('deleteMock', response);
					});
				});


				// Button for the preview
				// ***********************************************************
				var previewButton = document.createElement("button");
				previewButton.innerHTML = "Preview";

				tableCell = document.createElement("td");
				tableCell.appendChild(previewButton);
				tableRow.appendChild(tableCell);

				// Register event listener to checkboxes
				previewButton.addEventListener("click", function(){
					alert("Response:\n" + mockdata.response.body);
				});
                                
                                // Button for edit
                                // ***********************************************************
                                var editButton = document.createElement("button");
                                editButton.innerHTML = "Edit";

                                tableCell = document.createElement("td");
				tableCell.appendChild(editButton);
				tableRow.appendChild(tableCell);

                                // Register event listener to checkboxes
                                editButton.addEventListener("click", function(){
                                    updateMock(mockdata);
                                });
                                
                                // Add to the page
				contentTableBody.appendChild(tableRow);
			});

		});
	});

}, false);

// Function to fill the create new mock form to create a new mock
function createMockFromRequest(request) {
        // Only set id if it exists
        fillCreateMockFields(null, null, null, 
            request.requestUri, request.method, request.requestBody, request.response);
}

// Function to fill the create new mock form to update an existing mock
function updateMock(mockData) {
        // Only set id if it exists
        fillCreateMockFields(mockData.id, mockData.name, mockData.description, 
            mockData.request.uri, mockData.request.method,
            mockData.request.body, mockData.response.body);
}

// Fills the the create new mock form
function fillCreateMockFields(id, name, desc, requestUri, method, requestBody, responseBody){
    	var createMockButton = document.getElementById("manuallyCreateMock");        
        var idField = document.getElementById("form_id");
        var nameField = document.getElementById("form_name");	
        var descField = document.getElementById("form_description");    
        var requestUriField = document.getElementById("form_requestUri");
	var requestMethodField = document.getElementById("form_requestMethod");
	var requestBodyField = document.getElementById("form_requestBody");
	var responseBodyField = document.getElementById("form_responseBody");
       // alert(desc);
	// Go to tab
	createMockButton.click();
        
	// Fill pane
	requestUriField.value = requestUri;
	requestMethodField.value = method;
	responseBodyField.value = responseBody;
        
        // Only set fields if value is not undefined to avoid the text
        // undefined in the text field  
        if(id){
            idField.value = id;
        }
        
        if(name){
            nameField.value = name;
        }
        
        if(desc){
            descField.value = desc;
        }
        
        if(requestBody){
            requestBodyField.value = requestBody;
        }
}