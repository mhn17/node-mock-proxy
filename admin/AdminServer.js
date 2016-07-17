var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var config      = require('config');
var fs          = require('fs');
var mv          = require('mv');

// Make the AdminServer to a real webserver via the express module
var AdminServer = function() {
    
    console.log("Init admin server");
    
    // Make this a server
    this.app = express();

    // get admin config
    this.adminConfig = config.get('admin');
};

// Add a prototype start function for init stuff
AdminServer.prototype.start = function() {
    
    console.log("Starting admin server");
    
    // The beautifully this/that pattern
    // But why?
    var that = this;

    // configure app to use bodyParser()
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // routes
    this.setUpRoutes();
    this.app.use('/api', router);

    // start server
    this.app.listen(this.adminConfig.get('port'), function () {
        console.log('Mock proxy admin API listening on port ' + that.adminConfig.get('port'));
    });
};

// Add a prototype function to setup the route stuff
// Save requests and responses
AdminServer.prototype.setUpRoutes = function() {
    
    console.log("Setting up routes acting for the different endpoints");
    
    // root URL
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

	// save last request
	router.get('/save-last-request', function(req, res) {
		fs.readFile("./logs/requests.log", "utf-8", function(err, data) {

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

			// save last response
			if(typeof err === 'undefined' || err === null) {
				var lastRequest = requests[requests.length-1];
                                
                                // Write file
				fs.writeFile('./mocks-enabled/' + lastRequest.fileName, lastRequest.response, function(err) {
					if (err) {
						res.statusCode = 500;
						res.json({message: 'ups! something went wrong: ' + err});
					} else {
						res.json({message: 'last request saved with filename and enabled: ' + lastRequest.fileName});
					}
				});

			}
			else {
				res.statusCode = 500;
				res.json({message: 'ups! something went wrong: ' + err});
			}

		});
	});

    // logged requests
    router.get('/available-requests', function(req, res) {
        console.log("Trying to list available requests");
        fs.readFile("./logs/requests.log", "utf-8", function(err, data) {

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

            // set response
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
    router.get('/clearRequestLog', function(req, res) {
        console.log("Clear request log.");

        fs.writeFile("./logs/requests.log", "", function(err){
            if(err){
                res.statusCode = 200;
                res.json({ message: 'Failed to clear request log: ' + err});
            }
        });

        res.statusCode = 200;
        res.json({ message: 'OK: '});
    });

    // Move available mock to enabled mocks
    router.get('/moveAvailableMockToEnabled', function(req, res) {
        var mockFileName = req.query.name;
        console.log("Enable mock: " + mockFileName);

        mv('./mocks-available/' + mockFileName
                , './mocks-enabled/' + mockFileName, function(err) {
                   // It seems there is always an error thrown? Strange.
                   // No error handling for now.
        });
        
        res.statusCode = 200;
        res.json({ message: 'OK: '});
    });
    
    // Move enabled mock to availabled mocks
    router.get('/moveEnabledMockToAvailable', function(req, res) {
        
        var mockFileName = req.query.name;
        console.log("Disable mock: " + mockFileName);
        
        mv('./mocks-enabled/' + mockFileName
                , './mocks-available/' + mockFileName, function(err) {
                   // It seems there is always an error thrown? Strange.
                   // No error handling for now.
        });
        
        res.statusCode = 200;
        res.json({ message: 'OK'});
    });
    
    // Get mocklist and states
    router.get('/mockList', function(req, res) {
        console.log("List all mocks");
        var mockList = [];
        
        // Get enabled mocks
        fs.readdir("./mocks-enabled", function(err, files){ 
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
        fs.readdir("./mocks-available", function(err, files){ 
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
};

// When this file is required return the AdminServer instead
module.exports = AdminServer;