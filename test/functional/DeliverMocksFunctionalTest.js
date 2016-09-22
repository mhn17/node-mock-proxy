var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var http = require('http');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

require("./../../app");
var MockLUT = require('services/MockLUT');

describe('Deliver mock functional test:', function () {

	beforeEach('before each', function () {
		// remove log file
		try {
			fs.accessSync(config.get('logging').get('forwaredRequests').get('file'));
			fs.unlinkSync(config.get('logging').get('forwaredRequests').get('file'));
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

		// rebuild cache
		new MockLUT().buildCache();
	});

	afterEach('after each', function() {
		// create sym links for enables mocks
		fs.unlinkSync(path.resolve(enabledFolder + '/path/to/getMock.json'));
		fs.unlinkSync(path.resolve(enabledFolder + '/path/to/postMock.json'));
	});

	after('', function() {
		process.mainModule.mockProxyServer.stop();
		process.mainModule.adminServer.stop();
	});

	it('should deliver a mock for a GET request', function (done) {
		console.log("START GET REQUEST");
		var url = 'http://localhost:' + config.get("proxy").get("port") + '/a/path/?param=1';
		http.get(url, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var expectedContent = JSON.parse(fs.readFileSync('test/fixtures/mocks-enabled/path/to/getMock.json', 'utf8'));
				expect(body).to.equal(expectedContent.response.body);

				done();
			});
		});
	});

	it('should deliver a mock for a POST request', function (done) {
		var req = http.request({
			host: 'localhost',
			path: '/a/path/?param=2',
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
				var expectedContent = JSON.parse(fs.readFileSync('test/fixtures/mocks-enabled/path/to/postMock.json', 'utf8'));
				expect(body).to.equal(expectedContent.response.body);

				done();
			});
		});

		req.write("{param2:lorem}");
		req.end();
	});
});
