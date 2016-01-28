var http = require('http');
var httpProxy = require('http-proxy');
var config = require('config');
var fs = require('fs');
var crypto = require('crypto');

var targetConfig = config.get("target");
var proxyConfig = config.get("proxy");
var proxy = httpProxy.createProxyServer({});

function processrequest(req, res, mockFile) {
    // try to read the mock file
    fs.readFile("mocks" + mockFile + ".txt", "utf-8", function(err, data) {

        // file does not exist -> forward to original target
        if (err != null) {
            proxy.web(req, res, { target: targetConfig.get("url")});
        }
        else {
            // set file contents as response body
            res.writeHead(200, { 'Content-Type': proxyConfig.get("mock.contentType")});
            res.end(data);
        }
    });
}

// set server for checking if a mock exists
var server = http.createServer(function(req, res) {
    var mockFile = req.url.toLowerCase();

    // check body when method is POST
    if (req.method == "POST") {
        var data = "";
        req.on('data', function(chunk) {
            console.log("Received body data:");
            console.log(chunk.toString());
            data += chunk.toString();
        });

        req.on('end', function() {
            mockFile += crypto.createHash("sha1").update(data).digest("hex");
            processrequest(req, res, mockFile);
        });
    }
    else {
        processrequest(req, res, mockFile);
    }


});

// start server
console.log("listening on port " + proxyConfig.get("port"));
server.listen(proxyConfig.get("port"));