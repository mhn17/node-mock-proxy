var path = require("path");
var fs = require('fs');
var config = require('config');
var targetConfig = config.get("target");
var proxyConfig = config.get("proxy");

var mockConfig = config.get("mocks");
var mockEnabledFolder = mockConfig.get("enabledFolder");

var loggingConfig = config.get("logging");

/**
 * PathService object declaration. Could be made a function object for more flexibility.
 */
var PathService = {}

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @returns {String} Returns the path to the file where the requests are being saved.
 */
PathService.getLogFilePath = function() {
   return path.resolve(loggingConfig.get("forwardedRequests").get("file"));	
};

/**
 * Returns the path to a mock file.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the corresponding folder.
 * @returns {String} Returns the path to a mock file.
 */
PathService.getMockPath = function(mockFileName, mockEnabled) {
    var mockPath = '';
    
    // Determine if the mock is enabled or disabled
    // Damn that truthy stuff
    if(mockEnabled === 'true' || (typeof mockEnabled === 'boolean' && mockEnabled)){
        mockPath = PathService.getMockEnabledFolderPath() + "/" + mockFileName;
    } else {
        mockPath = PathService.getMockAvailableFolderPath() + "/" + mockFileName;
    }
    
    return path.resolve(mockPath);
};

/**
 * Returns the path to a mock file. Checks for the mock first in the available 
 * directory. If the file is not found in that directory, then the enabled folder
 * will be searched.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @returns {String} Returns the path to a mock file.
 */
PathService.getMockPathBySearch = function(mockFileName) {
    var mockPath = '';
    
    // ToDo: What should happen if the mock is not found? Throw an exception?
    if(fs.existsSync(PathService.getMockPath(mockFileName, false))){
           mockPath = PathService.getMockPath(mockFileName, false);
    } else {
        mockPath = PathService.getMockPath(mockFileName, true);
    }
    
    return path.resolve(mockPath);
};

/**
 * Returns the path to the folder where the enabled mocks are being stored.
 *
 * @returns {String} Returns the path to the folder where the enabled mocks are being stored.
 */
PathService.getMockEnabledFolderPath = function() {
    return path.resolve(mockConfig.get("enabledFolder"));
};
  
/**
* Returns the path to the folder where the available mocks are being stored.
* 
* @returns {String} Returns the path to the folder where the available mocks are being stored.
*/
PathService.getMockAvailableFolderPath = function() {
    return path.resolve(mockConfig.get("availableFolder"));
};

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @param {String} mockFileName The name of the mock for which the the mock object should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the corresponding folder.
 * @returns {Object} Returns a Javascript object containing the mock data.
 */
PathService.getMock = function(mockFileName, mockEnabled) {
    // TBD
};

module.exports = PathService;