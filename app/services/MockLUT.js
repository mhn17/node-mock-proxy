var Mock = require('domain/models/Mock');
var mockFileNameService = require('services/MockFileNameService');
var pathService = require('services/PathService');

var MockLUT = function() {
	if (process.mainModule.instances.mockLUT) {
		return process.mainModule.instances.mockLUT;
	}

	// array of Mock objects
	this.lookUpTable = {};

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

	var key = mockFileNameService.getHash(mock.getRequestUri(), mock.getRequestMethod(), mock.getRequestBody());
	this.lookUpTable[key] = {
		'fileName': mock.getFileName(),
		'id': mock.getId()
	};

	return this;
};

module.exports = MockLUT;