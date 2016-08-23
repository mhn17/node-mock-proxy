var fs = require('fs');

var MockRepository = function(pathService) {
	this.pathService = pathService;
};

/**
 * Returns an array of objects representing the mocks. Each mock hast the following informations:
 *  - id
 *  - fileName
 *  - request
 *  - response
 *  - method
 *  - enabled
 *
 * @returns {Array} Returns an array of objects containing the mock data.
 */
MockRepository.prototype.findAll = function() {
	var availableMocks = [];
	var enabledMocks = [];
	var result = [];

	// Get available mocks and add them to the result array
	var availableMockNames = this.pathService.getListOfMockFiles(this.pathService.getMockAvailableFolderPath());

	// Get enabled mocks and add them to the result array
	var enabledMockNames = this.pathService.getListOfMockFiles(this.pathService.getMockEnabledFolderPath());

	availableMockNames.forEach(function (entry) {
		var data = fs.readFileSync(entry, "utf-8");
		var mock = JSON.parse(data);

		mock.enabled = false;
		availableMocks.push(mock);
	});

	enabledMockNames.forEach(function (entry) {
		var data = fs.readFileSync(entry, "utf-8");
		var mock = JSON.parse(data);

		mock.enabled = true;
		enabledMocks.push(mock);
	});

	return result.concat(enabledMocks).concat(availableMocks);
};

/**
 * Returns an object representing a mock which contains the following information:
 *  - id
 *  - fileName
 *  - request
 *  - response
 *  - method
 *  - enabled
 *
 * @param {String} mockFileName The name of the mock for which the the mock object should be returned.
 * @returns {Object} Returns a Javascript object containing the mock data.
 */
MockRepository.prototype.findByFileName = function(mockFileName) {
	var mockPath = this.pathService.getMockPathBySearch(mockFileName);
	var mockFileObject = JSON.parse(fs.readFileSync(mockPath.filePath, "utf-8"));

	mockFileObject.enabled = mockPath.enabled;

	return mockFileObject;
};

/**
 * Returns an object representing a mock which contains the following information:
 *  - id
 *  - fileName
 *  - request
 *  - response
 *  - method
 *  - enabled
 *
 * @param {String} mockId The id of the mock for which the the mock object should be returned.
 * @returns {Object} Returns a javascript object containing the mock data.
 */
MockRepository.prototype.findById = function(mockId){
	var result = {};
	var mocks = this.findAll();

	mocks.forEach(function(entry){
		if(entry.id === mockId){
			result = entry;
		}
	});

	return result;
};

module.exports = MockRepository;