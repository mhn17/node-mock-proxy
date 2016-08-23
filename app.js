require('app-module-path').addPath(__dirname + '/app');
require('app-module-path').addPath(__dirname + '/admin');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var AdminServer = require('AdminServer');

// config
var config = require('config');
var proxyConfig = config.get("proxy");

// build Mock LUT
var MockLUT = require('services/MockLUT');
new MockLUT().buildCache();

// routes
var routes = require('routes/index');

// get body as raw to create hash of post body
app.use(bodyParser.text({"type": "*/*"}));
app.use('/*', routes);

// start mock proxy server
app.listen(proxyConfig.get('port'), function () {
    console.log('Mock proxy listening on port ' + proxyConfig.get('port'));
});

// start admin API server
var adminServer = new AdminServer();
adminServer.start();