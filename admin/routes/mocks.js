var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');
var mv = require('mv');

// Services
var pathService = require("../../app/services/PathService");

// Get mocklist and states
router.get('/', function(req, res) {
    console.log("List all mocks");
    var mockList = [];

    pathService.getMocks().forEach(function(entry) {
        mockList.push({
            id: entry.id,
            fileName: entry.fileName,
            request: entry.request,
            response: entry.response,
            enabled: entry.enabled
        });
    });

    res.statusCode = 200;
    res.json(mockList);
});

// Add request to mocks
router.post('/', function(req, res) {
	var mockId = req.body.id;

	console.log("Add request to mocks: " + mockId);
	fs.readFile(pathService.getLogFilePath(), "utf-8", function(err, data) {

		// Prepare data
		var rawRequests = data.split('\n');
		rawRequests.pop();
		var requests = [];

		rawRequests.forEach(function(rawRequest) {
			var request = JSON.parse(rawRequest);
			requests.push({
				id: request.id,
				fileName: request.fileName,
				request: request.request,
				response: request.response,
				method: request.method
			});
		});

		// Save response
		if(typeof err === 'undefined' || err === null) {
			// Get correct request
			var requestToMock = {};
			requests.forEach(function(entry){
				if(entry.id === mockId){
					requestToMock = entry;
				}
			});

			// Write file
			fs.writeFile(pathService.getMockPath(requestToMock.fileName, false), JSON.stringify(requestToMock), function(err) {
				if (err) {
					res.statusCode = 500;
					res.json({message: 'Failed to add to mocks: ' + err});
				} else {
					res.json({message: 'Request saved with filename: ' + requestToMock.fileName});
				}
			});
		}
		else {
			res.statusCode = 500;
			res.json({message: 'Failed to add to mocks: ' + err});
		}
	});
});

// Get response for a mock
router.get('/:id', function(req, res) {

    var mockId = req.params.id;

    console.log("Get mock with id: " + mockId);

    // Set response
    res.statusCode = 200;
    res.json({ message: pathService.getMockById(mockId) });
});

// Delete a mock
router.delete('/:id', function(req, res) {
	var mockId = req.params.id;
	var path;

	console.log("Attempting to delete mock.");
	path = pathService.getMockPathById(mockId).filePath;
	console.log("Mock to be deleted:" + path);

	// Delete mock
	fs.unlink(path, function(err){
            if(err){
                res.statusCode = 500;
                res.json({ message: 'Failed to delete mock: ' + mockId
                + " error: " + err});
            }
	});

	res.statusCode = 200;
	res.json({ message: 'OK: '});
});

// Move available mock to enabled mocks
router.put('/:id/enable', function(req, res) {
	var mock = pathService.getMockById(req.params.id);
        console.log("Enable mock: " + mock.fileName);

	mv(pathService.getMockPath(mock.fileName, false)
            , pathService.getMockPath(mock.fileName, true), function(err) {
                // It seems there is always an error thrown? Strange.
                // No error handling for now.
                console.log(err);
            });

	res.statusCode = 200;
	res.json({ message: 'OK: '});
});

// Move enabled mock to availabled mocks
router.put('/:id/disable', function(req, res) {
        var mock = pathService.getMockById(req.params.id);
	console.log("Disable mock: " + mock.fileName);

	mv(pathService.getMockPath(mock.fileName, true)
            , pathService.getMockPath(mock.fileName, false), function(err) {
                    // It seems there is always an error thrown? Strange.
                    // No error handling for now.
            });

	res.statusCode = 200;
	res.json({ message: 'OK'});
});

// Add last request to mocks
// Duplicate code with the normal create method
// Needs to be refactored
router.post('/createFromLastRequest', function(req, res) {
    console.log("Adding last request to mocks.");

    fs.readFile(pathService.getLogFilePath(), "utf-8", function(err, data) {

        // prepare data
        var rawRequests = data.split('\n');
        rawRequests.pop();

        var requests = [];
        rawRequests.forEach(function(rawRequest) {
            var request = JSON.parse(rawRequest);

            requests.push({
                id: request.id,
                fileName: request.fileName,
                request: request.request,
                response: request.response,
                method: request.method
            });
        });

        // save response
        if(typeof err === 'undefined' || err === null) {
            // Get correct request
            var requestToMock = requests.pop();

            // Write file
            fs.writeFile(pathService.getMockPath(requestToMock.fileName, false), JSON.stringify(requestToMock), function(err) {
                if (err) {
                    res.statusCode = 500;
                    res.json({message: 'Failed to add to mocks: ' + err});
                } else {
                    res.json({message: 'Request saved with filename: ' + requestToMock.fileName});
                }
            });
        }
        else {
            res.statusCode = 500;
            res.json({message: 'Failed to add to mocks: ' + err});
        }
    });
});

module.exports = router;
