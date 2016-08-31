var path = require("path");
var fs = require('fs');

// load config
var config = require('config');
var mockConfig = config.get("mocks");
var loggingConfig = config.get("logging");

/**
 * PathService object declaration. Could be made a function object for more flexibility.
 */
var PathService = {};

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @returns {String} Returns the path to the file where the requests are being saved.
 */
PathService.getLogFilePath = function() {
   return path.resolve(loggingConfig.get("forwardedRequests").get("file"));
};

/**
 * Returns the path to the file where the mocks which were returned to the caller are stored.
 *
 * @returns {String} Returns the path to the file where the mocks which were returned to the caller are stored.
 */
PathService.getReturnedMocksLogFilePath = function() {
    return path.resolve(loggingConfig.get("returnedMocks").get("file"));
};

/**
 * Returns the path to the folder where the enabled mocks are being stored.
 *
 * @returns {String} Returns the path to the folder where the enabled mocks are being stored.
 */
PathService.getMockEnabledFolderPath = function() {
    return path.resolve(mockConfig.get("enabledFolder")) + path.sep;
};

/**
* Returns the path to the folder where the available mocks are being stored.
*
* @returns {String} Returns the path to the folder where the available mocks are being stored.
*/
PathService.getMockAvailableFolderPath = function() {
    return path.resolve(mockConfig.get("availableFolder")) + path.sep;
};

/**
 * Returns the complete path to a mock file including its name and type.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the
 * 					corresponding folder.
 * @returns {Object} The file path of the mock
 */
PathService.getMockPath = function(mockFileName, mockEnabled) {
    var mockPath = '';

    // Determine if the mock is enabled or disabled
    if(mockEnabled === 'true' || (typeof mockEnabled === 'boolean' && mockEnabled)){
        mockPath = PathService.getMockEnabledFolderPath() + path.sep + mockFileName;
    } else {
        mockPath = PathService.getMockAvailableFolderPath() + path.sep + mockFileName;
    }

    return path.resolve(mockPath);
};

/**
 * Returns the path to a mock file. Checks for the mock first in the available
 * directory. If the file is not found in that directory, then the enabled folder
 * will be searched.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @returns {Object} Returns an object containing:
 *   - filePath: The file path of the mock
 *   - enabled: True or false depending if the mock is enabled or disabled
 */
PathService.getMockPathBySearch = function(mockFileName) {
    // ToDo: What should happen if the mock is not found? Throw an exception?
    if(fs.existsSync(PathService.getMockPath(mockFileName, false))){
        return {
            filePath: PathService.getMockPath(mockFileName, false),
            enabled: false
        }
    } else {
        return {
            filePath: PathService.getMockPath(mockFileName, true),
            enabled: true
        }
    }
};


/**
 * Returns all mock files, either enabled or available
 *
 * @param {String} dir The directory to look for mock files
 * @returns {Array}
 */
PathService.getListOfMockFiles = function(dir) {
	var mockFiles = [];
	var fileList = fs.readdirSync(dir);

	while (fileList.length > 0) {
		var file = fileList.pop();
        var filePath = path.join(dir, file);
        var fileStat = fs.statSync(filePath);

        if (!file || (file.indexOf(".json") == -1 && !fileStat.isDirectory())) { break; }

		if (fileStat.isDirectory()) {
			mockFiles = mockFiles.concat(this.getListOfMockFiles(filePath));
		} else {
			mockFiles.push(path.resolve(filePath));
		}
	}

	return mockFiles;
};

module.exports = PathService;