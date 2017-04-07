var fs = require('fs');
var httpProxy = require('http-proxy');
var bunyan = require('bunyan');
var path = require("path");
var uuid = require('node-uuid');
var MockLUT = require('services/MockLUT');
var MockRequest = require('domain/models/MockRequest');
var MockFileNameService = require('services/MockFileNameService');
var ExtensionService = require('services/ExtensionService');
var config = require('config');

var RequestProcessor = function () {
    this.targetConfig = config.get("target");
    this.proxyConfig = config.get("proxy");
    this.mockConfig = config.get("mocks");
    this.mockFileNameService = new MockFileNameService();
    this.extensionService = new ExtensionService();
    this.mockLUT = new MockLUT();

    this.forwardedRequestsLogger = this.initRequestLog(config.get("logging").get("forwardedRequests"));
    this.returnedMockLogger = this.initMockLog(config.get("logging").get("returnedMocks"));
};

// try to read file, otherwise forward to original target
RequestProcessor.prototype.processRequest = function (req, res) {
	var mockRequest = this.createMockRequestFromRequest(req);
	mockRequest = this.extensionService.process(this.extensionService.TYPE_MOCK_REQUEST_PROCESSORS, mockRequest);
    var hash = this.mockFileNameService.getHash(mockRequest);
    var mock = this.mockLUT.getMockByHash(hash);

    if (mock) {
        console.log("Mock found: " + mock.getFileName());
        this.returnedMockLogger.info(JSON.stringify(mock));

        var statusCode = 200;
        if (mock.statusCode) {
            statusCode = mock.statusCode;
        }

        // set file contents as response body
        res.writeHead(
			statusCode,
            {'Content-Type': this.proxyConfig.get("mock.contentType")}
        );
        res.end(mock.response.body);
    } else {
        // fix for node-http-proxy issue 180
        // (https://github.com/nodejitsu/node-http-proxy/issues/180)
        if (req.method === "POST") {
            req.removeAllListeners('data');
            req.removeAllListeners('end');

            process.nextTick(function () {
                if (req.body) {
                    req.emit('data', req.body + '');
                }
                req.emit('end');
            });
        }
		// end of fix

        // use
        var target = this.targetConfig.get("url") + req.originalUrl;

        // kill parsed query params, cause they already sit in the url!
        req.query = {};

        var proxy = this.getProxyObject();
        proxy.web(req, res, {target: target});
    }
};

// init proxy server
RequestProcessor.prototype.getProxyObject = function () {
    var that = this;
    var responseData = '';

    var startTime = process.hrtime();

    // create proxy server
    return httpProxy.createProxyServer({'ignorePath': true, 'changeOrigin': true})
        .on('error', function (e) {
            console.log("Error: ", JSON.stringify(e, null, ' '));
        })
        .on('proxyRes', function (proxyRes, req) {
            proxyRes.on('data', function (dataBuffer) {
                responseData += dataBuffer.toString('utf8');
            });
        })
        .on('end', function (req, res) {
            // Fixes express bug in windows which causes originalUrl to
            // return the complete url with protocol and host
            var protAndHost = req.protocol + "://" + req.hostname;
            var reqUri = req.originalUrl.replace(protAndHost, "");

            var logEntry = {
				id: uuid.v1(),
				request: {
					uri: reqUri,
					method: req.method,
					body: req.body
				},
				response: {
					body: responseData
				},
				info: ''
			};

			logEntry = that.extensionService.process(that.extensionService.TYPE_LOG_PROCESSORS, {"logEntry": logEntry, "req": req});

            that.forwardedRequestsLogger.info(logEntry);
            responseData = '';
        });
};

// init request logging
RequestProcessor.prototype.initRequestLog = function (logConfig) {
    // create request log
    return bunyan.createLogger({
        name: 'requests',
        streams: [{
            type: "rotating-file",
            path: logConfig.get("file"),
            period: logConfig.get("rotation").get("period"),
            count: logConfig.get("rotation").get("count")
        }]
    });
};

// init mock logging
RequestProcessor.prototype.initMockLog = function (logConfig) {
    // create mock log
    return bunyan.createLogger({
        name: 'returnedMocks',
        streams: [{
            type: "rotating-file",
            path: logConfig.get("file"),
            period: logConfig.get("rotation").get("period"),
            count: logConfig.get("rotation").get("count")
        }]
    });
};

RequestProcessor.prototype.getProxy = function () {
    return this.proxy;
};

RequestProcessor.prototype.getForwardedRequestsLogger = function () {
    return this.forwardedRequestsLogger;
};

/**
 * create a MockRequest from a request object
 * @param req
 */
RequestProcessor.prototype.createMockRequestFromRequest = function(req) {
	// Builds a string out of the protocol and hostname to replace that part of the originalUrl from express in windows
	// with "" because express seems to take the wrong delimiter. example: http:\www.test.com
	var protAndHost = req.protocol + ":\\" + req.hostname;
	var originalUrl = req.originalUrl;

	// This step is needed because there seems to be an express bug in windows which causes originalUrl to
	// return the complete url with protocol and host
	originalUrl = originalUrl.replace(protAndHost, "");

	var mockRequest = new MockRequest();
	mockRequest.setUri(originalUrl);
	mockRequest.setMethod(req.method);
	mockRequest.setBody(req.body);

	return mockRequest;
};

module.exports = RequestProcessor;
