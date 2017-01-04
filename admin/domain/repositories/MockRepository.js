var fs = require('fs-extra');
var path = require('path');
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
	return this._findByFolder(this.pathService.getMockAvailableFolderPath());
};

MockRepository.prototype.findEnabledMocks = function() {
	return this._findByFolder(this.pathService.getMockEnabledFolderPath());
};

MockRepository.prototype.findDisabledMocks = function() {
	var availableMocks = this.findAvailableMocks();
	var enabledMocks = this.findEnabledMocks();
	var disabledMocks = [];

	availableMocks.forEach(function (mock) {
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
 * Returns all mocks which were returned to the caller (the mocks may to exist anymore).
 *
 * @param maxNumber The maximum number of returned results.
 * @returns {Array} An array of Mock objects. The most recently returned mock will be in [0], the second most recently returned will be at [1] etc.
 */
MockRepository.prototype.findReturnedMocks = function(limit) {
	var mockFiles = [];
	var fileData = fs.readFileSync(this.pathService.getReturnedMocksLogFilePath(), 'utf8');
	var mockStrings = fileData.split("\n").reverse();

	// Filter empty string
	mockStrings = mockStrings.filter(function(value){
		return value !== "";
	});

	// Add mocks to result list
	mockStrings.forEach(function (entry, index) {
		if(index < limit){
			mockFiles.push(JSON.parse(entry));
		}
	});

	return mockFiles;
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
	var result = null;
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
	if (mock) {
		var fileName = mock.getFileName();
		var baseFileName = path.basename(fileName);
		var target = this.pathService.getMockEnabledFolderPath() + path.sep + baseFileName;

		if (state) {
			try {
				fs.symlinkSync(fileName, target);
			}
			catch(e) {
				// if we cant create symlink (hello window) - copy file...
				fs.copySync(fileName, target)
			}
		}
		else {
			try {
				fs.unlinkSync(target);
			}
			catch(e) {
				// do nothing...
			}
		}
	}

};

MockRepository.prototype.deleteMockById = function(mockId) {
	console.log('MockRepository', 'deleteMockById', mockId);
	this.disableMockById(mockId);

	var mock = this.findById(mockId);
	if (mock) {
		fs.unlinkSync(mock.getFileName());
	}
};

MockRepository.prototype.enableMockById = function(mockId) {
	console.log('MockRepository', 'enableMockById', mockId);
	this.toggleMockStateById(mockId, true);
};

MockRepository.prototype.disableMockById = function(mockId) {
	console.log('MockRepository', 'disableMockById', mockId);
	this.toggleMockStateById(mockId, false);
};

MockRepository.prototype.createMockOrUpdate = function(data, callback) {
	var mock = new Mock();

	// If id is set the already existing mock will be updated
	if(data.id){
		console.log("Updating mock with id " + data.id);
		mock = this.findById(data.id);
	}

	mock.setName(data.name);
	mock.setDescription(data.description);
	mock.setRequestUri(data.requestUri);
	mock.setRequestMethod(data.requestMethod);
	mock.setRequestBody(data.requestBody);
	mock.setResponseBody(data.responseBody);

	mock.saveToFile();

	if(callback) {
		callback(mock.getId());
	}
};

module.exports = MockRepository;