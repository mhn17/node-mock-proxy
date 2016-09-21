var express = require('express');
var router = express.Router();

// Services, repositories
var pathService = require("services/PathService");
var MockSetRepository = require("domain/repositories/MockSetRepository");
var mockSetRepository = new MockSetRepository(pathService);

// Get list of mock sets
router.get('/', function(req, res) {
    var mockSetList = mockSetRepository.findAll();
    console.log("List all mock sets");
    
    res.statusCode = 200;
    res.json(mockSetList);
});

// Get response for a mockSet
router.get('/:id', function(req, res) {
    var mockSetId = req.params.id;
    console.log("Get mockSet with id: " + mockSetId);

    // Set response
    res.statusCode = 200;
    res.json({ message: mockSetRepository.findById(mockSetId) });
});

// Delete a mockSet
router.delete('/:id', function(req, res) {
    console.log("Delete mockSet: " + req.params.id);
    mockSetRepository.deleteMockSetById(req.params.id);
    res.statusCode = 200;
    res.json({ message: 'OK: '});
});

// Create mockSet
router.post('/', function(req, res) {
    console.log("Creating mockSet");
    mockSetRepository.createOrUpdate(req.body);

    res.statusCode = 200;
    res.json({ message: 'OK'});
});

// Enable mocks in a mock set
router.put('/:id/enable', function(req, res) {
	console.log("Enable mockSet: " + req.params.id);
	mockSetRepository.enableMockSetById(req.params.id);

	res.statusCode = 200;
	res.json({ message: 'OK'});
});

// Disable mocks in a mock set
router.put('/:id/disable', function(req, res) {
	console.log("Disable mockSet: " + req.params.id);
	mockSetRepository.disableMockSetById(req.params.id);

	res.statusCode = 200;
	res.json({ message: 'OK'});
});

module.exports = router;