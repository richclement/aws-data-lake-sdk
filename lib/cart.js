'use strict';

let Creds = require('./core/credentials.js');
let ApiProxy = require('./core/apiproxy.js');

class Cart {
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
   *
   * var params = {
   *   packageId: 'ABC123'
   * }
   **/
  addCartItem(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.packageId) { throw new Error('packageId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = '/prod/cart/new';
    let _payload = JSON.stringify({ package_id: params.packageId });
    return this._apiproxy.sendApiRequest(_path, 'POST', _payload, _authKey);
  }

  /**
   * format - The desired format of the cart item URLs ['BUCKET_KEY', 'SIGNED_URL']
   *
   * var params = {
   *   format: 'BUCKET_KEY'
   * }
   **/
  checkoutCart(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.format) { throw new Error('format required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _format = params.format === 'BUCKET_KEY' ? 'bucket-key' : 'signed-url';
    let _path = '/prod/cart/';
    let _payload = JSON.stringify({
      operation: 'checkout',
      format: _format
    });

    return this._apiproxy.sendApiRequest(_path, 'POST', _payload, _authKey);
  }

  /**
   * Describe the cart.
   */
  describeCart() {
    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = '/prod/cart/';
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * cartItemId - The cart item identifier
   *
   * var params = {
   *   cartItemId: 'ABC123'
   * }
   **/
  describeCartItem(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.cartItemId) { throw new Error('cartItemId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/cart/', params.cartItemId].join('');
    return this._apiproxy.sendApiRequest(_path, 'GET', null, _authKey);
  }

  /**
   * cartItemId - The cart item identifier
   *
   * var params = {
   *   cartItemId: 'ABC123'
   * }
   **/
  removeCartItem(params) {
    if (!params) { throw new Error('params required'); }
    if (!params.cartItemId) { throw new Error('cartItemId required'); }

    //get the signed api credentials
    let _authKey = this._creds.getAuthSignature();

    // send api request
    let _path = ['/prod/cart/', params.cartItemId].join('');
    return this._apiproxy.sendApiRequest(_path, 'DELETE', null, _authKey);
  }

}

module.exports = Cart;