var crypto = require("crypto");
var ExtensionService = require("services/ExtensionService");

var MockFileNameService = function() {
	this.extensionService = new ExtensionService();
};

/**
 * Return a hash based on the URI, method and body to identify a response matching the request
 * @param mockRequest
 * @returns {string}
 */
MockFileNameService.prototype.getHash = function(mockRequest) {
	if (typeof mockRequest.getBody() !== "string") {
		mockRequest.setBody("");
	}

	var hashString = mockRequest.getUri() + "###" + mockRequest.getMethod() + "###" + mockRequest.getBody();
	return crypto.createHash("sha1").update(hashString).digest("hex");
};

module.exports = MockFileNameService;