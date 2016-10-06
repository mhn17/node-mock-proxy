var fs = require('fs');
var uuid = require('node-uuid');
var sanitize = require('sanitize-filename');
var pathService = require('services/PathService');

var MockSet = function() {
	this.fileName = "";

	this.id = "";
	this.name = "";
	this.description = "";
	this.mockIds = [];
	this.fileName = "";

	return this;
};

MockSet.prototype.setFileName = function(fileName) {
	this.fileName = fileName;
};

MockSet.prototype.getFileName = function() {
	return this.fileName;
};

MockSet.prototype.setId = function(id) {
	this.id = id;
};

MockSet.prototype.getId = function() {
	return this.id;
};

MockSet.prototype.setName = function(name) {
	this.name = name;
};

MockSet.prototype.getName = function() {
	return this.name;
};

MockSet.prototype.setDescription = function(description) {
	this.description = description;
};

MockSet.prototype.getDescription = function() {
	return this.description;
};

MockSet.prototype.addMockIds = function (mockIds) {
	this.mockIds = this.mockIds.concat(mockIds);
};


MockSet.prototype.getMockIds = function () {
    return this.mockIds;
};

MockSet.prototype.updateMockIds = function (mockIDs) {
    this.mockIds = mockIDs;
};

/**
 * ToDo: Find better way to remove the values. Perhaps splice?
 * @param {type} toBeRemovedMockIds The mock ids which should be removed from the set.
 * @returns {Array} The new mock id array.
 */
MockSet.prototype.removeMockIds = function (toBeRemovedMockIds) {
    var resultArray = [];
    
    this.mockIds.forEach(function(mockId) {
        if (toBeRemovedMockIds.indexOf(mockId) === -1) {
            resultArray.push(mockId);
        }
    });
    
    this.mockIds = resultArray;
    
    return this.mockIds;
};

MockSet.prototype.readFromFile = function() {
	if (!this.getFileName()) {
		throw new Error("File name not set");
	}

	var that = this;

	try {
		var data = fs.readFileSync(this.getFileName(), {"encoding": "utf-8"});
		var jsonData = JSON.parse(data);
		that.setId(jsonData.id);
		that.setName(jsonData.name);
		that.setDescription(jsonData.description);
		that.addMockIds(jsonData.mockIds);
	} catch (e) {
		throw new Error("Could not read mock set file " + this.getFileName());
	}
};

MockSet.prototype.saveToFile = function() {
	if (!this.getId()) {
		this.setId(uuid.v1());
	}

	if (!this.getFileName()) {
		var fileName = pathService.getMockSetPath() + sanitize(this.getName()) + ".json";
		this.setFileName(fileName);
	}

	var content = {
		"id": this.getId(),
		"name": this.getName(),
		"description": this.getDescription(),
		"mockIds": this.getMockIds()
	};

	try {
		fs.writeFileSync(this.getFileName(), JSON.stringify(content), 'utf8');
	} catch (e) {
		throw new Error("Could not write mock file " + this.getFileName());
	}
};


module.exports = MockSet;