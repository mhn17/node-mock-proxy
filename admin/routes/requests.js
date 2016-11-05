var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');

// Services
var pathService = require("services/PathService");

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
                request: {
                    uri: request.request.uri,
                    method: request.request.method,
                    body: request.request.body
                },
                response: {
                    body: request.response.body
                }
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
router.delete('/', function(req, res) {
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
                request: {
                    uri: request.request.uri,
                    method: request.request.method,
                    body: request.request.body
                },
                response: {
                    body: request.response.body
                }
            });
        });

        // Get correct request
        var requestToResponse = {};
        requests.forEach(function(entry){
                if(entry.id === requestId){
                        requestToResponse = entry;
                }
        });

        console.log(requestToResponse);

        // Set error response
        if (typeof err === 'undefined' || err === null) {
            // Set response
            res.statusCode = 200;
            res.json({ message: requestToResponse });
        } else {
            res.statusCode = 500;
            res.json({ message: 'Could not get response for the request: ' + err });
        }
    });
});

module.exports = router;