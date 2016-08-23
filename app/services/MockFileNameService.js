var crypto = require("crypto");

/**
 * Returns a hash based on a request
 *
 * @param {IncomingMessage} req
 * @returns string
 */
module.exports.getHashByRequest = function(req) {
	// Builds a string out of the protocol and hostname to replace that part of the originalUrl from express in windows
	// with "" because express seems to take the wrong delimiter. example: http:\www.test.com
	var protAndHost = req.protocol + ":\\" + req.hostname;
	var originalUrl = req.originalUrl;

	// This step is needed because there seems to be an express bug in windows which causes originalUrl to
	// return the complete url with protocol and host
	originalUrl = originalUrl.replace(protAndHost, "");

	var body = req.body;
	if (typeof body !== "string") {
		body = "";
	}

	return this.getHash(originalUrl, req.method, body);
};

/**
 * Return a hash based on the URI, method and body to identify a response matching the request
 * @param uri
 * @param method
 * @param body
 * @returns {string}
 */
module.exports.getHash = function(uri, method, body) {
	return crypto.createHash("sha1").update(uri + "###" + method + "###" + body).digest("hex");
};
