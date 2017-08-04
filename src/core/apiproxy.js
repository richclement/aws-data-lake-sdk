'use strict';

class ApiProxy {
    constructor(config) {
        this._https = config.https;
        this._apiEndpointHost = config.apiEndpointHost;
    }

    sendApiRequest(path, method, body, authkey) {
        return new Promise(
            (resolve, reject) => {
                var _options = this.buildRequestOptionSet(path, method, authkey);
                var request = this._https.request(_options, (response) => {
                    // data is streamed in chunks from the server
                    // so we have to handle the "data" event
                    var buffer = '',
                        data,
                        route;

                    response.on('data', (chunk) => {
                        buffer += chunk;
                    });

                    response.on('end', (err) => {
                        data = JSON.parse(buffer);
                        //console.log(JSON.stringify(data));
                        //cb(null, data);
                        resolve(data);
                    });
                });

                if (body) {
                    request.write(body);
                }

                request.end();

                request.on('error', (e) => {
                    //cb(['Error occurred when sending', this._apiEndpointHost, path, 'request.'].join(' '), null);
                    reject(['Error occurred when sending', this._apiEndpointHost, path, 'request.'].join(' '));
                });
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