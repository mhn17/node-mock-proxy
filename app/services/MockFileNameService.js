var crypto = require('crypto');

/**
 * Create and returns the file name for a mock
 *
 * @param {type} req
 * @returns {module.exports.getName.mockFileName}
 */
module.exports.getName = function(req) {
	var mockFileName;

        if(req.baseUrl){
            mockFileName = req.baseUrl;
        }else if(req._parsedUrl.hostname){
            mockFileName = req._parsedUrl.hostname;
        }else{
            mockFileName = "Unkown";
        }

        // Needs some improvement here for better naming
        // Replace needs some tweaking via regex or whatever because else it only
        // uses the first found element...
        mockFileName = mockFileName.toLowerCase();
        mockFileName = mockFileName.replace("/", "_");
        mockFileName = mockFileName.replace(":", "-");


        // Add something unique to post because of the body stuff requests
	if (req.method === "POST") {
            mockFileName += "_" + crypto.createHash("sha1").update(req.body).digest("hex");
	}

        // Add get parameter to name
        if (req.method === "GET") {
            mockFileName += "_" + req._parsedUrl.search;

            // Replace needs some tweaking via regex or whatever because else it only
            // uses the first found element...
            mockFileName = mockFileName.replace("?", ",");
            mockFileName = mockFileName.replace("=", "-");
            mockFileName = mockFileName.replace(".", "-");
	}

        mockFileName += new Date().getHours();
        mockFileName += new Date().getMinutes();
        mockFileName += new Date().getSeconds();

	return mockFileName + ".txt";
};
