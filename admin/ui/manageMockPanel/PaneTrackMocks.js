var PaneTrackMocks = function() {

	this.$container = $('#PaneTrackMocks');
	this.apiBridge = new ApiBridge();
	this.preview = new UiPreview();				// The preview window object

	this.bindEvents();
};

PaneTrackMocks.prototype.draw = function() {
	var that = this;

	var $contentTableBody = that.$container.find('tbody');
	// Remove old content in order to add data to the already existing data and draw the table anew
	$contentTableBody.empty();

	this.apiBridge.getReturnedMocks(5, function (mockList) {
		var tableContent = '';

		mockList.forEach(function (mock, index) {
			var rowContent = '';
			rowContent += '<td>' + index + '</td>';
			rowContent += '<td>' + mock.name + '</td>';
			rowContent += '<td>' + mock.description + '</td>';
			rowContent += '<td>';
			rowContent += '<button data-mock-data="' + encodeURI(mock.response.body) + '" data-action="preview">Preview</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		});

		$contentTableBody.append($(tableContent));
	});
};

PaneTrackMocks.prototype.bindEvents = function() {
	var that = this;

	this.$container.find('*.PaneTrackMocks').off();

	this.$container.on('click.PaneTrackMocks', 'button[data-action=preview]', function () {
		var mockData = decodeURI($(this).data('mockData'));
		that.preview.setContent(mockData).show();
	});
};

