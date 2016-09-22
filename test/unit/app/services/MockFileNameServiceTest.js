require('app-module-path').addPath(__dirname + '/../../../../app');
var rewire = require("rewire");
var assert = require('chai').assert;

var ExtensionServiceMock = require('./../../../mocks/extensionServiceMock/services/ExtensionService');
var MockFileNameService = rewire('./../../../../app/services/MockFileNameService.js');
MockFileNameService.__set__('ExtensionService', ExtensionServiceMock);
var mockFileNameService = new MockFileNameService();
var IncomingMessage = require('http').IncomingMessage;

describe('MockFileNameService', function() {

	describe('#getHashByRequest()', function() {
		describe('get hash for GET requests', function() {
			it('should return the hash for a normal request without path', function() {
				var req = new IncomingMessage();
				req.originalUrl = '/';
				req.method = 'GET';

				assert.equal(mockFileNameService.getHashByRequest(req), 'c619c8ddc22e8fb4a5f55a5a5db0330273607793');
			});

			it('should return the hash for a normal request with path', function() {
				var req = new IncomingMessage();
				req.originalUrl = '/some/URL';
				req.method = 'GET';

				assert.equal(mockFileNameService.getHashByRequest(req), '11e1b1555e3adb37c37eb25db86110e39d0a4cbb');
			});

			it('should return the hash for a request with parameters', function() {
				var req = new IncomingMessage();
				req.originalUrl = '/some/URL?foo=bar';
				req.method = 'GET';

				assert.equal(mockFileNameService.getHashByRequest(req), '01c8ac946a8d4d6aec6c6fb7da6d86cf9b27e14e');
			});

			it('should return the hash for a request with special characters', function() {
				var req = new IncomingMessage();
				req.originalUrl = '/some/URL?foo=bar\\%*<>';
				req.method = 'GET';

				assert.equal(mockFileNameService.getHashByRequest(req), 'ab84bea615dceea45394b50d2341240d5c002ce8');
			});
		});

		describe('get hash for POST requests', function() {
			it('should return the hash for a normal request without path', function () {
				var req = new IncomingMessage();
				req.originalUrl = '/some/post/url';
				req.method = 'POST';
				req.body = '{foo: bar}';

				assert.equal(mockFileNameService.getHashByRequest(req), '2be06d009f50bc413e99a0a954d1fde9d7444ad0');
			});

			it('should return the hash for a request with parameters', function () {
				var req = new IncomingMessage();
				req.originalUrl = '/some/post/url?foo=bar';
				req.method = 'POST';
				req.body = '{foo: bar}';

				assert.equal(mockFileNameService.getHashByRequest(req), 'b25dbc430dfbf7d28955547389b4d7114454b0c3');
			});
		});
	});

	describe('#getHash()', function() {
		it('should return a hash based on URI, method and body', function() {
			assert.equal(mockFileNameService.getHash('/path/to/resource', 'POST', '{some:body}'),
				'8f8c0fb3caa8e4c91f4803b41e1e5aa1c8cdcc3c');
		});
	});
});