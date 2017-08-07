'use strict';

const assert = require('chai').assert;
const Mocks = require('./mocks');
const DataLake = require('../lib/datalake');

const testConfig = {
  accessKey: 'my-access-key',
  secretAccessKey: 'my-secret-access-key',
  apiEndpointHost: 'my-api-endpoint'
};

describe('Metadata', () => {
  describe('Constructor', () => {
    it('config required', () => {
      assert.throws(function () {
        new DataLake.Metadata(null);
      });
    });
  });

  describe('createMetadata', () => {
    it('should return a promise', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _metadata.createMetadata({ packageId: 'abc123456', metadata: [{ tag: 'first-tag', value: 'first-value' }] });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _metadata.createMetadata(null);
      });
    });

    it('should reject on error', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _metadata.createMetadata({ packageId: 'abc123456', metadata: [{ tag: 'first-tag', value: 'first-value' }] })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

    it('attaching metadata to a package will return the full list of tags', () => {
      var httpResponse = {
        created_at: '2017-08-04T12:45:04Z',
        created_by: 'datalake_owner',
        metadata_id: 'xyz098765',
        package_id: 'abcd12345',
        metadata: [{ value: 'first-tag', tag: 'first-value' }, { value: 'second-tag', tag: 'second-value' }]

      };
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify(httpResponse))
      }, testConfig));

      return _metadata.createMetadata({ packageId: 'abc123456', metadata: [{ tag: 'first-tag', value: 'first-value' }] })
        .then(data => {
          assert.isNotNull(data);
          assert.equal(data.package_id, httpResponse.package_id);
          assert.isArray(data.metadata, 'metadata should be an array');
          assert.equal(data.metadata.length, 2);
        }).catch(err => {
          assert.fail('expected success');
        });
    });
  });

  describe('describeMetadata', () => {
    it('should return a promise', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _metadata.describeMetadata({ packageId: 'abc123456' });
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
    });

    it('requires a non-null params object', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      assert.throws(function () {
        var s = _metadata.describeMetadata(null);
      });
    });

    it('should reject on error', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockErrorHttp()
      }, testConfig));

      return _metadata.describeMetadata({ packageId: 'abc123456' })
        .then(() => {
          assert.fail('expected rejection');
        }).catch(err => {
          assert.ok(true);
        });
    });

    it('should return a list of tags for a package id', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({
          Count: 1,
          ScannedCount: 1,
          Items: [{
            created_at: "2017-08-03T20:07:37Z",
            created_by: "datalake_owner",
            metadata_id: "xyz098765",
            package_id: "abcd12345",
            metadata: [{ value: "first-tag", tag: "first-value" }, { value: "second-tag", tag: "second-value" }]
          }]
        }))
      }, testConfig));

      return _metadata.describeMetadata({ packageId: 'abcd12345' })
        .then(data => {
          assert.isNotNull(data);
          assert.isArray(data.Items);
          assert.equal(data.Items.length, 1);
          assert.isArray(data.Items[0].metadata);
        }).catch(err => {
          assert.fail('expected success');
        });
    });
  });

  describe('describeRequiredMetadata', () => {
    it('should return a promise', () => {
      var _metadata = new DataLake.Metadata(Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({}))
      }, testConfig));

      var actual = _metadata.describeRequiredMetadata();
      var isPromise = Promise.prototype.isPrototypeOf(actual);
      assert.equal(isPromise, true);
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

    it('should return an object with an empty Items property when there are not tags', () => {
      let config = Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({
          Items: []
        }))
      }, testConfig);

      var _metadata = new DataLake.Metadata(config);
      return _metadata.describeRequiredMetadata()
        .then((data) => {
          assert.isNotNull(data, 'describeRequiredMetadata returned null');
          assert.isArray(data.Items, 'describeRequiredMetadata did not return an array of tags');
          assert.equal(data.Items.length, 0, 'describeRequiredMetadata did not return an empty array of tags');
        }).catch(err => {
          assert.fail('expected success');
        });
    });

    it('should return an object with multipe tags in the Items property', () => {
      let config = Object.assign({
        https: Mocks.mockSuccessfulHttp(JSON.stringify({
          Items: [{
            updated_at: '2017-08-03T15:20:19Z',
            created_at: '2017-08-03T15:20:19Z',
            setting_id: 'ABC123456',
            type: 'governance',
            setting: { tag: 'first-tag', governance: 'Required' }
          }, {
            updated_at: '2017-08-03T15:20:19Z',
            created_at: '2017-08-03T15:20:19Z',
            setting_id: 'ABC123457',
            type: 'governance',
            setting: { tag: 'second-tag', governance: 'Optional' }
          }]
        }))
      }, testConfig);

      var _metadata = new DataLake.Metadata(config);
      return _metadata.describeRequiredMetadata()
        .then((data) => {
          assert.isNotNull(data, 'describeRequiredMetadata returned null');
          assert.isArray(data.Items, 'describeRequiredMetadata did not return an array of tags');
          assert.equal(data.Items.length, 2, 'describeRequiredMetadata did not return an array of tags');
        }).catch(err => {
          assert.fail('expected success');
        });
    });
  });
});
