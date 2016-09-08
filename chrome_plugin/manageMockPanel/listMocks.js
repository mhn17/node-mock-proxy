$(document).ready(function() {

	var apiBridge = new ApiBridge();
	var preview = new Preview();

	// Stuff to list mocks
	// ***********************************************************
	$('#refreshMocksButton').on('click', function (event) {

		$('#containerList').show();

		apiBridge.getMockList(function (mockList) {

			var $contentTableBody = $('#mockList tbody');
			$contentTableBody.html();

			mockList.forEach(function (mockData) {
				var rowContent = '';
				rowContent += '<td><input data-action="enableMock" type="checkbox" id="enable_' + mockData.id + '" ' + (mockData.enabled ? 'checked' : '') + '></td>';
				rowContent += '<td><label for="enable_' + mockData.id + '">' + mockData.name + '</label></td>';
				rowContent += '<td>' + mockData.description + '</td>';
				rowContent += '<td><span class="mockActivated" data-mock-id="' + mockData.id + '"></span></td>';
				rowContent += '<td>';
				rowContent += '<button data-action="delete">Delete</button>';
				rowContent += '<button data-action="preview">Preview</button>';
				rowContent += '<button data-action="edit">Edit</button>';
				rowContent += '</td>';

				var $row = $('<tr>' + rowContent + '</tr>');

				// enable / disable
				$row.find('input[data-action=enableMock]').change(function() {
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

				$row.find('button[data-action=delete]').on('click', function() {
					apiBridge.deleteMock(mockData.id, function (response) {
						console.log('deleteMock', response);
					});
				});

				$row.find('button[data-action=preview]').on('click', function() {
					preview.setContent(mockData.response.body).show();
				});

				$row.find('button[data-action=edit]').on('click', function() {

				});


				$contentTableBody.append($row);
			});




		});
	});
});
