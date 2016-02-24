var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');
var config = require('config');
var fs = require('fs');
var crypto = require('crypto');

var targetConfig = config.get("target");
var proxyConfig = config.get("proxy");

// create proxy server
var proxy = httpProxy.createProxyServer({}).on('error', function(e) {
    console.log(JSON.stringify(e, null, ' '))
});

// try to read file, otherwise forward to original target
function processRequest(req, res, mockFile) {
    // try to read the mock file
    fs.readFile("mocks" + mockFile + ".txt", "utf-8", function(err, data) {

        // if file exists serve mock otherwise forward to original target
        if (err == null) {
            // set file contents as response body
            res.writeHead(200, { 'Content-Type': proxyConfig.get("mock.contentType")});
            res.end(data);
        }
        else {
            proxy.web(req, res, { target: targetConfig.get("url")});
        }
    });
}

// get body as raw to create hash of post body
app.use(bodyParser.raw());

// handle GET requests
app.get("/*", function(req, res){
    var mockFileName = req.url.toLowerCase();
    processRequest(req, res, mockFileName);
});

// handle POST requests
app.post("/*", function(req, res) {
    var mockFileName = req.url.toLowerCase();
    mockFileName += crypto.createHash("sha1").update(req.body.toString()).digest("hex");
    processRequest(req, res, mockFileName);
});

// start server
app.listen(proxyConfig.get("port"), function () {
    console.log('Example app listening on port ' + proxyConfig.get("port"));
});