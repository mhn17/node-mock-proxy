process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var fs = require('fs');
var config = require('config');
var http = require('http');

require("./../../app");

describe('Deliver mock functional test:', function () {

	beforeEach('clear log file', function () {
		try {
			fs.accessSync(config.get('logging').get('file'));
			fs.unlink(config.get('logging').get('file'));
		} catch (e) {
			// do nothing, file does not exist
		}
		
		// start the mock proxy server
	});

	afterEach('remove log file after test', function () {
		try {
			fs.accessSync(config.get('logging').get('file'));
			fs.unlink(config.get('logging').get('file'));
		} catch (e) {
			// do nothing, file does not exist
		}
	});

	it('should deliver a mock for a GET request', function (done) {
		var url = 'http://localhost:' + config.get("proxy").get("port") + '/path/to/getmock';
		http.get(url, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expected = fs.readFileSync('test/fixtures/mocks-enabled/path/to/getmock.txt', 'utf8');
				expect(body).to.equal(expected);
				
				done();
			});
		});
	});
	
	it('should deliver a mock for a POST request', function (done) {
		var req = http.request({
			host: 'localhost',
			path: '/path/to/',
			port: config.get("proxy").get("port"),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expected = fs.readFileSync('test/fixtures/mocks-enabled/path/to/3118e5e88b135860123e5a86b153ad9fc8e581cf.txt', 'utf8');
				expect(body).to.equal(expected);

				done();
			});
		});
		
		req.write("{foo: postRequest}");
		req.end();
	});
});