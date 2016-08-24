var fs = require('fs');
var Mock = require('domain/models/Mock');

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
	return this.findAvailableMocks();
};

MockRepository.prototype._findByFolder = function(folder) {
	// Get enabled mocks and add them to the result array
	var result = [];

	var mocks = this.pathService.getListOfMockFiles(folder);
	mocks.forEach(function (fileName) {
		var mock = new Mock();
		mock.setFileName(fileName);
		mock.readFromFile();
		result.push(mock);
	});

	return result;
};

MockRepository.prototype.findAvailableMocks = function() {
	return this._findByFolder(this.pathService.getMockEnabledFolderPath());
};

MockRepository.prototype.findEnabledMocks = function() {
	return this._findByFolder(this.pathService.getMockEnabledFolderPath());
};

MockRepository.prototype.findDisabledMocks = function() {
	var availableMocks = this.findAvailableMocks();
	var enabledMocks = this.findEnabledMocks();
	var disabledMocks = [];

	availableMocks.forEach(function (fileName) {
		console.log(fileName);
		var mock = new Mock();
		mock.setFileName(fileName);
		mock.readFromFile();

		var mockIsEnabled = false;
		// determine, if mock is already enabled...
		enabledMocks.forEach(function(enabledMock) {
			if (enabledMock.getId() === mock.getId()) {
				mockIsEnabled = true;
			}
		});

		if (!mockIsEnabled) {
			disabledMocks.push(mock);
		}
	});

	return disabledMocks;
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

MockRepository.prototype.toggleMockStateById = function(mockId, state) {
	var mock = this.findById(mockId);
	var fileName = mock.getFileName();

	// @todo - check if mock is already in the state



};


MockRepository.prototype.enableMockById = function(mockId) {
	this.toggleMockStateById(mockId, true);
};

MockRepository.prototype.disableMockById = function(mockId) {
	this.toggleMockStateById(mockId, false);
};

module.exports = MockRepository;