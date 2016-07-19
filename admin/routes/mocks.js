var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');

// save last request
router.get('/save-last-request', function (req, res) {
	fs.readFile("./logs/requests.log", "utf-8", function (err, data) {

		// prepare data
		var rawRequests = data.split('\n');
		rawRequests.pop();

		var requests = [];
		rawRequests.forEach(function (rawRequest) {
			var request = JSON.parse(rawRequest);
			requests.push({
				fileName: request.fileName,
				request: request.request,
				response: request.response
			});
		});

		// save last response
		if (typeof err === 'undefined' || err === null) {
			var lastRequest = requests[requests.length - 1];
			fs.writeFile('./mocks-enabled' + lastRequest.fileName, lastRequest.response, function (err) {
				if (err) {
					res.statusCode = 500;
					res.json({message: 'ups! something went wrong: ' + err});
				} else {
					res.json({message: 'last request saved with filename and enabled: ' + lastRequest.fileName});
				}
			});

		} else {
			res.statusCode = 500;
			res.json({message: 'ups! something went wrong: ' + err});
		}

	});
});

// list of mocks
// NOT YET IMPLEMENTED
router.get('/', function (req, res) {
	fs.readFile(config.get('logging').get('file'), "utf-8", function (err, data) {

		// prepare data
		var rawRequests = data.split('\n');
		rawRequests.pop();

		var requests = [];
		rawRequests.forEach(function (rawRequest) {
			var request = JSON.parse(rawRequest);
			requests.push({
				fileName: request.fileName,
				request: request.request,
				response: request.response
			});
		});

		// set response
		if (typeof err === 'undefined' || err === null) {
			res.json(requests);
		} else {
			res.statusCode = 500;
			res.json({message: 'ups! something went wrong: ' + err});
		}

	});
});

module.exports = router;
