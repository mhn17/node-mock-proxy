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
var MockSetRepository = require("domain/repositories/MockSetRepository");
var mockSetRepository = new MockSetRepository(pathService);

// Get list of mockSets
router.get('/', function(req, res) {
    console.log("List all mocks");
    var mockSetList = mockSetRepository.findAll();
    
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

module.exports = router;