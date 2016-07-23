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
 * Returns the path to a mock file.
 *
 * @param {String} mockFileName Name of the mock file to which the path should be returned.
 * @param {Boolean} mockEnabled Describes if the mock is enabled or disabled. Used to look for the log file in the corresponding folder.
 * @returns {Object} Returns an object containing:
 *   - filePath: The filepath of the mock
 *   - enabled: True or false depending if the mock is enabled or disabled
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
 * @returns {Object} Returns an object containing:
 *   - filePath: The filepath of the mock
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
 * Returns the path to a mock file. Checks for the mock first in the available 
 * directory. If the file is not found in that directory, then the enabled folder
 * will be searched.
 *
 * @param {String} mockId Id of the mock file to which the path should be returned.
 * @returns {Object} Returns an object containing:
 *   - filePath: The filepath of the mock
 *   - enabled: True or false depending if the mock is enabled or disabled
 */
PathService.getMockPathById = function(mockId) {
    var mock = PathService.getMockById(mockId);
    
    return { 
        filePath: path.resolve(PathService.getMockPathBySearch(mock.fileName).filePath),
        enabled: mock.enabled
    };
};

/**
 * Returns an array of objects representing the mocks. Each mock hast the following informations:
 *  - id
 *  - fileName,
 *  - request.
 *  - response,
 *  - method
 *  - enabled
 *  
 * @param {String} mockId The id of the mock for which the the mock object should be returned.
 * @returns {Array} Returns an array of javascript objects containing the mock data.
 */
PathService.getMocks = function() {
    var mockList = [];
    
    
    // Get enabled mocks and add them to the result array
    var enabledMocks = fs.readdirSync(PathService.getMockEnabledFolderPath());
    
    // You could probably use array concat for this but how to filter other files
    // gracefully?
    enabledMocks.forEach(function(entry) {
        if(entry !== ".gitignore"){
            mockList.push(PathService.getMock(entry));
        }
    });
    
    // Get available mocks and add them to the result array
    var availableMocks = fs.readdirSync(PathService.getMockAvailableFolderPath());
    
    // You could probably use array concat for this but how to filter other files
    // gracefully?
    availableMocks.forEach(function(entry) {
        if(entry !== ".gitignore"){
            mockList.push(PathService.getMock(entry));
        }
    });
    
    return mockList;
};

/**
 * Returns an object representing a mock which contains the following information:
 *  - id
 *  - fileName,
 *  - request.
 *  - response,
 *  - method
 *  - enabled
 *
 * @param {String} mockFileName The name of the mock for which the the mock object should be returned.
 * @returns {Object} Returns a Javascript object containing the mock data.
 */
PathService.getMock = function(mockFileName) {
    var mockPath = PathService.getMockPathBySearch(mockFileName);
    var mockFileObject = JSON.parse(fs.readFileSync(mockPath.filePath, "utf-8"));
    
    mockFileObject.enabled = mockPath.enabled;
    
    return mockFileObject;
};

/**
 * Returns an object representing a mock which contains the following information:
 *  - id
 *  - fileName,
 *  - request,
 *  - response,
 *  - method
 *  - enabled
 *  
 * @param {String} mockId The id of the mock for which the the mock object should be returned.
 * @returns {Object} Returns a javascript object containing the mock data.
 */
PathService.getMockById = function(mockId){
    var result = {};
    var mocks = PathService.getMocks();
    
    mocks.forEach(function(entry){
        if(entry.id === mockId){
            result = entry;
            return;
        }
    });
   
    return result;
}

module.exports = PathService;