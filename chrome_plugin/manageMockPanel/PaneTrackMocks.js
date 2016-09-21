var PaneTrackMocks = function() {

	this.$container = $('#PaneTrackMocks');
	this.apiBridge = new ApiBridge();
	this.preview = new UiPreview();				// The preview window object

	this.bindEvents();
};

PaneTrackMocks.prototype.draw = function() {
	var that = this;

	this.apiBridge.getReturnedMocks(5, function (mockList) {
		var $contentTableBody = that.$container.find('tbody');
		var tableContent = '';

		// Remove old content in order to add data to the already existing data and draw the table anew
		$contentTableBody.empty()

		mockList.forEach(function (mock, index) {
			var rowContent = '';
			rowContent += '<td>' + index + '</td>';
			rowContent += '<td>' + mock.name + '</td>';
			rowContent += '<td>' + mock.description + '</td>';
			rowContent += '<td>';
			rowContent += '<button data-mock-data="' + encodeURI(mock.responseBody) + '" data-action="preview">Preview</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		})

		$contentTableBody.append($(tableContent));
	});
};

PaneTrackMocks.prototype.bindEvents = function() {
	var that = this;

	this.$container.on('click', 'button[data-action=preview]', function () {
		var mockData = decodeURI($(this).data('mockData'));
		that.preview.setContent(mockData).show();
	});
};

