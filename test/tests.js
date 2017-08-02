var expect = require('chai').expect;
var DataLake = require('../src/datalake');

const testConfig = {
  accessKey: 'Bk09Y8kwZ',
  secretAccessKey: 'f611c78907e47cb0bf17b4b8734e59d8',
  apiEndpointHost: 'o5zor5nk35.execute-api.us-east-1.amazonaws.com'
};

describe('Search', function () {
  describe('constructor', function () {
    it('should throw', function () {
      expect(function () {
        var search = new DataLake.Search();
      }, 'without a config object').to.throw();
    });

    it('should not throw with a config object', function () {
      expect(function () {
        var search = new DataLake.Search(testConfig);
      }, 'with a config object').to.not.throw();
    });
  });

  describe('get', function () {
    it('should return results with * search', function () {
      

      
    });
  });
});

