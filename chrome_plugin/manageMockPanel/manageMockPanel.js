var apiBridge = new ApiBridge();

document.addEventListener('DOMContentLoaded', function() {

    // Stuff to list requests
    var listRequestButton = document.getElementById('refreshMocksButton');
    listRequestButton.addEventListener('click', function() {

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
							console.log('enableMock', respsone);
						});
					} else {
						apiBridge.disableMock(entry.id, function(response) {
							console.log('disableMock', respsone);
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
						console.log('deleteMock', respsone);
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