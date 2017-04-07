// require modules
var express = require('express');
var bodyParser = require('body-parser');

// config
console.log('Loading Configuration for '+ (typeof process.env.NODE_ENV === 'undefined' ? 'default' : typeof process.env.NODE_ENV));
var config = require('config');

// mock look up table
var MockLUT = require('services/MockLUT');

// routes
var routes = require('routes/index');

// Initialize
var MockProxyServer = function() {
	// init server
	this.app = express();
	this.server = null;

	this.proxyConfig = config.get("proxy");
	this.mockLUT = new MockLUT();

	return this;
};

// Start MockProxyServer
MockProxyServer.prototype.start = function() {
	var that = this;

	// init mock LUT
	this.mockLUT.buildCache();

	// get body as raw to create hash of post body
	this.app.use(bodyParser.text({"type": "*/*", limit:1024*1024*20}));
	this.app.use('/*', routes);

	// start mock proxy server
	this.server = this.app.listen(this.proxyConfig.get('port'), function () {
		console.log('Mock proxy listening on port ' + that.proxyConfig.get('port'));
	});
};

// Add a prototype stop function for shutting down the server
MockProxyServer.prototype.stop = function() {
	if (this.server) {
		this.server.close();
	}
};

module.exports = MockProxyServer;