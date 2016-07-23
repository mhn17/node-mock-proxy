var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');
var mv          = require('mv');

// Services
var pathService = require("../../app/services/PathService");

// Get mocklist and states
router.get('/', function(req, res) {
	console.log("List all mocks");
	var mockList = [];

	// Get enabled mocks
	fs.readdir(pathService.getMockEnabledFolderPath(), function(err, files){
            // Better user filtering too?
            // fs.stat(path, callback(err, stats)) and stats.isDirectory()
            files.forEach(function(entry){
                if(entry !== ".gitignore"){
                    mockList.push({
                        name: entry,
                        enabled: true
                    });
                }
            });
	});

	// Get disabled mocks
	fs.readdir(pathService.getMockAvailableFolderPath(), function(err, files){
            // Better user filtering too?
            // fs.stat(path, callback(err, stats)) and stats.isDirectory()
            files.forEach(function(entry){
                if(entry !== ".gitignore"){
                    mockList.push({
                        name: entry,
                        enabled: false
                    });
                }
            });

            // set response
            if (typeof err === 'undefined' || err === null) {
                res.statusCode = 200;
                res.json(mockList);
            }else {
                res.statusCode = 500;
                res.json({ message: 'ups! something went wrong: ' + err });
            }
	});
});

// Get response for a mock
router.get('/:id', function(req, res) {

	var mockFileName = req.params.id;
        var path;
        
	path = pathService.getMockPathBySearch(mockFileName);
        console.log("Get response for Mock: " + path);

	// Read content of mock file
	fs.readFile(path, "utf-8", function(err, data) {
            // Set error response
            if (typeof err === 'undefined' || err === null) {
                // Set response
                res.statusCode = 200;
                res.json({ message: data });
            } else {
                res.statusCode = 500;
                res.json({ message: 'Could not get response for the request: ' + err });
            }
	});
});

// delete a mock
router.delete('/delete', function(req, res) {
	var mockFileName = req.body.id;
	var mockState = req.body.enabled;
	var path;

	console.log("Delete mock: " + mockFileName + " in state " + mockState);
	path = pathService.getMockPath(mockFileName, mockState);
	console.log("Target deletion path:" + path);

	// Delete mock
	fs.unlink(path, function(err){
            if(err){
                res.statusCode = 500;
                res.json({ message: 'Failed to delete mock: ' + mockFileName
                + " error: " + err});
            }
	});

	res.statusCode = 200;
	res.json({ message: 'OK: '});
});

// Move available mock to enabled mocks
router.put('/enable', function(req, res) {
	var mockFileName = req.body.id;
	console.log("Enable mock: " + mockFileName);
        console.log(pathService.getMockPath(mockFileName, false));
        console.log(pathService.getMockPath(mockFileName, true));
	mv(pathService.getMockPath(mockFileName, false)
            , pathService.getMockPath(mockFileName, true), function(err) {
                // It seems there is always an error thrown? Strange.
                // No error handling for now.
                console.log(err);
            });

	res.statusCode = 200;
	res.json({ message: 'OK: '});
});

// Move enabled mock to availabled mocks
router.put('/disable', function(req, res) {

	var mockFileName = req.body.id;
	console.log("Disable mock: " + mockFileName);

	mv(pathService.getMockPath(mockFileName, true)
            , pathService.getMockPath(mockFileName, false), function(err) {
                    // It seems there is always an error thrown? Strange.
                    // No error handling for now.
            });

	res.statusCode = 200;
	res.json({ message: 'OK'});
});

// Add request to mocks
router.post('/create', function(req, res) {
    var mockFileName = req.body.id;
	
    console.log("Add request to mocks: " + mockFileName);
    fs.readFile(pathService.getLogFilePath(), "utf-8", function(err, data) {

        // prepare data
        var rawRequests = data.split('\n');
        rawRequests.pop();

        var requests = [];
        rawRequests.forEach(function(rawRequest) {

            var request = JSON.parse(rawRequest);
            requests.push({
                fileName: request.fileName,
                request: request.request,
                response: request.response
            });
        });

        // save response
        if(typeof err === 'undefined' || err === null) {
            // Get correct request
            var requestToMock = {};
            requests.forEach(function(entry){
                    if(entry.fileName === mockFileName){
                            requestToMock = entry;
                    }
            });

            // Write file
            fs.writeFile(pathService.getMockPath(requestToMock.fileName, false), requestToMock.response, function(err) {
                if (err) {
                        res.statusCode = 500;
                        res.json({message: 'Failed to add to mocks: ' + err});
                } else {
                        res.json({message: 'Request saved with filename and enabled: ' + requestToMock.fileName});
                }
            });
        }
        else {
            res.statusCode = 500;
            res.json({message: 'Failed to add to mocks: ' + err});
        }
    });
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
                fileName: request.fileName,
                request: request.request,
                response: request.response
            });
        });

        // save response
        if(typeof err === 'undefined' || err === null) {
            // Get correct request
            var requestToMock = requests.pop();
            console.log(requestToMock);
            // Write file
            fs.writeFile(pathService.getMockPath(requestToMock.fileName, false), requestToMock.response, function(err) {
                if (err) {
                        res.statusCode = 500;
                        res.json({message: 'Failed to add to mocks: ' + err});
                } else {
                        res.json({message: 'Request saved with filename and enabled: ' + requestToMock.fileName});
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
