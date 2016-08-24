var apiBridge = new ApiBridge();

document.addEventListener('DOMContentLoaded', function() {

    // Stuff to list requests
	var containerList = document.getElementById('containerList');
	var listRequestButton = document.getElementById('refreshMocksButton');

	var manuallyCreateMock = document.getElementById('manuallyCreateMock');
	var containerManuallyCreate = document.getElementById('containerManuallyCreate');

	// INITIALIZE
	containerList.style.display = 'none';
	containerManuallyCreate.style.display = 'none';


	manuallyCreateMock.addEventListener('click', function() {
		containerList.style.display = 'none';
		containerManuallyCreate.style.display = 'block';

		var formSubmit = document.getElementById('form_submit');
		var form = document.getElementById('formManuallyCreate');


		form.addEventListener("submit", function(event){
			event.preventDefault();

			var data = {
				"name": document.getElementById('form_name').value,
				"description": document.getElementById('form_description').value,
				"requestUri": document.getElementById('form_requestUri').value,
				"requestMethod": document.getElementById('form_requestMethod').value,
				"requestBody": document.getElementById('form_requestBody').value,
				"responseBody": document.getElementById('form_responseBody').value
			};

			apiBridge.createMock(data, function(response) {
				console.log('createMock', response);
				listRequestButton.click();
			});


		});






	});


    listRequestButton.addEventListener('click', function() {

		containerList.style.display = 'block';
		containerManuallyCreate.style.display = 'none';

		apiBridge.getMockList(function(mockList) {
			var contentTableBody = document.getElementById("mockList").getElementsByTagName('tbody')[0];

			// delete the content
			contentTableBody.innerHTML = '';

			// Create new element and add results!
			// Gets a lot shorter when I find out how to use jQuery in here properly
			mockList.forEach(function(entry) {

				var tableRow = document.createElement("tr");
				var tableCell;

				// Enabled
				// ***********************************************************
				var enableCheckbox = document.createElement("input");
				enableCheckbox.setAttribute("type", "checkbox");
				enableCheckbox.setAttribute("id", "enable_"+entry.id);
				enableCheckbox.checked = entry.enabled;

				tableCell = document.createElement("td");
				tableCell.appendChild(enableCheckbox);
				tableRow.appendChild(tableCell);

				enableCheckbox.addEventListener("change", function(){
					if(this.checked){
						apiBridge.enableMock(entry.id, function(response) {
							console.log('enableMock', response);
						});
					} else {
						apiBridge.disableMock(entry.id, function(response) {
							console.log('disableMock', response);
						});
					}
				});


				// name
				// ***********************************************************
				var labelNode = document.createElement("label");
				labelNode.setAttribute("for", "enable_"+entry.id);
				var textNode = document.createTextNode(entry.name);
				labelNode.appendChild(textNode);
				tableCell = document.createElement("td");
				tableCell.appendChild(labelNode);
				tableRow.appendChild(tableCell);


				// description
				// ***********************************************************
				var textNode = document.createTextNode(entry.description);
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
					apiBridge.deleteMock(entry.id, function(response) {
						listRequestButton.click();
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
					alert("Response:\n" + entry.response);
				});

				contentTableBody.appendChild(tableRow);
				// Add to the page
			});

		});
	});

}, false);

/*
    for each (var item in jsonResult) {
        var para = document.createElement("p");
        var node = document.createTextNode(item);
        para.appendChild(node);
        var element = document.getElementById("MockTest");
        element.appendChild(para);
     }*/