process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var fs = require('fs');
var config = require('config');
var http = require('http');

var AdminServer = require("./../../../admin/AdminServer");
var adminServer = new AdminServer();

describe('Mocks API functional test:', function () {

	beforeEach('clear log file and start admin server', function () {
		try {
			fs.accessSync(config.get('logging').get('forwaredRequests').get('file'));
			fs.unlink(config.get('logging').get('forwaredRequests').get('file'));
		} catch (e) {
			// do nothing, file does not exist
		}

		adminServer.start();
	});

	afterEach('stop admin server', function() {
		adminServer.stop();
	});

	it('should deliver a list of mocks', function (done) {
		var url = 'http://localhost:' + config.get("admin").get("port") + '/api/mocks';
		http.get(url, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expected = JSON.parse(fs.readFileSync('test/fixtures/admin/mockList.json', 'utf8'));
				expect(body).to.equal(expected);

				done();
			});
		});
	});

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