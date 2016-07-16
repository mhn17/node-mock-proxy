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
        
        mockFileName = mockFileName.toLowerCase();
        mockFileName = mockFileName.replace("/", "_");
        mockFileName = mockFileName.replace(":", "-");
        
	//if (req.method === "POST") {
	//	mockFileName += "/" + crypto.createHash("sha1").update(req.body).digest("hex");	
	//}

	return mockFileName;
};