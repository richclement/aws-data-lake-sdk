'use strict';

let program = require('commander');
let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');

class Search {
    constructor(config) {
        if (!config) { throw new Error('config required.'); }
        if (!config.accessKey) { throw new Error('Data lake access key is required.'); }
        if (!config.secretAccessKey) { throw new Error('Data lake secret access key is required.'); }
        if (!config.apiEndpointHost) { throw new Error('Data lake API endpoint host is required.'); }
        
        this._config = config;
    }

    /**
    * terms - search terms
    *
    * var params = {
    *   terms: 'the search terms'
    * }
    **/
    get(params) {
        //get the signed api credentials
        let _creds = new Creds(this._config);
        let _authKey = _creds.getAuthSignature();

        let _terms = params.terms.replace(/ /g, '+')

        // send api request
        let _apiproxy = new ApiProxy(this._config);
        let _path = ['/prod/search?term', _terms].join('=');
        _apiproxy.sendApiRequest(_path, 'GET', null, _authKey, (err, data) => {
            if (err) {
                console.log(JSON.stringify(err));
                throw err;
            }

            console.log(JSON.stringify(data));
            return data;
        });
    }
}

module.exports = Search;
