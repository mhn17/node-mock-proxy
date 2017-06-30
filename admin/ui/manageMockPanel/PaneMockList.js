// Constructor to init stuff
var PaneMockList = function() {


	if (window.mockListSingleton) {
		return window.mockListSingleton;
	}

	this.$container = $('#PaneMockList');		// The corresponding pane
	this.apiBridge = new ApiBridge();			// The object to communicate with the proxy server
	this.preview = new UiPreview();				// The preview window object

	this.bindEvents();


// Assign singleton object
	window.mockListSingleton = this;
	return this;
};

// Draw this pane
PaneMockList.prototype.draw = function() {
	var that = this;

	// Remove old content in order to add data to the already existing data and draw the table anew
	var $contentTableBody = that.$container.find('tbody');
	//console.log("Body:");
	//console.log($contentTableBody);
	//console.log("Clear");
	$contentTableBody.empty();
	//console.log($contentTableBody);

	this.apiBridge.getMockList(function (mockList) {
		var tableContent = '';

		// Draw table content
		mockList.forEach(function (mockData) {
			var rowContent = '';
			rowContent += '<td><input data-mock-id="' + mockData.id + '" data-action="enableMock" type="checkbox" id="enable_' + mockData.id + '" ' + (mockData.enabled ? 'checked' : '') + '></td>';
			rowContent += '<td><label for="enable_' + mockData.id + '">' + mockData.name + '</label></td>';
			rowContent += '<td>' + mockData.description + '</td>';
			rowContent += '<td>' + mockData.statusCode + '</td>';
			rowContent += '<td>' + mockData.request.uri + '</td>';
			rowContent += '<td><span class="mockActivated" data-mock-action="displayTrackedMock" data-mock-id="' + mockData.id + '"></span></td>';
			rowContent += '<td>';
			rowContent += '<button data-mock-id="' + mockData.id + '" data-action="edit">Edit</button>';
			rowContent += '<button data-mock-data="' + encodeURI(mockData.response.body) + '" data-action="preview">Preview</button>';
			rowContent += '<button data-mock-id="' + mockData.id + '" data-action="delete">Delete</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		});

		$contentTableBody.append($(tableContent));
	});
};

// Bind events for checkboxes and buttons
PaneMockList.prototype.bindEvents = function() {
	var that = this;
	this.$container.find('*.PaneMockList').off();

	// Enable/Disable mock via checkbox
	this.$container.on('change.PaneMockList', 'input[data-action=enableMock]', function() {
		var mockId = $(this).data('mockId');
		if (this.checked) {
			that.apiBridge.enableMock(mockId, function (response) {
				console.log('enableMock', response);
			});
		} else {
			that.apiBridge.disableMock(mockId, function (response) {
				console.log('disableMock', response);
			});
		}

		that.draw();
	});

	// Delete mock
	this.$container.on('click.PaneMockList', 'button[data-action=delete]', function() {
		var mockId = $(this).data('mockId');
		that.apiBridge.deleteMock(mockId, function (response) {
			console.log('deleteMock', response);
            that.draw();
		});
	});

	// Show preview
	this.$container.on('click.PaneMockList', 'button[data-action=preview]', function() {
		var mockData = decodeURI($(this).data('mockData'));
		that.preview.setContent(mockData).show();
	});

	// Edit mock
	this.$container.on('click.PaneMockList', 'button[data-action=edit]', function() {
		that.apiBridge.getMock($(this).data('mockId'), function (mock) {
			new UiNavigation().switchPanel('PaneCreateMock', mock);
		});
	});

	// Track mocks
	this.$container.on('click.PaneMockList', 'button[data-action=trackMocks]', function() {
		var numberOfTrackedMocks = $('#mockListCountTrackMockField').val();

		that.apiBridge.getReturnedMocks(numberOfTrackedMocks, function (mockList) {
			var resultList = [];
			var mockTrackFields = $('span[data-mock-action="displayTrackedMock"]');

			// Go through all returned mocks
			mockList.forEach(function (mock) {
				// Get all currently displayed mock fields
				mockTrackFields.each(function () {
					// Check if returned mock id and the saved id in the field are the same
					if($(this).data('mock-id') === mock.id) {
						// If they are the same and the field was not added to the result list before, then add it now
						if(resultList.indexOf(this) < 0){
							resultList.push(this);
						}
					}
				});
			});

			// Clear old values in the labels
			mockTrackFields.each(function () {
				$(this).empty();
			});

			// Go through result list and add text
			resultList.forEach(function(labelField, index){
				labelField.textContent = index;
			});
		});
	});
};