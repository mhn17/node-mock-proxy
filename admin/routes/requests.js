var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');

// Services
var pathService = require("../../app/services/PathService");

// Logged requests
router.get('/', function (req, res) {
    console.log("List available requests");

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
                method: request.method,
                request: request.request,
                response: request.response
            });
        });

        // Set response
        if (typeof err === 'undefined' || err === null) {
            res.json(requests);
        }
        else {
            res.statusCode = 500;
            res.json({ message: 'ups! something went wrong: ' + err });
        }
    });
});

// Clear log entries from request log
router.delete('/delete', function(req, res) {
    console.log("Clear request log.");

    fs.writeFile(pathService.getLogFilePath(), "", function(err){
        if(err){
                res.statusCode = 200;
                res.json({ message: 'Failed to clear request log: ' + err});
        }
    });

    res.statusCode = 200;
    res.json({ message: 'OK: '});
});

// Get response for a request in the log file
router.get('/:id', function(req, res) {

    var requestId = req.params.id;
    console.log(req);
    console.log("Get response for request: " + requestId);

    fs.readFile(pathService.getLogFilePath(), "utf-8", function(err, data) {

        // Prepare data
        var rawRequests = data.split('\n');
        rawRequests.pop();

        // Get requests
        var requests = [];
        rawRequests.forEach(function(rawRequest) {
            var request = JSON.parse(rawRequest);
            requests.push({
                id: request.id,
                fileName: request.fileName,
                methid: request.method,
                request: request.request,
                response: request.response
            });
        });

        // Get correct request
        var requestToResponse = {};
        requests.forEach(function(entry){
                if(entry.fileName === requestId){
                        requestToResponse = entry;
                }
        });

        // Set error response
        if (typeof err === 'undefined' || err === null) {
            // Set response
            res.statusCode = 200;
            res.json({ message: requestToResponse.response });
        } else {
            res.statusCode = 500;
            res.json({ message: 'Could not get response for the request: ' + err });
        }
    });
});


module.exports = router;
