process.mainModule.instances = {};

require('app-module-path').addPath(__dirname + '/../../../app');
require('app-module-path').addPath(__dirname + '/../../../admin');

var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var http = require('http');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

var AdminServer = require('AdminServer');
var adminServer = new AdminServer();

describe('Mocks API functional test:', function () {

	beforeEach('set up', function () {
		try {
			fs.unlinkSync(config.get('logging').get('forwaredRequests').get('file'));
		} catch (e) { }

		try {
			fs.unlinkSync(path.resolve(availableFolder + '/anotherMockName.json'));
		} catch (e) { }

		try {
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/getMock.json'));
		} catch (e) { }

		try {
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/postMock.json'));
		} catch (e) { }

		fs.symlinkSync(path.resolve(availableFolder + '/path/to/getMock.json'),
			path.resolve(enabledFolder + '/path/to/getMock.json'));
		fs.symlinkSync(path.resolve(availableFolder + '/path/to/postMock.json'),
			path.resolve(enabledFolder + '/path/to/postMock.json'));

		adminServer.stop();
		adminServer.start();
	});

	afterEach('shutdown server', function() {
		adminServer.stop();
	});

	it('#GET /mocks: should deliver a list of mocks', function (done) {
		var url = 'http://localhost:' + config.get("admin").get("port") + '/api/mocks';
		http.get(url, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expected = JSON.parse(fs.readFileSync('test/fixtures/admin/mockList.json', 'utf8'));
				expect(JSON.parse(body)).to.eql(expected);

				done();
			});
		});
	});

	it('#POST /mocks: should create a new mock', function (done) {
		var options = {
			hostname: 'localhost',
			port: config.get("admin").get("port"),
			path: '/api/mocks',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		var body = JSON.stringify(
			{
				"name": "Another Mock name",
				"description": "Another description",
				"request": {
					"uri": "/path/to/postMock",
					"method": "POST",
					"body": "{foo:baz}"
				},
				"response": {
					"body": "{foo:baz}"
				}
			}
		);

		var request = http.request(options, function(response) {
			expect(response.statusCode).to.eql(200);

			try {
				fs.unlinkSync(path.resolve(availableFolder + '/anotherMockName.json'));
			} catch (e) {
				assert.fail('mock file does not exist', 'mock file exists');
			}

			done();
		});
		request.end(body);
	});

	it('#GET /mocks/{id}: should get a single mock', function(done) {
		var url = 'http://localhost:' + config.get("admin").get("port") + '/api/mocks/2';
		http.get(url, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expected = JSON.parse(fs.readFileSync('test/fixtures/admin/getMock.json', 'utf8'));
				expect(JSON.parse(body)).to.eql(expected);

				done();
			});
		});
	});

	it('#DELETE /mocks/{id}: should delete a mock');

	it('#PUT /mocks/{id}/enable: should enable a mock');

	it('#PUT /mocks/{id}/disable: should disable a mock');

	// it('should deliver a mock for a POST request', function (done) {
	// 	var req = http.request({
	// 		host: 'localhost',
	// 		path: '/path/to/postMock',
	// 		port: config.get("proxy").get("port"),
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	}, function (response) {
	// 		// Continuously update stream with data
	// 		var body = '';
	// 		response.on('data', function (d) {
	// 			body += d;
	// 		});
	// 		response.on('end', function () {
	// 			var expected = fs.readFileSync('test/fixtures/mocks-enabled/path/to/postmock__3118e5e88b135860123e5a86b153ad9fc8e581cf.txt', 'utf8');
	// 			expect(body).to.equal(expected);
	//
	// 			done();
	// 		});
	// 	});
	//
	// 	req.write("{foo: postRequest}");
	// 	req.end();
	// });
});