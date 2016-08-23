var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');
var mv = require('mv');
var mkdirp = require('mkdirp');
var path = require("path");

// Services, repositories
var pathService = require("services/PathService");
var MockRepository = require("domain/repositories/MockRepository");
var mockRepository = new MockRepository(pathService);


// Get list of mocks
router.get('/', function(req, res) {
    console.log("List all mocks");
    var mockList = [];

	mockRepository.findAll().forEach(function(entry) {
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

			// Ensure that folder structure exists and write file
            // ToDo: Extract that to the PathService
            var pathToMockArray = pathService.getMockPath(requestToMock.fileName, false).split(path.sep);
            var mockFileName = pathToMockArray.pop();
            var pathToMock = pathToMockArray.join(path.sep);

            mkdirp(pathToMock, function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.json({message: 'Failed to create folder structure for mock: ' + err});
                } else {
                    fs.writeFile(pathToMock + path.sep + mockFileName, JSON.stringify(requestToMock), function(err) {
                        if (err) {
                            res.statusCode = 500;
                            res.json({message: 'Failed to add to mocks: ' + err});
                        } else {
                            res.json({message: 'Request saved with filename: ' + requestToMock.fileName});
                        }
                    });
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
    res.json({ message: mockRepository.findById(mockId) });
});

// Delete a mock
router.delete('/:id', function(req, res) {
	var mockId = req.params.id;
    var mock = mockRepository.findById(mockId);

	console.log("Attempting to delete mock.");
    var path = pathService.getMockPath(mock.fileName, mock.enabled);
	console.log("Mock to be deleted:" + path);

	// Delete mock
	fs.unlinkSync(path);

    res.statusCode = 200;
    res.json({ message: 'OK: '});
});

// Move available mock to enabled mocks
//@Todo: When the mock is enabled the previous folder structer will not be deleted -> Needs some better handling?
router.put('/:id/enable', function(req, res) {
	var mock = mockRepository.findById(req.params.id);
    console.log("Enable mock: " + mock.fileName);

    // Ensure that folder structure exists and write file
    // ToDo: Extract that to the PathService
    var pathTargetToMockArray = pathService.getMockPath(mock.fileName, true).split(path.sep);
    var mockFileName = pathTargetToMockArray.pop();
    var pathToMock = pathTargetToMockArray.join(path.sep);

    mkdirp(pathToMock, function (err) {
        if (err) {
            res.statusCode = 500;
            res.json({message: 'Failed to create folder structure for mock: ' + err});
        } else {
            mv(pathService.getMockPath(mock.fileName, false)
                , pathService.getMockPath(mock.fileName, true), function(err) {
                    // It seems there is always an error thrown? Strange.
                    // No error handling for now.
                    // @ToDo: Check this again for proper error handling.
                    console.log(err);
                });
        }
    });

	res.statusCode = 200;
	res.json({ message: 'OK: '});
});

// Move enabled mock to availabled mocks
//@Todo: When the mock is disabled the previous folder structer will not be deleted -> Needs some better handling?
router.put('/:id/disable', function(req, res) {
    var mock = mockRepository.findById(req.params.id);
	console.log("Disable mock: " + mock.fileName);

    // Ensure that folder structure exists and write file
    // ToDo: Extract that to the PathService
    var pathTargetToMockArray = pathService.getMockPath(mock.fileName, false).split(path.sep);
    var mockFileName = pathTargetToMockArray.pop();
    var pathToMock = pathTargetToMockArray.join(path.sep);

    mkdirp(pathToMock, function (err) {
        if (err) {
            res.statusCode = 500;
            res.json({message: 'Failed to create folder structure for mock: ' + err});
        } else {
            mv(pathService.getMockPath(mock.fileName, true)
                , pathService.getMockPath(mock.fileName, false), function(err) {
                    // It seems there is always an error thrown? Strange.
                    // No error handling for now.
                    // @ToDo: Check this again for proper error handling.
                    console.log(err);
                });
        }
    });

    res.statusCode = 200;
    res.json({ message: 'OK: '});
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