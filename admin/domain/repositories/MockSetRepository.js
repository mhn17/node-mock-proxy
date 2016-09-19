var fs = require('fs-extra');
var path = require('path');
var MockSet = require('domain/models/MockSet');
var MockRepository = require("domain/repositories/MockRepository");

var MockSetRepository = function(pathService) {
    this.pathService = pathService;
    this.mockRepository = new MockRepository(this.pathService);
};

MockSetRepository.prototype.findAll = function() {
    var mockSetList = [];
    
    this.pathService.getListOfMockFiles(this.pathService.getMockSetPath()).forEach(function(mockName){
        var mockSet = new MockSet();
        mockSet.setFileName(mockName);
        mockSet.readFromFile();
        
        mockSetList.push(mockSet);
    });
    
    return mockSetList;
};

MockSetRepository.prototype.createOrUpdate = function(data) {
    var mockSet = new MockSet();
    
    	// If id is set the already existing mock will be updated
	if(data.id){
            console.log("Load mock set with id: ", data.id);
            mockSet = this.findById(data.id);
	}

	mockSet.setName(data.name);
	mockSet.setDescription(data.description);
	mockSet.updateMockIds(data.mockIds);
	
	mockSet.saveToFile();
};

MockSetRepository.prototype.findById = function(mockSetId) {
    var mockSets = this.findAll();
    var resultMockSet;
    
    mockSets.forEach(function(mockSet){
        if(mockSet.getId() === mockSetId) {
            resultMockSet = mockSet;
        }
    });
    
    return resultMockSet;
};

MockSetRepository.prototype.deleteMockSetById = function(mockSetId) {
    console.log('MockSetRepository', 'deleteMockSetById', mockSetId);
    var mockSet = this.findById(mockSetId);
	
    if (mockSet) {
		fs.unlinkSync(mockSet.getFileName());
	}
};

MockSetRepository.prototype.enableMockSetById = function(mockSetId) {
    console.log('MockSetRepository', 'enableMockSetById', mockSetId);
    var that = this;
    var mockSet = this.findById(mockSetId);
    
    mockSet.getMockIds().forEach(function(mockId) {
        that.mockRepository.enableMockById(mockId);
    });
};

MockSetRepository.prototype.disableMockSetById = function(mockSetId) {
    console.log('MockSetRepository', 'disableMockSetById', mockSetId);
    var that = this;
    var mockSet = this.findById(mockSetId);
    
    mockSet.getMockIds().forEach(function(mockId) {
        that.mockRepository.disableMockById(mockId);
    });
};

module.exports = MockSetRepository;