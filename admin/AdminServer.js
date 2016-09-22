var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var config      = require('config');
var fs          = require('fs');

// routes
var requestRoutes = require('routes/requests');
var mockRoutes = require('routes/mocks');

// Make the AdminServer to a real web inserver via the express module
var AdminServer = function() {
    // init server
    this.app = express();
    this.server = null;

    // get admin config
    this.adminConfig = config.get('admin');

	return this;
};

// Add a prototype start function for init stuff
AdminServer.prototype.start = function() {
    var that = this;

    // configure app to use bodyParser()
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // routes
    this.setUpRoutes();

    // start server
    this.server = this.app.listen(this.adminConfig.get('port'), function () {
        console.log('Mock proxy admin API listening on port ' + that.adminConfig.get('port'));
    });
};

// Add a prototype stop function for shutting down the server
AdminServer.prototype.stop = function() {
    if (this.server) {
        this.server.close();
    }
};

// Add a prototype function to setup the route stuff
// Save requests and responses
AdminServer.prototype.setUpRoutes = function() {
    // root URL
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    this.app.use(function (req, res, next) {
        console.log(req.body) // populated!
        next();
    });

    this.app.use('/api/requests', requestRoutes);
    this.app.use('/api/mocks', mockRoutes);

    this.app.use('/api', router);
};

module.exports = AdminServer;