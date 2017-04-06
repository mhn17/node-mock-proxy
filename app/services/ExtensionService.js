var config = require('config');

var ExtensionService = function() {
	if (process.mainModule.instances.extensionService) {
		return process.mainModule.instances.extensionService;
	}

	// define types
	this.TYPE_MOCK_REQUEST_PROCESSORS = "mockRequestProcessors";
	this.TYPE_LOG_PROCESSORS = "logProcessors";

	// array of types
	this.types = [
		this.TYPE_MOCK_REQUEST_PROCESSORS,
		this.TYPE_LOG_PROCESSORS
	];

	// object for extensions
	this.extensions = {};
	this.extensions[this.TYPE_MOCK_REQUEST_PROCESSORS] = [];
	this.extensions[this.TYPE_LOG_PROCESSORS] = [];

	this.setUp();
	process.mainModule.instances.extensionService = this;
	return this;
};

/**
 * Setup extensions
 */
ExtensionService.prototype.setUp = function() {
	if (config.has("extensions")) {
		var extensionConfig = config.get("extensions");
		var that = this;

		this.types.forEach(function (type) {
			if (extensionConfig.has(type) && Array.isArray(extensionConfig.get(type))) {
				extensionConfig.get(type).forEach(function (extension) {
					that.initExtension(type, extension)
				})
			}
		});
	}
};

/**
 * Initialize extension and add it to extensions array
 * @param type
 * @param extensionName
 */
ExtensionService.prototype.initExtension = function(type, extensionName) {
	var extension = require('' + extensionName);

	if (typeof extension === 'object') {
		switch (extension.version) {
			case 1:
				if (typeof extension.process === 'function') {
					this.extensions[type].push(extension.process);
					console.log('Extension "' + extensionName + '" added for type "' + type + '"');
				} else {
					throw new Error('No process function in extension "' + extensionName + '"');
				}
				break;
			default:
				throw new Error('Extension version not supported');
				break;
		}
	}
};

/**
 * Process extensions depending on type
 * @param type
 * @param content
 * @returns {*}
 */
ExtensionService.prototype.process = function(type, content) {
	this.extensions[type].forEach(function(process){
		content = process(content);
	});

	return content;
};

module.exports = ExtensionService;