var crypto = require("crypto");
var sanitize = require("sanitize-filename");
var path = require("path");

/**
 * Create and returns the file name for a mock
 *
 * @param {type} req
 * @returns string
 */
module.exports.getName = function(req) {
	var originalUrl = req.originalUrl;
	if (originalUrl == "/") {
		originalUrl = "/index";
	}

	var mockFileNameAndPath = originalUrl.split("/");
	var mockFileName = mockFileNameAndPath.pop();
	var mockPath = path.join.apply(null, mockFileNameAndPath);

	// Needs some improvement here for better naming
	// Replace needs some tweaking via regex or whatever because else it only
	// uses the first found element...
	mockFileName = mockFileName.toLowerCase();
	mockFileName = mockFileName.replace("?", "__");

       // Add something unique to post because of the body stuff requests
	if (req.method === "POST") {
		mockFileName += "__" + crypto.createHash("sha1").update(req.body).digest("hex");
	}

	mockFileName = sanitize(mockFileName + ".txt");

	return path.join.apply(null, [mockPath, mockFileName]);
};
