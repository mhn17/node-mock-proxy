var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var config      = require('config');
var fs          = require('fs');

var AdminServer = function() {
    this.app = express();

    // get admin config
    this.adminConfig = config.get('admin');
};

AdminServer.prototype.start = function() {
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

AdminServer.prototype.setUpRoutes = function() {
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
				fs.writeFile('./mocks-enabled' + lastRequest.fileName, lastRequest.response, function(err) {
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
};

module.exports = AdminServer;