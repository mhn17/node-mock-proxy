var config = require('config').get('mocks');

var ExtensionService = function() {
	if (process.mainModule.instances.extensionService) {
		return process.mainModule.instances.extensionService;
	}

	// array of pre processors
	this.preProcessors = [];
	this.setUp();
	process.mainModule.instances.extensionService = this;
	return this;
};

ExtensionService.prototype.setUp = function() {
	if (config.get('requests').get('preProcessors')) {
		var preProcessors = config.get('requests').get('preProcessors');
		var that = this;

		preProcessors.forEach(function (processorName) {
			var processor = require('' + processorName);

			if (typeof processor === 'object') {
				switch (processor.version) {
					case 1:
						if (typeof processor.process === 'function') {
							that.preProcessors.push(processor.process);
							console.log('Pre processor "' + processorName + '" added');
						} else {
							throw new Error('No process function in pre processor "' + processorName + '"');
						}
						break;
					default:
						throw new Error('Pre processor version not supported');
						break;
				}
			}
		});
	}
};

ExtensionService.prototype.processPreProcessors = function(body) {
	this.preProcessors.forEach(function(process){
		body = process(body);
	});

	return body;
};


module.exports = ExtensionService;