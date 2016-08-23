process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var Mock = require('./../../../../../app/domain/models/Mock');
var path = require('path');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

describe('Mock', function() {
	describe('#readFromFile', function() {
		it('should read a file and create a mock object', function() {
			var mock = new Mock();
			mock.setFileName(path.resolve(availableFolder + '/path/to/getmock.json'));
			mock.readFromFile();

			expect(mock.id).to.equal('2');
			expect(mock.name).to.equal('a GET mock');
			expect(mock.description).to.equal('a GET mock for testing');
			expect(mock.requestUri).to.equal('/a/path/?param=1');
			expect(mock.requestMethod).to.equal('GET');
			expect(mock.requestBody).to.be.empty;
			expect(mock.responseBody).to.equal('{foo:baz}');
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