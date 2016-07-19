var express     = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('config');

// routes
var requestRoutes = require('./routes/requests.js');

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

    // start server
    this.app.listen(this.adminConfig.get('port'), function () {
        console.log('Mock proxy admin API listening on port ' + that.adminConfig.get('port'));
    });
};

AdminServer.prototype.setUpRoutes = function() {
	this.app.use('/api/requests', requestRoutes);
	
	this.app.use('/api', router);
};

module.exports = AdminServer;