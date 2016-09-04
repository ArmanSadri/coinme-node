"use strict";

import CoreObject from "../CoreObject";
import Promise from "bluebird";
import retry from "retry";
import request from "request-promise";
import Receipt from "../data/Receipt";
import Utility from "../Utility";
import Preconditions from "../Preconditions";
import URI from "urijs";
import request_debug from "request-debug";
/** @type {SignTool} */
import SignTool from "../data/SignTool";
import uuid from "node-uuid";

request_debug(request);

const VERSION_REGEXP = /^\/api\/v(?:\d+\.?\d*)+$/;
const METHOD_REGEXP = /(?:POST)|(?:GET)|(?:DELETE)|(?:PUT)/;


/**
 * @param  {Function} resolver The promise resolver function
 * @return {Object} The promise instance
 */
function customPromiseFactory(resolver) {
    return new Promise(resolver);
}

//region class CoinmeWalletClientConfiguration
/**
 *
 */
class CoinmeWalletClientConfiguration extends CoreObject {

    //region constructor
    /**
     *
     * @param {Object} [options]
     * @param {String|URI} [options.baseUrl] defaults to https://www.coinmewallet.com
     * @param {String} [options.version] defaults to /api/v1
     * @param {SignTool} [options.signTool] defaults to null
     */
    constructor(options) {
        //region let baseUrl
        let baseUrl = Utility.take(options, 'baseUrl', {
            required: false,
            defaultValue: URI('https://www.coinmewallet.com/'),
            // adapter goes first.
            adapter: function(value) {
                if (Utility.isString(value)) {
                    return URI(value);
                }

                return value;
            },
            validator: function(uri) {
                Preconditions.shouldBeInstanceOf(uri, URI, `value must be string or URI. (value:${uri}) (type:${Utility.typeOf(uri)})`);
                Preconditions.shouldBeTrue(uri.is('absolute'), 'uri must be absolute');

                return true;
            }
        });
        //endregion

        //region let version
        let version = Utility.take(options, 'version', {
            type: 'string',
            defaultValue: '/api/v1',
            required: false,
            validator: function(value) {
                Preconditions.shouldBeString(value, 'version must be a string');
                Preconditions.shouldMatchRegexp(value, VERSION_REGEXP, `version must match pattern: ${VERSION_REGEXP}. Was ${value}`);

                return true;
            }
        });
        //endregion

        let signTool = Utility.take(options, 'signTool', SignTool, false);

        super(...arguments);

        this._baseUrl = baseUrl;
        this._version = version;
        this._identity = identity;
        this._signTool = Utility.defaultObject(signTool, new SignTool({
            secret: 'I do not know'
        }));
    }
    //endregion

    //region properties
    /**
     * Example: /api/v1
     *
     * @property
     * @readonly
     * @type {String}
     * @return {String}
     */
    get version() {
        return this._version;
    }

    /**
     * Example: https://www.coinmewallet.com/
     *
     * @readonly
     * @property
     * @type {URI}
     * @return {URI}
     */
    get baseUrl() {
        return this._baseUrl
    }

    /**
     * @property
     * @readonly
     * @type {SignTool}
     * @return {SignTool}
     */
    get signTool() {
        return this._signTool;
    }
    //endregion
}
//endregion

//region class CoinmeWalletClient
/**
 *
 */
class CoinmeWalletClient  extends CoreObject {

    //region constructor
    /**
     *
     * @param {Object} options
     * @param {CoinmeWalletClientConfiguration} options.configuration
     */
    constructor(options) {
        let configuration = Utility.take(options, 'configuration', CoinmeWalletClientConfiguration, true);

        super(...arguments);

        this._configuration = configuration;
    }
    //endregion

    //region properties
    /**
     *
     * @return {CoinmeWalletClientConfiguration}
     */
    get configuration() {
        return this._configuration;
    }
    //endregion

    /**
     *
     * @param {Receipt} receipt
     * @return {Promise}
     */
    notifyReceipt(receipt) {
        let json = receipt.toJson();
        let uri = this.getUrl('/user/receipt');

        return this._execute({
            uri: uri,
            method: 'GET',
            data: json
        });
    }

    getMyself() {
        return this._execute({
            uri: '/user/me',
            method: 'GET'
        });
    }

    /**
     *
     * @param {String} username
     * @return {Promise}
     */
    peek(username) {
        Preconditions.shouldNotBeBlank(username, 'username');

        return this._execute({
            uri: '/user/peek',
            method: 'GET',
            data: {
                username: username
            }
        })
    }

    /**
     *
     * @private
     *
     * @param {Object} options
     * @param {String|URI} options.uri
     * @param {Object} [options.data]
     * @param {String} options.method
     *
     * @return {Promise}
     */
    _execute(options) {
        let method = Preconditions.shouldMatchRegexp(options.method, METHOD_REGEXP, 'Must be GET|POST|PUT|DELETE');
        /**
         * @type {URI}
         */
        let uri = this._getUrl(options.uri);
        let data = options.data || {};

        data.transactionId = uuid.v1();
        data.timestamp = (new Date()).getTime();
        data.signature = this._sign(uri.path(), data);

        let request_args = {
            url: uri.toString(),
            method: method,
            json:true,

            promiseFactory: customPromiseFactory,
            fullResponse: true, // (default) To resolve the promise with the full response or just the body
            headers: {
                'X-Transaction-ID': data.transactionId,
                'X-Timestamp': data.timestamp,
                'X-Signature': data.signature
            }
        };

        if ('GET' === method && data) {
            request_args.qs = data;
        } else if ('POST' === method) {
            request_args.formData = data;
        }

        return request(request_args, function(err, res, body) {
            console.log('REQUEST RESULTS:', err, res.statusCode, body);
        });
    }

    /**
     *
     * @private
     * @return {undefined|String}
     */
    _sign(relativeUri, parameters) {
        return this.configuration.signTool.write(parameters || {}, {
            issuer: this.configuration.identity.toString(),
            audience: 'coinme-wallet',
            subject: relativeUri.toString()
        });
    }

    /**
     * @param {String|URI} stringOrUri
     * @return {URI}
     * @private
     */
    _getUrl(stringOrUri) {
        /** @type {URI} */
        let uri = URI(stringOrUri);
        /** @type {CoinmeWalletClientConfiguration} */
        let configuration = this.configuration;
        let baseUrl = configuration.baseUrl;
        let version = configuration.version;

        Preconditions.shouldBeTrue(uri.is('relative'), `Must be relative. Was ${stringOrUri}`);

        return URI.joinPaths(baseUrl, version, uri).absoluteTo(baseUrl);
    }

}
//endregion

export {CoinmeWalletClientConfiguration};
export {CoinmeWalletClient};
export default CoinmeWalletClient;