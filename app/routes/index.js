var express = require('express');
var router = express.Router();

var RequestProcessor = require('RequestProcessor');
var requestProcessor = new RequestProcessor();

// handle GET requests
router.get('/*', function(req, res) {
	requestProcessor.processRequest(req, res);
});

// handle POST requests
router.post("/*", function (req, res) {
	requestProcessor.processRequest(req, res);
});

module.exports = router;