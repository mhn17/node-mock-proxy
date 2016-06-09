var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');
var config = require('config');
var fs = require('fs');
var crypto = require('crypto');
var bunyan = require('bunyan');

var targetConfig = config.get("target");
var proxyConfig = config.get("proxy");
var requestsLog = bunyan.createLogger({
    name: 'requests',
    streams: [{
        type: 'rotating-file',
        path: 'logs/requests.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

// create proxy server
var proxy = httpProxy.createProxyServer({})
    .on('error', function(e) {
        console.log(JSON.stringify(e, null, ' '))
});


// try to read file, otherwise forward to original target
function processRequest(req, res, mockFile) {
    // try to read the mock file
    fs.readFile("mocks-enabled" + mockFile + ".txt", "utf-8", function(err, data) {

        // if file exists serve mock otherwise forward to original target
        if (err == null) {
            // set file contents as response body
            res.writeHead(200, { 'Content-Type': proxyConfig.get("mock.contentType")});
            res.end(data);
        }
        else {
            // fix for node-http-proxy issue 180 (https://github.com/nodejitsu/node-http-proxy/issues/180)
            req.removeAllListeners('data');
            req.removeAllListeners('end');

            process.nextTick(function () {
                if(req.body) {
                    req.emit('data', req.body)
                }
                req.emit('end')
            });
            // end of fix

            requestsLog.info({fileName: mockFile + ".txt", body: req.body}, 'not matched incoming request');
            proxy.web(req, res, { target: targetConfig.get("url")});
        }
    });
}

// get body as raw to create hash of post body
app.use(bodyParser.text({"type": "*/*"}));

// handle GET requests
app.get("/*", function(req, res){
    var mockFileName = req.url.toLowerCase();
    processRequest(req, res, mockFileName);
});

// handle POST requests
app.post("/*", function(req, res) {
    var mockFileName = req.url.toLowerCase();
    mockFileName += crypto.createHash("sha1").update(req.body).digest("hex");
    processRequest(req, res, mockFileName);
});

// start server
app.listen(proxyConfig.get("port"), function () {
    console.log('Mock proxy listening on port ' + proxyConfig.get("port"));
});