var apiBridge = new ApiBridge();

// If the local storage value does not exist (user never changed anything ot it is empty), then warn the user
// and use a default value
if (!localStorage.mockProxyServerTargetEndpoint) {
    localStorage.mockProxyServerTargetEndpoint = "http://localhost:8001";
    alert("No target endpoint configuration found. Requests target is: " + localStorage.mockProxyServerTargetEndpoint);
}


document.addEventListener('DOMContentLoaded', function () {

    // css & bodyclass for panel or popups
    var styleSheetName = '';
    if (document.location.hash === '#popup') {
        styleSheetName = 'popup';
    }
    else {
        styleSheetName = 'panel';
    }

    // css
    var styleSheet = document.createElement('link');
    styleSheet.setAttribute('rel', 'stylesheet');
    styleSheet.setAttribute('href', '../css/'+styleSheetName+'.css');
    document.getElementsByTagName('head')[0].appendChild(styleSheet);

    // bodyclass
    var body = document.getElementsByTagName('body')[0];
    body.setAttribute('class', (body.getAttribute('class') ? body.getAttribute('class'):'') +' '+styleSheetName);



    // Stuff to list mocks
    var containerList = document.getElementById('containerList');
    var listMocksButton = document.getElementById('refreshMocksButton');
    var trackMockStateInMockListCheckbox = document.getElementById('changeTrackMockStateInMockListCheckbox');
    var trackMockStateInMockListField = document.getElementById('limitOfTrackedMockInMockListField');
    var trackMocksInMockListTimer;

    var manuallyCreateMock = document.getElementById('manuallyCreateMock');
    var containerManuallyCreate = document.getElementById('containerManuallyCreate');

    var requestList = document.getElementById("requestsPane");
    var listRequestButton = document.getElementById('refreshRequestsButton');

    var trackedMocksPane = document.getElementById("trackedMocksPane");
    var trackMocksButton = document.getElementById('trackReturnedMocksButton');
    var trackMocksCheckbox = document.getElementById("changeTrackMocksStateCheckbox");
    var trackMocksTimer;

    // start with mocklist
    window.setTimeout(function() {
        listMocksButton.click();
    }, 10);


    // INITIALIZE
    containerList.style.display = 'none';
    containerManuallyCreate.style.display = 'none';
    requestList.style.display = 'none';
    trackedMocksPane.style.display = 'none';

    // Stuff to list tracked mocks
    // ***********************************************************
    trackMocksButton.addEventListener('click', function () {
        containerList.style.display = 'none';
        containerManuallyCreate.style.display = 'none';
        requestList.style.display = 'none';
        trackedMocksPane.style.display = 'block';

        refreshTrackMockTable();
    }, false);

    // Activly track last returned mocks
    trackMocksCheckbox.addEventListener("click", function(){
        if(trackMocksCheckbox.checked){
            trackMocksTimer = window.setInterval(refreshTrackMockTable, 2000);
        }else{
            window.clearInterval(trackMocksTimer);
        }
    });

    function refreshTrackMockTable(limit){
        var trackMocksLimitField = document.getElementById("limitOfTrackedMocksField");

        apiBridge.getReturnedMocks(trackMocksLimitField.value, function (mockList) {
            var contentTableBody = document.getElementById("trackMockList").getElementsByTagName('tbody')[0];

            // Delete the content
            contentTableBody.innerHTML = '';

            // Create new element and add results!
            // Gets a lot shorter when I find out how to use jQuery in here properly
            mockList.forEach(function (mockData) {

                var tableRow = document.createElement("tr");
                var tableCell;

                // Name
                // ***********************************************************
                var labelNode = document.createElement("label");
                labelNode.setAttribute("for", "enable_" + mockData.id);
                var textNode = document.createTextNode(mockData.name);
                labelNode.appendChild(textNode);
                tableCell = document.createElement("td");
                tableCell.appendChild(labelNode);
                tableRow.appendChild(tableCell);

                // Description
                // ***********************************************************
                var textNode = document.createTextNode(mockData.description);
                tableCell = document.createElement("td");
                tableCell.appendChild(textNode);
                tableRow.appendChild(tableCell);

                // Button for the preview
                // ***********************************************************
                var previewButton = document.createElement("button");
                previewButton.innerHTML = "Preview";

                tableCell = document.createElement("td");
                tableCell.appendChild(previewButton);
                tableRow.appendChild(tableCell);

                // Register event listener to checkboxes
                previewButton.addEventListener("click", function () {
                    alert("Response:\n" + mockData.requestBody);
                });

                // Add the whole content to the page
                // ***********************************************************
                contentTableBody.appendChild(tableRow);
            });
        });
    }

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

    // Save last request as mock
    // ***********************************************************
    var saveLastRequestButton = document.getElementById('saveLastRequest');
    saveLastRequestButton.addEventListener('click', function () {
        apiBridge.getRequestList(function (requestList) {
            // Need extra error handling here?
            var lastRequest = requestList[requestList.length - 1];

            createMockFromRequest(lastRequest);
        });
    });

    // Clear the request list
    // ***********************************************************
    var clearRequestButton = document.getElementById('clearRequests');
    clearRequestButton.addEventListener('click', function () {
        apiBridge.clearRequestList(function () {
            console.log("Request list cleared.");
            listRequestButton.click();
        });
    }, false);

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

    // Stuff to list mocks
    // ***********************************************************
    listMocksButton.addEventListener('click', function () {

        containerList.style.display = 'block';
        containerManuallyCreate.style.display = 'none';
        requestList.style.display = 'none';
        trackedMocksPane.style.display = 'none';

        apiBridge.getMockList(function (mockList) {
            var contentTableBody = document.getElementById("mockList").getElementsByTagName('tbody')[0];

            // delete the content
            contentTableBody.innerHTML = '';

            // Create new element and add results!
            // Gets a lot shorter when I find out how to use jQuery in here properly
            mockList.forEach(function (mockData) {

                var tableRow = document.createElement("tr");
                var tableCell;

                // Enabled
                // ***********************************************************
                var enableCheckbox = document.createElement("input");
                enableCheckbox.setAttribute("type", "checkbox");
                enableCheckbox.setAttribute("id", "enable_" + mockData.id);
                enableCheckbox.checked = mockData.enabled;

                tableCell = document.createElement("td");
                tableCell.appendChild(enableCheckbox);
                tableRow.appendChild(tableCell);

                enableCheckbox.addEventListener("change", function () {
                    if (this.checked) {
                        apiBridge.enableMock(mockData.id, function (response) {
                            console.log('enableMock', response);
                        });
                    } else {
                        apiBridge.disableMock(mockData.id, function (response) {
                            console.log('disableMock', response);
                        });
                    }
                });

                // Name
                // ***********************************************************
                var labelNode = document.createElement("div");
                labelNode.setAttribute("for", "enable_" + mockData.id);
                var textNode1 = document.createTextNode(mockData.name);
                labelNode.appendChild(textNode1);
                tableCell = document.createElement("td");
                tableCell.appendChild(labelNode);
                tableRow.appendChild(tableCell);

                // Description
                // ***********************************************************
                var textNode = document.createTextNode(mockData.description);
                tableCell = document.createElement("td");
                tableCell.appendChild(textNode);
                tableRow.appendChild(tableCell);

                // Track mock state
                // ***********************************************************
                var mockTrackedStateLabelNode = document.createElement("label");
                mockTrackedStateLabelNode.setAttribute("id", mockData.id);
                //var mockTrackedtextNode = document.createTextNode(mockdata.name);
                //mockTrackedStateLabelNode.appendChild(mockTrackedtextNode);
                tableCell = document.createElement("td");
                tableCell.appendChild(mockTrackedStateLabelNode);
                tableRow.appendChild(tableCell);


                var toolsTableCell = document.createElement("td");
                // Delete button
                // ***********************************************************
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "Delete";
                toolsTableCell.appendChild(deleteButton);

                // Send delete request and refresh mock list
                deleteButton.addEventListener("click", function () {
                    apiBridge.deleteMock(mockData.id, function (response) {
                        listMocksButton.click();
                        console.log('deleteMock', response);
                    });
                });


                // Button for the preview
                // ***********************************************************
                var previewButton = document.createElement("button");
                previewButton.innerHTML = "Preview";

                toolsTableCell.appendChild(previewButton);

                // Register event listener to checkboxes
                previewButton.addEventListener("click", function () {
                    alert("Response:\n" + mockData.response.body);
                });

                // Button for edit
                // ***********************************************************
                var editButton = document.createElement("button");
                editButton.innerHTML = "Edit";

                toolsTableCell.appendChild(editButton);



                // Register event listener to checkboxes
                editButton.addEventListener("click", function () {
                    updateMock(mockData);
                });

                tableRow.appendChild(toolsTableCell);

                // Add to the page
                contentTableBody.appendChild(tableRow);
            });

        });
        refreshTrackedMocksInMockList();
    });

    // Actively track last returned mocks in mocklist
    trackMockStateInMockListCheckbox.addEventListener("click", function(){
        if(trackMockStateInMockListCheckbox.checked){
            trackMocksInMockListTimer = window.setInterval(refreshTrackedMocksInMockList, 2000);
        }else{
            window.clearInterval(trackMocksInMockListTimer);
        }
    });

    // Gets the mocks which were returned to the caller and display them in the fields
    function refreshTrackedMocksInMockList(){
        apiBridge.getReturnedMocks(trackMockStateInMockListField.value, function(mockList){

            var contentTableBody = document.getElementById("mockList").getElementsByTagName('tbody')[0];
            var labelFields = Array.from(contentTableBody.getElementsByTagName("label"));
            var resultLabelList = [];

            // Clear the previous content of the labels
            labelFields.forEach(function(labelField){
                labelField.textContent = "";
            });

            // Go through all mocks
            mockList.forEach(function(mock){
                // Go through all labels
                labelFields.forEach(function(labelField){
                    // If the id of mock and label are identical and the label has not already been added add it
                    if(mock.id === labelField.id){
                        if(resultLabelList.indexOf(labelField) < 0){
                            resultLabelList.push(labelField);
                        }
                    }
                });
            });

            // Go through result list and set classes and add text
            resultLabelList.forEach(function(labelField, index){
                labelField.setAttribute("class", "recentlyActive");
                labelField.textContent = index;
            });
        });
    }
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