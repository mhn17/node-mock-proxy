var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');
var mv = require('mv');
var mkdirp = require('mkdirp');
var path = require("path");
var MockLUT = require('services/MockLUT');

// Services, repositories
var pathService = require("services/PathService");
var MockRepository = require("domain/repositories/MockRepository");
var mockRepository = new MockRepository(pathService);
var mockLUT = new MockLUT();

// Get list of mocks
router.get('/', function(req, res) {
    console.log("List all mocks");

	var enabledMocks = mockRepository.findEnabledMocks();
	var disabledMocks = mockRepository.findDisabledMocks();

	var mockList = [];

	enabledMocks.forEach(function(mock) {
		mockList.push({
			id: mock.getId(),
			fileName: mock.getFileName().replace(pathService.getMockEnabledFolderPath(),""),
			name: mock.getName(),
			description: mock.getDescription(),
			request: {
				uri: mock.getRequestUri(),
				method: mock.getRequestMethod(),
				body: mock.getRequestBody()
			},
			response: {
				body: mock.getResponseBody()
			},
			enabled: true
	  	});
	});

	disabledMocks.forEach(function(mock) {
		mockList.push({
			id: mock.getId(),
			fileName: mock.getFileName().replace(pathService.getMockAvailableFolderPath(),""),
			name: mock.getName(),
			description: mock.getDescription(),
			request: {
				uri: mock.getRequestUri(),
				method: mock.getRequestMethod(),
				body: mock.getRequestBody()
			},
			response: {
				body: mock.getResponseBody()
			},
			enabled: false
	  	});
	});

    res.statusCode = 200;

	// @TODO - Sort list by name...
    res.json(mockList);
});

// Get list of mocks
router.get('/getReturnedMocks', function(req, res) {
	console.log("List last returned mocks with limit " + req.query.limit);
	var mockList = mockRepository.findReturnedMocks(req.query.limit);

	res.statusCode = 200;
	res.json(mockList);
});

// Get response for a mock
router.get('/:id', function(req, res) {
    var mockId = req.params.id;

    console.log("Get mock with id: " + mockId);

    // Set response
    res.statusCode = 200;
    res.json({ message: mockRepository.findById(mockId) });
});

// Delete a mock
router.delete('/:id', function(req, res) {
	console.log("Delete mock: " + req.params.id);
	mockRepository.deleteMockById(req.params.id);
    res.statusCode = 200;
    res.json({ message: 'OK: '});

	mockLUT.clearCache();
	mockLUT.buildCache();
});

// Move available mock to enabled mocks
router.put('/:id/enable', function(req, res) {
	console.log("Enable mock: " + req.params.id);
	mockRepository.enableMockById(req.params.id);

	res.statusCode = 200;
	res.json({ message: 'OK'});

	mockLUT.clearCache();
	mockLUT.buildCache();
});

// Move enabled mock to availabled mocks
router.put('/:id/disable', function(req, res) {
	console.log("Disable mock: " + req.params.id);
	mockRepository.disableMockById(req.params.id);

	res.statusCode = 200;
	res.json({ message: 'OK'});

	mockLUT.clearCache();
	mockLUT.buildCache();
});

// create manually
router.post('/', function(req, res) {
	console.log("creating mock manually");
        
	mockRepository.createMockOrUpdate(req.body, function (id) {
		mockLUT.clearCache();
		mockLUT.buildCache();

		res.statusCode = 200;
		res.json({ message: {id: id}});
	});
});

module.exports = router;