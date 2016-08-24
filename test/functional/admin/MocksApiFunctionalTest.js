process.env.NODE_ENV = 'test';

require('app-module-path').addPath(__dirname + '/../../../app');
require('app-module-path').addPath(__dirname + '/../../../admin');

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var http = require('http');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

var AdminServer = require('AdminServer');
var adminServer = new AdminServer().start();

describe('Mocks API functional test:', function () {

	beforeEach('clear log file, create sym links for enabled mocks and start admin server', function () {
		try {
			fs.accessSync(config.get('logging').get('forwaredRequests').get('file'));
			fs.unlink(config.get('logging').get('forwaredRequests').get('file'));
		} catch (e) {
			// do nothing, file does not exist
		}

		// create sym links for enables mocks
		try {
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/getMock.json'));
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/postMock.json'));
		} catch (e) {
			// do nothing, sym links do not exist
		}
		fs.symlinkSync(path.resolve(availableFolder + '/path/to/getMock.json'),
			path.resolve(enabledFolder + '/path/to/getMock.json'));
		fs.symlinkSync(path.resolve(availableFolder + '/path/to/postMock.json'),
			path.resolve(enabledFolder + '/path/to/postMock.json'));
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

	it('#POST /mocks: should create a new mock');

	it('#GET /mocks/{id}: should get a single mock');

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