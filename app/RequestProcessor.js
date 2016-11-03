var fs = require('fs');
var httpProxy = require('http-proxy');
var bunyan = require('bunyan');
var path = require("path");
var uuid = require('node-uuid');
var MockLUT = require('services/MockLUT');
var MockFileNameService = require('services/MockFileNameService');
var config = require('config');

var RequestProcessor = function () {
    this.targetConfig = config.get("target");
    this.proxyConfig = config.get("proxy");
    this.mockConfig = config.get("mocks");
    this.mockFileNameService = new MockFileNameService();
    this.mockLUT = new MockLUT();

    this.proxy = this.initProxy();
    this.forwardedRequestsLogger = this.initRequestLog(config.get("logging").get("forwardedRequests"));
    this.returnedMockLogger = this.initMockLog(config.get("logging").get("returnedMocks"));
};

// try to read file, otherwise forward to original target
RequestProcessor.prototype.processRequest = function (req, res) {
    var hash = this.mockFileNameService.getHashByRequest(req);
    var mock = this.mockLUT.getMockByHash(hash);

    if (mock) {
        console.log("Mock found, delivering response from " + mock.getFileName());
        this.returnedMockLogger.info({
            id: mock.getId(),
            name: mock.getName(),
            description: mock.getDescription(),
            requestUri: mock.getRequest().getUri(),
            requestMethod: mock.getRequest().getMethod(),
            requestBody: mock.getRequest().getBody(),
            responseBody: mock.getResponse().getBody()
        });

        // set file contents as response body
        res.writeHead(
            200,
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
                    req.emit('data', req.body);
                }
                req.emit('end');
            });
        }
        // end of fix

		console.log('PassThru: '+req.originalUrl);

        // use
        var target = this.targetConfig.get("url") + req.originalUrl;

        // kill parsed query params, cause they already sit in the url!
        req.query = {};

        this.proxy.web(req, res, {target: target});
    }
};

// init proxy server
RequestProcessor.prototype.initProxy = function () {
    var that = this;
    var responseData = '';

    // create proxy server
    return httpProxy.createProxyServer({'ignorePath': true})
        .on('error', function (e) {
            console.log(JSON.stringify(e, null, ' '));
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

            that.forwardedRequestsLogger.info(
                {
                    id: uuid.v1(),
                    request: {
                        uri: reqUri,
                        method: req.method,
                        body: req.body
                    },
                    response: {
                        body: responseData
                    }
                }
            );
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

module.exports = RequestProcessor;
