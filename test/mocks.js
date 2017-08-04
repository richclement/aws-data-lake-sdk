'use strict';

const EventEmitter = require('events');

module.exports = {
  mockErrorHttp: () => {
    return {
      request: function (url, callback) {
        var out = new EventEmitter();
        out.write = function (data) { };
        out.end = function () { };

        var res = new EventEmitter();
        res.statusCode = 500;
        res.headers = {
          'content-type': 'application/json'
        };
        
        setTimeout(() => {
          callback(res);
        }, 10);

        setTimeout(() => {
          out.emit('error', new Error('mock'));
        }, 40);

        return out;
      }
    };
  },
  mockSuccessfulHttp: (dataToReturn) => {
    return {
      request: function (options, callback) {
        var out = new EventEmitter();
        out.write = function (data) { };
        out.end = function () { };

        var res = new EventEmitter();
        res.statusCode = 200;
        res.headers = {
          'content-type': 'application/json'
        };

        setTimeout(() => {
          callback(res);
        }, 20);

        setTimeout(() => {
          res.emit('data', dataToReturn);
          res.emit('end');
        }, 30);

        return out;
      }
    };
  }
};