var sinon = require('sinon');
var assert = require('chai').assert;
var mockFileNameService = require('./../../../../app/services/MockFileNameService.js');

describe('mockFileNameService: #getName()', function() {
	it('should return the name for a GET request', function() {
		var req = {
			baseUrl: '/some/URL',
			method: 'GET'
		};
		
		assert.equal(mockFileNameService.getName(req), '/some/url.txt');
	});
	
	it('should return the name for a POST request', function() {
		var req = {
			baseUrl: '/some/post/url',
			method: 'POST',
			body: '{foo: bar}'
		};

		assert.equal(mockFileNameService.getName(req), 
			'/some/post/url/442d282b457ee4315fe0937da53b9ac3c0a4fffe.txt');
	});
});