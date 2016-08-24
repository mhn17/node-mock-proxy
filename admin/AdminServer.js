var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var config      = require('config');
var fs          = require('fs');

// routes
var requestRoutes = require('routes/requests');
var mockRoutes = require('routes/mocks');

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

    this.app.use('/api/requests', requestRoutes);
    this.app.use('/api/mocks', mockRoutes);

    this.app.use('/api', router);
};

// When this file is required return the AdminServer instead
module.exports = AdminServer;