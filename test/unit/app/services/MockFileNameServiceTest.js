var assert = require('chai').assert;
var mockFileNameService = require('./../../../../app/services/MockFileNameService.js');
var IncomingMessage = require('http').IncomingMessage;

describe('mockFileNameService: #getName()', function() {
	describe('create name for GET requests', function() {
		it('should return the name for a normal request without path', function() {
			var req = new IncomingMessage();
			req.originalUrl = '/';
			req.method = 'GET';

			assert.equal(mockFileNameService.getName(req), 'index.txt');
		});

		it('should return the name for a normal request', function() {
			var req = new IncomingMessage();
			req.originalUrl = '/some/URL';
			req.method = 'GET';

			assert.equal(mockFileNameService.getName(req), 'some/url.txt');
		});

		it('should return the name for a request with parameters', function() {
			var req = new IncomingMessage();
			req.originalUrl = '/some/URL?foo=bar';
			req.method = 'GET';

			assert.equal(mockFileNameService.getName(req), 'some/url__foo=bar.txt');
		});

		it('should return the name for a request with special characters', function() {
			var req = new IncomingMessage();
			req.originalUrl = '/some/URL?foo=bar\\%*<>';
			req.method = 'GET';

			assert.equal(mockFileNameService.getName(req), 'some/url__foo=bar%.txt');
		});
	});

	describe('create name for POST requests', function() {
		it('should return the name for a normal request without path', function () {
			var req = new IncomingMessage();
			req.originalUrl = '/some/post/url';
			req.method = 'POST';
			req.body = '{foo: bar}';

			assert.equal(mockFileNameService.getName(req),
				'some/post/url__442d282b457ee4315fe0937da53b9ac3c0a4fffe.txt');
		});

		it('should return the name for a request with parameters', function () {
			var req = new IncomingMessage();
			req.originalUrl = '/some/post/url?foo=bar';
			req.method = 'POST';
			req.body = '{foo: bar}';

			assert.equal(mockFileNameService.getName(req),
				'some/post/url__foo=bar__442d282b457ee4315fe0937da53b9ac3c0a4fffe.txt');
		});
	});
});