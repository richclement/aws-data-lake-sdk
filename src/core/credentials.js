'use strict';

let Base64 = require('js-base64').Base64;
let moment = require('moment');
let crypto = require('crypto');

class Credentials {
    constructor(config) {
        this._accessKey = config.accessKey;
        this._secretAccessKey = config.secretAccessKey;
        this._apiEndpointHost = config.apiEndpointHost;
    }

    getAuthSignature() {

        // 'SJxiAV_R:f10e347df150638393502dfc8466d18b'
        let kDate = crypto.createHmac('sha256', "DATALAKE4" + this._secretAccessKey)
            .update(moment().utc().format('YYYYMMDD'));

        let kEndpoint = crypto.createHmac('sha256', kDate.digest('base64')).update(this._apiEndpointHost);

        let kService = crypto.createHmac('sha256', kEndpoint.digest('base64')).update('datalake');

        let kSigning = crypto.createHmac('sha256', kService.digest('base64')).update("datalake4_request");

        let _signature = kSigning.digest('base64');

        let _apiKey = [this._accessKey, _signature].join(':');
        let _authKey = Base64.encode(_apiKey);
        return _authKey;
    }
}

module.exports = Credentials;