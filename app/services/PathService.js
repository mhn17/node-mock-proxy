var path = require("path");
var fs = require('fs-extra');

// load config
var config = require('config');
var mockConfig = config.get("mocks");
var loggingConfig = config.get("logging");

/**
 * PathService object declaration. Could be made a function object for more flexibility.
 * Creates the folders for mocks if they do not already exist.
 */
var PathService = function() {
    this._createDirectoryIfItDoesNotExist(this.getMockSetPath());
    this._createDirectoryIfItDoesNotExist(this.getMockAvailableFolderPath());
    this._createDirectoryIfItDoesNotExist(this.getMockEnabledFolderPath());
};

/**
 * Creates a folder if it does not already exist.
 * @param folderPath The folder path which should be created if it does not exist.
 * @private
 */
PathService.prototype._createDirectoryIfItDoesNotExist = function(folderPath) {
    console.log('Creating folder structure: ' + folderPath);
    fs.stat(folderPath, function (err, stat) {
        // Create file if it does not exist
        if(err == null || err == 'undefined'){
            console.log("Folder path aready exists: " + folderPath);
        } else if(err.code == 'ENOENT') {
            console.log('Creating folder structure: ' + folderPath);
            fs.mkdirs(folderPath);
        } else {
            throw 'Failed to check for folder existence: ' + folderPath + " with error code: " +  err.code;
        }
    });
};

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @returns {String} Returns the path to the file where the requests are being saved.
 */
PathService.prototype.getLogFilePath = function() {
   return path.resolve(loggingConfig.get("forwardedRequests").get("file"));
};

/**
 * Returns the path to the file where the mocks which were returned to the caller are stored.
 *
 * @returns {String} Returns the path to the file where the mocks which were returned to the caller are stored.
 */
PathService.prototype.getReturnedMocksLogFilePath = function() {
    return path.resolve(loggingConfig.get("returnedMocks").get("file"));
};

/**
 * Returns the path to the folder where the mock sets are being saved.
 * 
 * @returns {String} Path to the folder where the mock sets are being saved.
 */
PathService.prototype.getMockSetPath = function() {
    return path.resolve(mockConfig.get("mockSetFolder"))  + path.sep;
};

/**
 * Returns the path to the folder where the enabled mocks are being stored.
 *
 * @returns {String} Returns the path to the folder where the enabled mocks are being stored.
 */
PathService.prototype.getMockEnabledFolderPath = function() {
    return path.resolve(mockConfig.get("enabledFolder")) + path.sep;
};

/**
* Returns the path to the folder where the available mocks are being stored.
*
* @returns {String} Returns the path to the folder where the available mocks are being stored.
*/
PathService.prototype.getMockAvailableFolderPath = function() {
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
PathService.prototype.getMockPath = function(mockFileName, mockEnabled) {
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
PathService.prototype.getMockPathBySearch = function(mockFileName) {
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
PathService.prototype.getListOfMockFiles = function(dir) {
	var mockFiles = [];
	var fileList = fs.readdirSync(dir);

	while (fileList.length > 0) {
		var file = fileList.pop();
        var filePath = path.join(dir, file);
        var fileStat = fs.statSync(filePath);

        if (!file || (file.indexOf(".json") == -1 && !fileStat.isDirectory()))
        {
            console.log('The file ' + file
                + ' in folder ' + dir + ' is no mock file and will be ignored.');
            continue;
        }

		if (fileStat.isDirectory()) {
			mockFiles = mockFiles.concat(this.getListOfMockFiles(filePath));
		} else {
			mockFiles.push(path.resolve(filePath));
		}
	}

	return mockFiles;
};

module.exports = new PathService();