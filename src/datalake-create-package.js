'use strict';

let program = require('commander');
let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');

class CreatePackage {
    constructor(config) {
        this._config = config;
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
    create(params) {

        if (!params.packageName) { throw new Error('packageName required'); }
        if (!params.packageDescription) { throw new Error('packageDescription required'); }

        let _payload = {
            package: {
                name: params.packageName,
                description: params.packageDescription
            }
        };

        if (metadata) {
            _payload.metadata = params.metadata;
        }

        //get the signed api credentials
        let _creds = new Creds(this._config);
        let _authKey = _creds.getAuthSignature();

        // send api request
        let _apiproxy = new ApiProxy(this._config);
        _apiproxy.sendApiRequest('/prod/packages/new', 'POST', JSON.stringify(_payload), _authKey, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                throw err;
            }

            //console.log(JSON.stringify(data));
            return data;
        });
    }
}

module.exports = CreatePackage;
