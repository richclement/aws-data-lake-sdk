'use strict';

let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');

class Metadata {
  constructor(config) {
    if (!config) { throw new Error('config required'); }
    if (!config.accessKey) { throw new Error('accessKey required'); }
    if (!config.secretAccessKey) { throw new Error('secretAccessKey required'); }
    if (!config.apiEndpointHost) { throw new Error('apiEndpointHost required'); }

    if (!config.https) {
      config.https = require('https');
    }

    this._config = config;
    this._creds = new Creds(this._config);
    this._apiproxy = new ApiProxy(this._config);
  }

  /**
   * packageId - The package identifier
   * metadata - List of metadata to assign to the package
   *
   * var params = {
   *   packageId: 'ABC123',
   *   metadata: [
   *       { 
   *           tag: 'my-tag-1',
   *           value: 'my-tag-value'
   *       },
   *       { 
   *           tag: 'my-tag-2',
   *           value: 'my-tag-value'
   *       },
   *   ]
   * }
   **/
  createMetadata(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }
    if (!params.metadata) { throw new Error('metadata required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId, '/metadata/new'].join('');
    let _passedMetadata = [];
    try {
      _passedMetadata = params.metadata;
    } catch (ex) {
      console.error('Invalid JSON passed for metadata parameter.');
      throw ex;
    }

    let _metadata = {
      metadata: _passedMetadata
    }
    return this._apiproxy.sendApiRequest(_path, 'POST', JSON.stringify(_metadata), _authKey);
  }

  /**
   * packageId - The package identifier
   *
   * var params = {
   *   packageId: 'ABC123'
   * }
   **/
  describeMetadata(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId, '/metadata'].join('');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * Retrieve the required metadata tags from the data lake.
   */
  describeRequiredMetadata() {
    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _payload = JSON.stringify({
      operation: 'required_metadata'
    });
    return this._apiproxy.sendApiRequest('/prod/packages', 'POST', _payload, _authKey);
  }
}

module.exports = Metadata;