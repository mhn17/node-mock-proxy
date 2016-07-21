var path = require("path");

var config = require('config');
var targetConfig = config.get("target");
var proxyConfig = config.get("proxy");

var mockConfig = config.get("mocks");
var mockEnabledFolder = mockConfig.get("enabledFolder");

var loggingConfig = config.get("logging");

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @returns {String} Returns the path to the file where the requests are being saved.
 */
module.exports.getLogFilePath = function() {
   return loggingConfig.get("forwardedRequests").get("file");	
};

/**
 * Returns the path to a mock file.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the corresponding folder.
 * @returns {String} Returns the path to a mock file.
 */
module.exports.getMockPath = function(mockFileName, mockEnabled) {
	
};

/**
 * Returns the path to the folder where the enabled mocks are being stored.
 *
 * @returns {String} Returns the path to the folder where the enabled mocks are being stored.
 */
module.exports.getMockFolderEnabledPath = function() {
	
};
  
/**
* Returns the path to the folder where the available mocks are being stored.
* 
* @returns {String} Returns the path to the folder where the available mocks are being stored.
*/
module.exports.getMockAvailableFolderPath = function() {

};

/**
 * Returns the path to the file where the requests are being saved.
 *
 * @param {String} mockFileName The name of the mock for which the the mock object should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the corresponding folder.
 * @returns {Object} Returns a Javascript object containing the mock data.
 */
module.exports.getMock = function(mockFileName, mockEnabled) {

};