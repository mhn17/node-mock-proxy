var pathService = require("services/PathService");

var MockTransformer = function() {

};

MockTransformer.prototype.transformToDto = function(mock, enabled) {
	var fileName = '';
	if (enabled) {
		fileName = mock.getFileName().replace(pathService.getMockEnabledFolderPath(),"");
	} else {
		fileName = mock.getFileName().replace(pathService.getMockAvailableFolderPath(),"");
	}

	return {
		id: mock.getId(),
		fileName: fileName,
		name: mock.getName(),
		description: mock.getDescription(),
		statusCode: mock.getStatusCode(),
		request: {
			uri: mock.getRequest().getUri(),
			method: mock.getRequest().getMethod(),
			body: mock.getRequest().getBody()
		},
		response: {
			body: mock.getResponse().getBody()
		},
		enabled: enabled
	}
};

module.exports = MockTransformer;