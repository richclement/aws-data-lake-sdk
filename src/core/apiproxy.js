'use strict';

let https = require('https');

class ApiProxy {
    constructor(config) {
        this._apiEndpointHost = config.apiEndpointHost;
    }

    sendApiRequest(path, method, body, authkey, cb) {
        let _options = this.buildRequestOptionSet(path, method, authkey);
        let request = https.request(_options, function (response) {
            // data is streamed in chunks from the server
            // so we have to handle the "data" event
            let buffer = '',
                data,
                route;

            response.on('data', function (chunk) {
                buffer += chunk;
            });

            response.on('end', function (err) {
                data = JSON.parse(buffer);
                cb(null, data);
            });
        });

        if (body) {
            request.write(body);
        }

        request.end();

        request.on('error', (e) => {
            console.error(e);
            cb(['Error occurred when sending', this._apiEndpointHost, path, 'request.'].join(
                ' '), null);
        });
    }

    buildRequestOptionSet(apipath, apimethod, authkey) {
        let _options = {
            hostname: this._apiEndpointHost,
            port: 443,
            path: apipath,
            method: apimethod,
            headers: {
                Auth: ['ak', authkey].join(':')
            }
        };
        return _options;
    }
}

module.exports = ApiProxy;