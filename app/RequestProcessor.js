var fs = require('fs');
var httpProxy = require('http-proxy');
var bunyan = require('bunyan');
var path = require("path");

var RequestProcessor = function(config, mockFileNameService) {
	this.targetConfig = config.get("target");
	this.proxyConfig = config.get("proxy");
	this.mockConfig = config.get("mocks");
	this.mockFileNameService = mockFileNameService;

	this.proxy = this.initProxy();
	this.requestLogger = this.initRequestLog(config.get("logging"));
};

// try to read file, otherwise forward to original target
RequestProcessor.prototype.processRequest = function(req, res) {
	var that = this;
	var mockFile = this.mockFileNameService.getName(req);
	var mockFolder = this.mockConfig.get("enabledFolder");

	// try to read the mock file
	fs.readFile(path.resolve(mockFolder + mockFile), "utf-8", function (err, data) {
		// if file exists serve mock otherwise forward to original target
		if (typeof err === "undefined") {
			// set file contents as response body
			res.writeHead(
				200, 
				{'Content-Type': that.proxyConfig.get("mock.contentType")}
			);
			res.end(data);
		} else {
			// fix for node-http-proxy issue 180 
			// (https://github.com/nodejitsu/node-http-proxy/issues/180)
			if (req.method === "POST") {
				req.removeAllListeners('data');
				req.removeAllListeners('end');

				process.nextTick(function () {
					if (req.body) {
						req.emit('data', req.body);
					}
					req.emit('end');
				});
			}
			// end of fix
			
			that.proxy.web(req, res, {target: that.targetConfig.get("url")});
		}
	});
};

// init proxy server
RequestProcessor.prototype.initProxy = function() {
	var that = this;
	var responseData = '';

	// create proxy server
	var proxy = httpProxy.createProxyServer({})
		.on('error', function (e) {
			console.log(JSON.stringify(e, null, ' '));
		})
		.on('proxyRes', function (proxyRes, req) {
			proxyRes.on('data', function (dataBuffer) {
				responseData += dataBuffer.toString('utf8');
			});
		})
		.on('end', function (req, res) {
			var mockFileName = that.mockFileNameService.getName(req);
			that.requestLogger.info(
				{
					fileName: mockFileName,
					request: req.body,
					response: responseData
				},
				'not matched incoming request'
			);
		});
		
	return proxy;
};

// init request logging
RequestProcessor.prototype.initRequestLog = function(logConfig) {
	// create request log
	var requestLogger = bunyan.createLogger({
		name: 'requests',
		streams: [{
				type: "rotating-file",
				path: logConfig.get("file"),
				period: logConfig.get("rotation").get("period"),
				count: logConfig.get("rotation").get("count")
			}]
	});	
	
	return requestLogger;
};

RequestProcessor.prototype.getProxy = function() {
	return this.proxy;
};

RequestProcessor.prototype.getRequestLogger = function() {
	return this.requestLogger;
};

module.exports = RequestProcessor;