var rewire = require('rewire');
var expect = require('chai').expect;
var fs = require('fs');
var config = require('config');

var mockFileNameServiceMock = {};
var mockLUTMock = {};

var RequestProcessor = rewire('./../../../app/RequestProcessor');
RequestProcessor.__set__('mockFileNameService', mockFileNameServiceMock);
RequestProcessor.__set__('mockLUT', mockLUTMock);
var requestProcessor = new RequestProcessor();

describe('RequestProcessor:', function() {

	beforeEach('clear log file', function() {
		try {
			fs.accessSync(config.get('logging').get('forwaredRequests').get('file'));
			fs.unlink(config.get('logging').get('forwaredRequests').get('file'));
		} catch (e) {
			// do nothing, file does not exist
		}
	});

	describe('init', function() {
		it('should set up the proxy server', function() {
			var proxy = requestProcessor.getProxy();
			expect(proxy).to.not.be.undefined;
		});

		it('should set up the request logging', function() {
			var forwardedRequestsLogger = requestProcessor.getForwardedRequestsLogger();
			expect(forwardedRequestsLogger).to.not.be.undefined;
		});
	});
});
