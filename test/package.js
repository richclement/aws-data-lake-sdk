'use strict';

const DataLake = require('../src/datalake');
const assert = require('chai').assert;
const moment = require('moment');
const Mocks = require('./mocks');

const testConfig = {
  accessKey: 'BkPHU0gD-',
  secretAccessKey: 'e79515d429314e85ef06b22fe61bb839',
  apiEndpointHost: '52em6ph983.execute-api.us-east-1.amazonaws.com'
};

describe('Package', () => {
  describe('Constructor', () => {
    it('throws on a null config object', () => {
      assert.throws(function () {
        var p = new DataLake.Package(null);
      });
    });
  });

  describe('Search', () => {
    it('should return a promise', () => {

      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.search({ terms: '*' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.search(null);
      });
    });

    it('params must have a non-null terms property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.search({ terms: null });
      });
    });

    it('should reject on error', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _metadata.describeRequiredMetadata()
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

    it('should return results with empty array', () => {

      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({ Items: [] }))
      }, testConfig));

      return _package.search({ terms: 'a search with no results' })
        .then((result) => {
          assert.isNotNull(result, 'returned a null result');
          assert.isArray(result.Items, 'did not return an array of Items');
          assert.equal(result.Items.length, 0, 'returned incorrect number of results');
        }).catch(err => {
          assert.fail('expected success');
        });
    });

    it('should return search results in an array', () => {

      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({
          Items: [
            {
              updated_at: "2017-08-03T19:26:49Z",
              package_id: "HJ1gtebwb",
              created_at: "2017-08-03T19:26:31Z",
              deleted: false,
              owner: "datalake_owner",
              description: "unit test package 1",
              name: "unit test package 1",
              metadata: [
                { value: "pdf", tag: "Format" },
                { value: "unit tests", tag: "Owner" },
                { value: "2017-08-03", tag: "Date" },
                { value: "manual", tag: "DataSourceProcess" },
                { value: "manual", tag: "DataSource" }]
            },
            {
              updated_at: "2017-08-03T19:26:49Z",
              package_id: "HJ1gtebwb",
              created_at: "2017-08-03T19:26:31Z",
              deleted: false,
              owner: "datalake_owner",
              description: "unit test package 2",
              name: "unit test package 2",
              metadata: [
                { value: "pdf", tag: "Format" },
                { value: "unit tests", tag: "Owner" },
                { value: "2017-08-03", tag: "Date" },
                { value: "manual", tag: "DataSourceProcess" },
                { value: "manual", tag: "DataSource" }]
            }
          ]
        }))
      }, testConfig));

      return _package.search({ terms: 'unit test' })
        .then((result) => {
          assert.isNotNull(result, 'returned a null result');
          assert.isArray(result.Items, 'did not return an array of Items');
          assert.equal(result.Items.length, 2, 'returned incorrect number of results');
        }).catch(err => {
          assert.fail('expected success');
        });
    });
  });

  describe('CreatePackage', () => {
    it('returns a promise', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.createPackage({
        packageName: 'unit test package',
        packageDescription: 'unit test package description'
      });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.createPackage(null);
      });
    });

    it('params must have a non-null packageName property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.createPackage({ packageName: null, packageDescription: 'unit test description' });
      });
    });

    it('params must have a non-null packageDescription property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.createPackage({ packageName: 'unit test', packageDescription: null });
      });
    });

    it('should reject on error', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _metadata.describeRequiredMetadata()
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

    it('creates an empty package without metadata', () => {
      let httpResponse = {
        package_id: "ABCD12345",
        created_at: "2017-08-04T11:47:19Z",
        updated_at: "2017-08-04T11:47:19Z",
        deleted: false,
        description: "test package",
        name: "test package",
        owner: "datalake_evestment_com",
      };
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify(httpResponse))
      }, testConfig));

      return _package.createPackage({
        packageName: 'unit test package',
        packageDescription: 'unit test package description'
      }).then((result) => {
        assert.isNotNull(result, 'returned a null result');
        assert.equal(result.name, httpResponse.name);
        assert.equal(result.description, httpResponse.description);
      });
    });

    it('creates an empty package with metadata', () => {
      let httpResponse = {
        package_id: "ABCD12345",
        created_at: "2017-08-04T11:47:19Z",
        updated_at: "2017-08-04T11:47:19Z",
        deleted: false,
        description: "test package",
        name: "test package",
        owner: "datalake_evestment_com",
      };
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify(httpResponse))
      }, testConfig));

      return _package.createPackage({
        packageName: 'unit test package',
        packageDescription: 'unit test package description',
        metadata: [{ tag: 'first-tag', value: 'first-value' }, { tag: 'second-tag', value: 'second-value' }]
      }).then((result) => {
        assert.isNotNull(result, 'returned a null result');
        assert.equal(result.name, httpResponse.name);
        assert.equal(result.description, httpResponse.description);
      });
    });
  });

  describe('DeletePackage', () => {
    it('returns a promise', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.deletePackage({ packageId: 'abcd12345' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.deletePackage(null);
      });
    });

    it('params must have a non-null packageId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.deletePackage({ packageId: null });
      });
    });

    it('should reject on error', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _package.deletePackage({ packageId: 'abcd12345' })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

    it('should return an empty object after delete', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      return _package.deletePackage({ packageId: 'abc123456' })
        .then(data => {
          assert.isNotNull(data, 'returned a null object');
        }).catch(err => {
          assert.fail('should not have thrown');
        });
    });
  });

  describe('describePackage', () => {
    it('returns a promise', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.describePackage({ packageId: 'abcd12345' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.describePackage(null);
      });
    });

    it('params must have a non-null packageId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.describePackage({ packageId: null });
      });
    });

    it('should reject on error', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _package.describePackage({ packageId: 'abcd12345' })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });


  });

  describe('deletePackageDataset', () => {
    it('returns a promise', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.deletePackageDataset({ packageId: 'abcd12345', datasetId: 'xyz098765' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.deletePackageDataset(null);
      });
    });

    it('params must have a non-null packageId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.deletePackageDataset({ packageId: null, datasetId: 'xyz098765' });
      });
    });

    it('params must have a non-null datasetId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.deletePackageDataset({ packageId: 'abcd12345', datasetId: null });;
      });
    });

    it('should reject on error', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _package.deletePackageDataset({ packageId: 'abcd12345', datasetId: 'xyz098765' })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

  });

  describe('describePackageDataset', () => {
    it('returns a promise', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _package.describePackageDataset({ packageId: 'abcd12345', datasetId: 'xyz098765' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.describePackageDataset(null);
      });
    });

    it('params must have a non-null packageId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.describePackageDataset({ packageId: null, datasetId: 'xyz098765' });
      });
    });

    it('params must have a non-null datasetId property', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _package.describePackageDataset({ packageId: 'abcd12345', datasetId: null });
      });
    });

    it('should reject on error', () => {
      var _package = new DataLake.Package(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _package.describePackageDataset({ packageId: 'abcd12345', datasetId: 'xyz098765' })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

  });

  describe('describePackageDatasets', () => { });

  describe('importPackageManifest', () => { });

  describe('updatePackage', () => { });

});