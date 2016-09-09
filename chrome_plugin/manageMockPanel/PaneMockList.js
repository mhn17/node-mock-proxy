var PaneMockList = function() {

	this.$container = $('#mockList');
	this.apiBridge = new ApiBridge();
	this.preview = new Preview();

	this.bindEvents();
	this.draw();
};

PaneMockList.prototype.draw = function() {
	var that = this;
	this.apiBridge.getMockList(function (mockList) {

		var $contentTableBody = that.$container.find('tbody');
		$contentTableBody.html();

		mockList.forEach(function (mockData) {
			var rowContent = '';
			rowContent += '<td><input data-mock-id="' + mockData.id + '" data-action="enableMock" type="checkbox" id="enable_' + mockData.id + '" ' + (mockData.enabled ? 'checked' : '') + '></td>';
			rowContent += '<td><label for="enable_' + mockData.id + '">' + mockData.name + '</label></td>';
			rowContent += '<td>' + mockData.description + '</td>';
			rowContent += '<td><span class="mockActivated" data-mock-id="' + mockData.id + '"></span></td>';
			rowContent += '<td>';
			rowContent += '<button data-mock-id="' + mockData.id + '" data-action="delete">Delete</button>';
			rowContent += '<button data-mock-data="' + encodeURI(mockData.response.body) + '" data-action="preview">Preview</button>';
			rowContent += '<button data-mock-id="' + mockData.id + '" data-action="edit">Edit</button>';
			rowContent += '</td>';

			$contentTableBody.append($('<tr>' + rowContent + '</tr>'));
		});
	});
};

PaneMockList.prototype.bindEvents = function() {
	var that = this;

	this.$container.on('change', 'input[data-action=enableMock]', function() {
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
	});

	this.$container.on('click', 'button[data-action=delete]', function() {
		var mockId = $(this).data('mockId');
		that.apiBridge.deleteMock(mockId, function (response) {
			console.log('deleteMock', response);
		});
	});

	this.$container.on('click', 'button[data-action=preview]', function() {
		var mockData = decodeURI($(this).data('mockData'));
		that.preview.setContent(mockData).show();
	});

	this.$container.on('click', 'button[data-action=edit]', function() {

	});


};

