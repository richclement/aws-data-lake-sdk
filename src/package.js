'use strict';

let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');
const path = require('path');

class Package {

  constructor(config) {
    if (!config) { throw new Error('config required'); }
    if (!config.accessKey) { throw new Error('accessKey required'); }
    if (!config.secretAccessKey) { throw new Error('secretAccessKey required'); }
    if (!config.apiEndpointHost) { throw new Error('apiEndpointHost required'); }

    if (!config.https) {
      config.https = require('https');
    }
    if (!config.got) {
      config.got = require('got');
    }

    this._config = config;
    this._creds = new Creds(this._config);
    this._apiproxy = new ApiProxy(this._config);
  }

  /**
   * packageName - Name of the package
   * packageDescription - Description of the package
   * metadata - List of metadata to assign to the package
   *
   * var params = {
   *   packageName: 'Package name',
   *   packageDescription: 'Package description',
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
  createPackage(params) {
    if (!params) { throw new Error('params required.'); }
    if (!params.packageName) { throw new Error('packageName required'); }
    if (!params.packageDescription) { throw new Error('packageDescription required'); }

    let _payload = {
      package: {
        name: params.packageName,
        description: params.packageDescription
      }
    };

    if (params.metadata) {
      _payload.metadata = params.metadata;
    }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    return this._apiproxy.sendApiRequest('/prod/packages/new', 'POST', JSON.stringify(_payload), _authKey);
  }

  /**
   * packageId - The package identifier
   *
   * var params = {
   *   packageId: 'ABC123'
   * }
   **/
  deletePackage(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId].join('');
    return this._apiproxy.sendApiRequest(_path, 'DELETE', null, _authKey);
  }

  /**
   * packageId - The package identifier
   * datasetId - The dataset identifier
   *
   * var params = {
   *   packageId: 'ABC123',
   *   datasetId: 'XYZ987'
   * }
   **/
  deletePackageDataset(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }
    if (!params.datasetId) { throw new Error('datasetId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId, '/datasets/', params.datasetId].join('');
    return this._apiproxy.sendApiRequest(_path, 'DELETE', null, _authKey);
  }

  /**
   * packageId - The package identifier
   *
   * var params = {
   *   packageId: 'ABC123'
   * }
   **/
  describePackage(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId].join('');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * packageId - The package identifier
   * datasetId - The dataset identifier
   *
   * var params = {
   *   packageId: 'ABC123',
   *   datasetId: 'XYZ987'
   * }
   **/
  describePackageDataset(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }
    if (!params.datasetId) { throw new Error('datasetId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId, '/datasets/', params.datasetId].join('');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * packageId - The package identifier
   *
   * var params = {
   *   packageId: 'ABC123',
   *   datasetId: 'XYZ987'
   * }
   **/
  describePackageDatasets(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId, '/datasets'].join('');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
    * terms - search terms
    *
    * var params = {
    *   terms: 'the search terms'
    * }
    **/
  search(params) {
    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    let _terms = params.terms.replace(/ /g, '+')

    // send api request
    let _path = ['/prod/search?term', _terms].join('=');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * packageId - The package identifier
   * packageName - Updated package name
   * packageDescription - Updated package description
   *
   * var params = {
   *   packageId: 'ABC123',
   *   packageName: 'New name',
   *   packageDescription: 'new description'
   * }
   **/
  updatePackage(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    let _payload = {};

    if (params.packageName) {
      _payload.name = params.packageName;
    }

    if (params.packageDescription) {
      _payload.description = params.packageDescription;
    }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId].join('');
    return this._apiproxy.sendApiRequest(_path, 'PUT', JSON.stringify(_payload), _authKey);
  }

  /**
   * packageId - The package identifier
   * fileName - name of file being uploaded
   * fileSize - size of file being uploaded
   * fileStream - stream to the dataset file being uploaded
   * contentType - content type of the dataset file being uploaded
   *
   * var params = {
   *   packageId: 'abcd12345',
   *   fileName: 'newfile.pdf'
   *   fileSize: 1200
   *   fileStream: <STREAM>,
   *   contentType: 'text/html'
   * }
   **/
  uploadPackageDataset(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }
    if (!params.fileName) { throw new Error('fileName required'); }
    if (!params.fileSize) { throw new Error('fileSize required'); }
    if (!params.fileStream) { throw new Error('fileStream required'); }
    if (!params.contentType) { throw new Error('contentType required'); }

    var result = new Promise((resolve, reject) => {
      //get the signed api credentials
      let _authKey = this._creds.getAuthSignature();

      // send api request
      let _basename = path.basename(params.fileName);

      let _payload = JSON.stringify({
        name: _basename,
        type: 'dataset',
        content_type: params.contentType
      });
      let _datasetId = null;
      let _path = ['/prod/packages/', params.packageId, '/datasets/new'].join('');
      this._apiproxy.sendApiRequest(_path, 'POST', _payload, _authKey)
        .then(creationResponse => {
          var options = {
            headers: {
              'Content-Type': params.contentType,
              'Content-Length': params.fileSize
            },
            body: params.fileStream,
            method: 'PUT'
          };
          _datasetId = creationResponse.dataset_id;
          return this._config.got(creationResponse.uploadUrl, options);
        }).then(putResponse => {
          let _datasetPath = ['/prod/packages/', params.packageId, '/datasets/', _datasetId].join('');
          return resolve(this._apiproxy.sendApiRequest(_datasetPath, 'GET', null, _authKey));
        }).catch(err => {
          return reject(err);
        });
    });
    return result;
  }
}

module.exports = Package;