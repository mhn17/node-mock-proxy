var Mock = require('domain/models/Mock');
var MockFileNameService = require('services/MockFileNameService');
var pathService = require('services/PathService');
var ExtensionService = require('services/ExtensionService');

var MockLUT = function() {
	if (process.mainModule.instances.mockLUT) {
		return process.mainModule.instances.mockLUT;
	}

	// array of Mock objects
	this.lookUpTable = {};
	this.mockFileNameService = new MockFileNameService();
	this.extensionService = new ExtensionService();

	process.mainModule.instances.mockLUT = this;
	return this;
};

MockLUT.prototype.buildCache = function() {
	var that = this;
	pathService.getListOfMockFiles(pathService.getMockEnabledFolderPath()).forEach(function (filePath) {
		that._addFileToTable(filePath);
	});

	return this;
};

MockLUT.prototype.clearCache = function() {
	this.lookUpTable = {};

	return this;
};

MockLUT.prototype.getFileNameByHash = function(hash) {
	var entry = this.lookUpTable[hash];
	if (entry) {
		return entry.fileName;
	} else {
		return null;
	}
};

MockLUT.prototype.getMockByHash = function(hash) {
	var fileName = this.getFileNameByHash(hash);
	if (fileName) {
		var mock = new Mock();
		mock.setFileName(fileName);
		mock.readFromFile();

		return mock;
	} else {
		return null;
	}
};

MockLUT.prototype._addFileToTable = function(filePath) {
	var mock = new Mock();
	mock.setFileName(filePath);
	mock.readFromFile();

	mock.setRequest(this.extensionService.process(this.extensionService.TYPE_MOCK_REQUEST_PROCESSORS, mock.getRequest()));

	var key = this.mockFileNameService.getHash(mock.getRequest());
	this.lookUpTable[key] = {
		'fileName': mock.getFileName(),
		'id': mock.getId()
	};

	return this;
};

module.exports = MockLUT;