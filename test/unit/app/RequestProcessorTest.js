process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var config = require('config');
var RequestProcessor = require('./../../../app/RequestProcessor');

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
		var mockFileNameServiceMock = sinon.stub();
		mockFileNameServiceMock.getName = function () {
			return 'fileName';
		};
		var requestProcessor = new RequestProcessor(config, mockFileNameServiceMock);

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
