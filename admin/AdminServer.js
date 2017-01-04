var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var config      = require('config');
var fs          = require('fs');

// routes
var requestRoutes = require('routes/requests');
var mockRoutes = require('routes/mocks');
var mockSetRoutes = require('routes/mockSets');
var expressWs = require('express-ws');

// Make the AdminServer to a real webserver via the express module
var AdminServer = function() {
    console.log("Init admin server");

    // Make this a server
    this.app = express();

    // get admin config
    this.adminConfig = config.get('admin');

	return this;
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
    this.setupWebsocketLog();

    // start server
    this.app.listen(this.adminConfig.get('port'), function () {
        console.log('Mock proxy admin API listening on port ' + that.adminConfig.get('port'));
    });
};

/**
 * Send Log via WS
 */
AdminServer.prototype.setupWebsocketLog = function() {

    // starting Webservice...
    var ews = expressWs(this.app);
    var wsApp = ews.app;
    wsApp.ws('/admin/ws/logs', function (ws, req) {});
    var aWss = ews.getWss('/admin/ws/logs');

    // function to send message to clients...
    var sendLog = function(type) {

        type = arguments[0];
        args = arguments[1];

        var allArguments = []

        for (key in args) {
            allArguments.push(args[key]);
        }

        aWss.clients.forEach(function (client) {
            client.send(JSON.stringify({type:type, 'foo':'bar', values:allArguments}));
        });
    };

    // overwriting console
    ['log', 'warn', 'error', 'info'].forEach(function(value) {
        var oldConsoleFunction = console[value];
        console[value] = function() {
            sendLog(value, arguments);

            oldConsoleFunction.apply(console, arguments);
        };
    });
};

// Add a prototype function to setup the route stuff
// Save requests and responses
AdminServer.prototype.setUpRoutes = function() {

    console.log("Setting up routes acting for the different endpoints");

    // root URL
    router.get('/', function(req, res) {
        res.json({ message: 'Hooray! Welcome to our api!' });
    });

    this.app.use(function (req, res, next) {
        next();
    });

    this.app.use('/api/requests', requestRoutes);
    this.app.use('/api/mocks', mockRoutes);
    this.app.use('/api/mock-sets', mockSetRoutes);
    this.app.use('/api', router);
};

// When this file is required return the AdminServer instead
module.exports = AdminServer;