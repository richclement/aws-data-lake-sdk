'use strict';

let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');
const path = require('path');
const request = require('request');
const requestPromise = require('request-promise');

class Package {

  constructor(config) {
    if (!config) { throw new Error('config required'); }

    if (!config.https) {
      config.https = require('https');
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
    let _path = ['/prod/packages/', params.packageId, '/datasets/', program.datasetId].join('');
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

  importPackageManifest(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }
    if (!params.fileName) { throw new Error('fileName required'); }
    if (!params.fileSize) { throw new Error('fileSize required'); }
    if (!params.fileStream) { throw new Error('fileStream required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _basename = path.basename(params.fileName);

    let _payload = JSON.stringify({
      name: _basename,
      type: 'manifest',
      content_type: 'application/json'
    });
    let _path = ['/prod/packages/', params.packageId, '/datasets/new'].join('');
    var createPackagePromise = this._apiproxy.sendApiRequest(_path, 'POST', _payload, _authKey);

    createPackagePromise.then((data) => {
      var options = {
        url: data.uploadUrl,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': params.fileSize
        }
      };

      params.fileStream.pipe(request.put(options).on('response', function (response) {
        if (response.statusCode !== 200) {
          console.log('The manifest entry was created, but the file failed to upload.');
          throw new Error('The manifest entry was created, but the file failed to upload.');
        }

        let _datasetPath = ['/prod/packages/', params.packageId, '/datasets/', data.dataset_id].join('');
        return this._apiproxy.sendApiRequest(_datasetPath, 'GET', null, _authKey)
          .then((dataset) => {
            return dataset;
          });
      }));
    });
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

    if (program.packageDescription) {
      _payload.description = params.packageDescription;
    }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/packages/', params.packageId].join('');
    return this._apiproxy.sendApiRequest(_path, 'PUT', JSON.stringify(_payload), _authKey);
  }

}
module.exports = Package;