var PaneShowRequests = function() {

	this.$container = $('#PaneShowRequests');
	this.apiBridge = new ApiBridge();

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
			rowContent += '<button>Add</button>';
			rowContent += '<button>Preview</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		});

		$contentTableBody.append($(tableContent));
	});
};

PaneShowRequests.prototype.bindEvents = function() {

};

