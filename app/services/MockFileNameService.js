var crypto = require('crypto');

/**
 * Create and returns the file name for a mock
 * 
 * @param {type} req
 * @returns {module.exports.getName.mockFileName}
 */
module.exports.getName = function(req) {
	var mockFileName = req.baseUrl.toLowerCase();
	if (req.method === "POST") {
		mockFileName += "/" + crypto.createHash("sha1").update(req.body).digest("hex");	
	}

	return mockFileName + ".txt";
};