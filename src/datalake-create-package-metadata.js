'use strict';

let program = require('commander');
let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');

class CreatePackageMetadata {
    constructor(config) {
        this._config = config;
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
    set(params) {
        if (!params.packageId) { throw new Error('packageId required'); }
        if (!params.metadata) { throw new Error('metadata required'); }

        //get the signed api credentials
        let _creds = new Creds(this._config);
        let _authKey = _creds.getAuthSignature();

        // send api request
        let _apiproxy = new ApiProxy(this._config);
        let _path = ['/prod/packages/', program.packageId, '/metadata/new'].join('');
        let _passedMetadata = [];
        try {
            _passedMetadata = JSON.parse(program.metadata);
        } catch (ex) {
            console.error('Invalid JSON passed for metadata parameter.');
            throw ex;
        }

        let _metadata = {
            metadata: _passedMetadata
        }
        _apiproxy.sendApiRequest(_path, 'POST', JSON.stringify(_metadata), _authKey, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                throw err;
            }

            //console.log(JSON.stringify(data));
            return data;
        });
    }
}

module.exports = CreatePackageMetadata;
