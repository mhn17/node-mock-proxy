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
	console.log("Delete mock: " + req.params.id);
	mockRepository.deleteMockById(req.params.id);
    res.statusCode = 200;
    res.json({ message: 'OK: '});
});

// Move available mock to enabled mocks
router.put('/:id/enable', function(req, res) {
	console.log("Enable mock: " + req.params.id);
	mockRepository.enableMockById(req.params.id);

	res.statusCode = 200;
	res.json({ message: 'OK'});
});

// Move enabled mock to availabled mocks
//@Todo: When the mock is disabled the previous folder structer will not be deleted -> Needs some better handling?
router.put('/:id/disable', function(req, res) {
	console.log("Disable mock: " + req.params.id);
	mockRepository.disableMockById(req.params.id);

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