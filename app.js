var http = require('http');
var httpProxy = require('http-proxy');
var config = require('config');

var targetConfig = config.get("target");

httpProxy.createProxyServer({
    target: targetConfig.get("url")
}).listen(8000);
