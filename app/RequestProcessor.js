var fs = require('fs');
var httpProxy = require('http-proxy');
var bunyan = require('bunyan');
var path = require("path");
var uuid = require('node-uuid');

var RequestProcessor = function(config, mockFileNameService) {
	this.targetConfig = config.get("target");
	this.proxyConfig = config.get("proxy");
	this.mockConfig = config.get("mocks");
	this.mockFileNameService = mockFileNameService;
        
	this.proxy = this.initProxy();
	this.forwardedRequestsLogger = this.initRequestLog(config.get("logging").get("forwardedRequests"));
};

// try to read file, otherwise forward to original target
RequestProcessor.prototype.processRequest = function(req, res) {
	var that = this;
	var mockFile = this.mockFileNameService.getName(req);
	var mockFolder = this.mockConfig.get("enabledFolder");
        
	// try to read the mock file
	fs.readFile(path.resolve(mockFolder + "/" + mockFile), "utf-8", function (err, data) {
		// if file not exists forward to original target otherwise serve mock
		if (err) {			
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
		} else {
			// set file contents as response body
			res.writeHead(
				200,
				{'Content-Type': that.proxyConfig.get("mock.contentType")}
			);
			res.end(data);
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

			that.forwardedRequestsLogger.info(
				{
                                        id: uuid.v1(),
					fileName: mockFileName,
                                        method: req.method,
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
	var forwardedRequestsLogger = bunyan.createLogger({
		name: 'requests',
		streams: [{
				type: "rotating-file",
				path: logConfig.get("file"),
				period: logConfig.get("rotation").get("period"),
				count: logConfig.get("rotation").get("count")
			}]
	});

	return forwardedRequestsLogger;
};

RequestProcessor.prototype.getProxy = function() {
	return this.proxy;
};

RequestProcessor.prototype.getForwardedRequestsLogger = function() {
	return this.forwardedRequestsLogger;
};

module.exports = RequestProcessor;
