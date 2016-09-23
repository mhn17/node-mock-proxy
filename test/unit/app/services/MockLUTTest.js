require('app-module-path').addPath(__dirname + '/../../../../app');

var expect = require('chai').expect;
var MockLUT = require('services/MockLUT');
var Mock = require('domain/models/Mock');
var fs = require('fs');
var path = require('path');
var config = require('config');
var availableFolder = config.get('mocks').get('availableFolder');
var enabledFolder = config.get('mocks').get('enabledFolder');

describe('MockLUT', function() {

	beforeEach('before each', function() {
		process.mainModule.instances = {};

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

	afterEach('after each', function() {
		// create sym links for enables mocks
		var availableFolder = config.get('mocks').get('availableFolder');
		var enabledFolder = config.get('mocks').get('enabledFolder');
		try {
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/getMock.json'));
			fs.unlinkSync(path.resolve(enabledFolder + '/path/to/postMock.json'));
		} catch (e) {
			// do nothing, sym links do not exist
		}
	});

	describe('#constructor', function() {
		it('should create a singleton', function() {
			expect(process.mainModule.instances.mockLUT).to.be.undefined;

			var mockLUT = new MockLUT();
			expect(process.mainModule.instances.mockLUT).not.to.be.undefined;

			var newMockLUT = new MockLUT();
			expect(newMockLUT).to.be.deep.equal(mockLUT);
		})
	});

	describe('#buildCache', function() {
		it('should add files to the look up table', function() {
			var mockLUT = new MockLUT().buildCache();

			expect(mockLUT.lookUpTable).to.have.all.keys(
				'abcdaddc2988d9829443b3bb1f9ccdbdd44c2ac8',
				'c85607a2a9eabe32ac2f444a50645f5675cad782'
			);

			expect(mockLUT.lookUpTable['abcdaddc2988d9829443b3bb1f9ccdbdd44c2ac8']).to.have.all.keys('fileName', 'id');
			expect(mockLUT.lookUpTable['c85607a2a9eabe32ac2f444a50645f5675cad782']).to.have.all.keys('fileName', 'id');
		});
	});

	describe('#clearCache', function() {
		it('should clear the look up table', function() {
			var mockLUT = new MockLUT().buildCache();

			expect(mockLUT.lookUpTable).to.have.all.keys(
				'abcdaddc2988d9829443b3bb1f9ccdbdd44c2ac8',
				'c85607a2a9eabe32ac2f444a50645f5675cad782'
			);

			mockLUT.clearCache();
			expect(mockLUT.lookUpTable).to.be.empty;
		});
	});

	describe('#getFileNameByHash', function() {
		it('should return the file name', function() {
			var mockLUT = new MockLUT().buildCache();
			var fileName = mockLUT.getFileNameByHash('abcdaddc2988d9829443b3bb1f9ccdbdd44c2ac8');

			expect(fileName).to.have.string(path.resolve(enabledFolder + '/path/to/postMock.json'));
		});

		it('should return null', function() {
			var mockLUT = new MockLUT().buildCache();
			var fileName = mockLUT.getFileNameByHash('123456');

			expect(fileName).to.be.a('null');
		});
	});

	describe('#getMockByHash', function() {
		it('should return the mock', function() {
			var mockLUT = new MockLUT().buildCache();
			var mock = mockLUT.getMockByHash('abcdaddc2988d9829443b3bb1f9ccdbdd44c2ac8');

			expect(mock).to.be.a('Object');
			expect(mock.id).to.equal('3');
			expect(mock.name).to.equal('a POST mock');
			expect(mock.description).to.equal('a POST mock for testing');
			expect(mock.request.uri).to.equal('/a/path/?param=2');
			expect(mock.request.method).to.equal('POST');
			expect(mock.request.body).to.equal('{param2:lorem}');
			expect(mock.response.body).to.equal('{foo:postResponse}');
		});

		it('should return null', function() {
			var mockLUT = new MockLUT().buildCache();
			var fileName = mockLUT.getFileNameByHash('123456');

			expect(fileName).to.be.a('null');
		});
	});
});