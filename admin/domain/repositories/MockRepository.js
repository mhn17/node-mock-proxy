var fs = require('fs');
var Mock = require('models/Mock');

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
 * @returns {Object} Returns an Object (enabled/available) of objects containing the mock data.
 */
MockRepository.prototype.findAll = function() {
	var result = {'enabled': [], 'available': []};

	// Get enabled mocks and add them to the result array
	var enabledMockNames = this.pathService.getListOfMockFiles(this.pathService.getMockEnabledFolderPath());
	enabledMockNames.forEach(function (entry) {
		var mock = new Mock();
		mock.setFileName(entry);
		mock.readFromFile();
		result.enabled.push(mock);
	});

	// Get available mocks and add them to the result array
	var availableMockNames = this.pathService.getListOfMockFiles(this.pathService.getMockAvailableFolderPath());
	availableMockNames.forEach(function (entry) {
		var mock = new Mock();
		mock.setFileName(entry);
		mock.readFromFile();
		var mockIsEnabled = false;
		// determine, if mock is already enabled...
		result.enabled.forEach(function(enabledMock) {
			console.log(enabledMock.getId(),' === ', mock.getId(), enabledMock.getId() === mock.getId());

			if (enabledMock.getId() === mock.getId()) {

				mockIsEnabled = true;
			}
		});

		if (!mockIsEnabled) {
			result.available.push(mock);
		}
	});

	return result;
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