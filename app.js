// define space for singletons
process.mainModule.instances = {};

// configure require
require('app-module-path').addPath(__dirname + '/app');
require('app-module-path').addPath(__dirname + '/admin');
require('app-module-path').addPath(__dirname + '/custom-processors');

// require modules
var AdminServer = require('AdminServer');
var MockProxyServer = require('MockProxyServer');

// start mock proxy server
process.mainModule.mockProxyServer = new MockProxyServer();
process.mainModule.mockProxyServer.start();

// start admin API server
process.mainModule.adminServer = new AdminServer();
process.mainModule.adminServer.start();