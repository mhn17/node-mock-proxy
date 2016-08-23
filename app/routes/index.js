var express = require('express');
var router = express.Router();
var mockFileNameService = require('./../services/MockFileNameService');
var RequestProcessor = require('./../RequestProcessor');
var MockLUT = require('./../services/MockLUT');

var config = require('config');
var requestProcessor = new RequestProcessor(config, mockFileNameService,  new MockLUT());

// handle GET requests
router.get('/*', function(req, res) {
	requestProcessor.processRequest(req, res);
});

// handle POST requests
router.post("/*", function (req, res) {
	requestProcessor.processRequest(req, res);
});

module.exports = router;