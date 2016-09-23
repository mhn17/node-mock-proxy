process.env.NODE_ENV = 'test';

require('app-module-path').addPath(__dirname + '/../../../../../app');

var expect = require('chai').expect;
var Mock = require('domain/models/Mock');
var path = require('path');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

describe('Mock', function() {
	describe('#readFromFile', function() {
		it('should read a file and create a mock object', function() {
			var mock = new Mock();
			mock.setFileName(path.resolve(availableFolder + '/path/to/getMock.json'));
			mock.readFromFile();

			expect(mock.id).to.equal('2');
			expect(mock.name).to.equal('a GET mock');
			expect(mock.description).to.equal('a GET mock for testing');
			expect(mock.request.uri).to.equal('/a/path/?param=1');
			expect(mock.request.method).to.equal('GET');
			expect(mock.request.body).to.be.empty;
			expect(mock.response.body).to.equal('{foo:baz}');
		});

		it('should throw an error when the path is not set', function() {
			var mock = new Mock();
			expect(mock.readFromFile).to.throw(Error);
		});

		it('should throw an error when path is wrong', function() {
			var mock = new Mock();
			mock.setFileName('/path/does/not/exist.json');
			expect(mock.readFromFile).to.throw(Error);
		});
	});
});