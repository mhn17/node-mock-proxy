var PaneShowRequests = function() {

	this.$container = $('#PaneShowRequests');
	this.apiBridge = new ApiBridge();
	this.preview = new UiPreview();				// The preview window object

	this.bindEvents();
};

// Draw pane
PaneShowRequests.prototype.draw = function() {
	var that = this;
	console.log(this.$container);
	// Get requests and fill table
	this.apiBridge.getRequestList(function (requestList) {
		var $contentTableBody = that.$container.find('tbody');
		var tableContent = '';

		// Remove old content in order to add data to the already existing data and draw the table anew
		$contentTableBody.empty();

		// Draw table content
		requestList.forEach(function (entry) {
			var rowContent = '';
			rowContent += '<td><label>' + entry.requestUri + '</label></td>';
			rowContent += '<td><label>' + entry.method + '</label></td>';
			rowContent += '<td>';
			rowContent += '<button data-request-id="' + entry.id + '" data-action="addToMock">Add</button>';
			rowContent += '<button data-request-data="' + encodeURI(entry.response) + '" data-action="requestPreview">Preview</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		});

		$contentTableBody.append($(tableContent));
	});
};

// Bind buttons to actions
PaneShowRequests.prototype.bindEvents = function() {
	var that = this;

	// Show preview
	this.$container.on('click', 'button[data-action=requestPreview]', function() {
		console.log(this);
		var requestData = decodeURI($(this).data('request-data'));
		that.preview.setContent(requestData).show();
	});

	// Delete all requests
	this.$container.on('click', 'button[data-action=deleteRequests]', function() {
		that.apiBridge.clearRequestList(function (response) {
			console.log('Cleared requests.', response);
			that.draw();
		});
	});

	this.$container.on('click', 'button[data-action=addToMock]', function() {
		alert($(this).data('request-id'));
		that.apiBridge.getRequest($(this).data('request-id'), function (response) {
			console.log('Add to mocks.', response);
			alert(JSON.stringify(response));
			//new PaneCreateMock().fillCreateMockFields(null,);
		});
	});
};

