"use strict";

import CoreObject from "../CoreObject";
import Promise from "bluebird";
import request from "request-promise";
import Receipt from "../data/Receipt";
import Utility from "../Utility";
import Preconditions from "../Preconditions";
import URI from "urijs";
import request_debug from "request-debug";
import SignTool from "../data/SignTool";
import uuid from "node-uuid";
import Identity from "../data/Identity";
import Address from "../Address";
import Lodash from "lodash";
import UserExistenceToken from "../data/UserExistenceToken";
import CertificateBundle from "../data/CertificateBundle";

request_debug(request);

const VERSION_REGEXP = /^\/api\/v(?:\d+\.?\d*)+$/;
const METHOD_REGEXP = /(?:POST)|(?:GET)|(?:DELETE)|(?:PUT)/;

//region function customPromiseFactory
/**
 * @param  {Function} resolver The promise resolver function
 * @return {Object} The promise instance
 */
function customPromiseFactory(resolver) {
    return new Promise(resolver);
}
//endregion

//region class CoinmeWalletClientConfiguration
/**
 * Certificates are required!
 *
 * The default value for certificates are found in CertificateBundle.fromHome()
 */
class CoinmeWalletClientConfiguration extends CoreObject {

    //region constructor
    /**
     *
     * @param {CoinmeWalletClientConfiguration|Object} [options]
     * @param {CertificateBundle} [options.certificate]
     * @param {String|URI} [options.baseUrl] defaults to https://www.coinmewallet.com
     * @param {String} [options.version] defaults to /api/v1
     * @param {SignTool} [options.signTool] defaults to null
     * @param {String|Address|Identity} [options.identity] defaults to null
     */
    constructor(options) {
        //region let certificate
        /** @type {CertificateBundle} */
        let certificate = Utility.take(options, 'certificate', {
            type: CertificateBundle,
            adapter: function (value) {
                if (!value) {
                    return CertificateBundle.fromHome();
                } else if (Utility.isString(value)) {
                    return CertificateBundle.fromFolder(value);
                }

                return value;
            }
        });
        //endregion

        //region let timeout
        let timeout = Utility.take(options, 'timeout', {
            type: 'number',
            defaultValue: 30000
        });
        //endregion

        //region let baseUrl
        /** @type {URI} */
        let baseUrl = Utility.take(options, 'baseUrl', {
            required: false,
            defaultValue: URI('https://www.coinmewallet.com/'),
            // adapter goes first.
            adapter: function (value) {
                if (Utility.isString(value)) {
                    return URI(value);
                }

                return value;
            },
            validator: function (uri) {
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
            validator: function (value) {
                Preconditions.shouldBeString(value, 'version must be a string');
                Preconditions.shouldMatchRegexp(value, VERSION_REGEXP, `version must match pattern: ${VERSION_REGEXP}. Was ${value}`);

                return true;
            }
        });
        //endregion

        //region let sessionId
        let sessionId = Utility.take(options, 'sessionId', 'string', false);
        //endregion

        //region let identity
        let identity = Utility.take(options, 'identity', {
            defaultValue: new Identity('library:/coinme-node'),
            adapter(value) {
                if (Utility.isString(value)) {
                    return new Identity(value);
                } else if (Address.isInstance(value)) {
                    return new Identity(value);
                } else {
                    return value;
                }
            },
            validator(value) {
                Preconditions.shouldBeInstance(value, Identity, `identity ${JSON.stringify(value)}`);
            }
        });
        //endregion

        //region let signTool
        let signTool = Utility.take(options, 'signTool', {
            type: SignTool,
            defaultValue: new SignTool({
                secret: identity.toString(),
                issuer: identity.toString()
            })
        });
        //endregion

        super(...arguments);

        this._identity = identity;
        this._sessionId = sessionId;
        this._baseUrl = baseUrl;
        this._version = version;
        this._signTool = signTool;
        this._certificate = certificate;

        this._startedLatch = new Promise((resolve, reject) => {
            let promise = Promise.resolve();

            promise = promise.then(() => certificate.startedLatch);

            resolve(promise);
        });
    }

    //endregion

    //region properties
    /**
     * @return {Promise}
     */
    get startedLatch() {
        return this._startedLatch;
    }

    /**
     * @readonly
     * @property
     * @type {CertificateBundle}
     * @return {CertificateBundle}
     */
    get certificate() {
        return this._certificate;
    }

    /**
     *
     * @readonly
     * @property
     * @type {Identity}
     * @return {Identity}
     */
    get identity() {
        return this._identity;
    }


    /**
     * @readonly
     * @property
     * @type {String|undefined}
     * @return {String|undefined}
     */
    get sessionId() {
        return this._sessionId;
    }

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
     * @property
     * @readonly
     * @type {Number}
     * @return {Number}
     */
    get timeout() {
        return this._timeout;
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

    toJson() {
        return super.toJson({
            version: this.version,
            identity: Utility.optJson(this.identity.toJson()),
            signTool: Utility.optJson(this.signTool),
            sessionId: this.sessionId,
            baseUrl: Utility.optString(this.baseUrl)
        });
    }

    /**
     *
     * @param {String} sessionId
     * @return {CoinmeWalletClientConfiguration}
     */
    withSessionId(sessionId) {
        Preconditions.shouldBeString(sessionId, 'sessionId');

        return new CoinmeWalletClientConfiguration(this.clone({
            sessionId: sessionId
        }));
    }

    /**
     *
     * @param {Object} overrides
     * @return {CoinmeWalletClientConfiguration}
     */
    clone(overrides) {
        return new CoinmeWalletClientConfiguration(Lodash.assign({}, this, overrides));
    }
}
//endregion

//region class CoinmeWalletClient
/**
 *
 */
class CoinmeWalletClient extends CoreObject {

    //region constructor
    /**
     *
     * @param {Object} options
     * @param {CoinmeWalletClientConfiguration} options.configuration
     */
    constructor(options) {
        /** @type {CoinmeWalletClientConfiguration} */
        let configuration = Utility.take(options, 'configuration', CoinmeWalletClientConfiguration, true);

        super(...arguments);

        this._configuration = configuration;

        this._startedLatch = new Promise((resolve, reject) => {
            let promise = Promise.resolve();

            promise = promise.then(() => configuration.startedLatch);

            resolve(promise);
        });
    }

    //endregion

    //region properties
    /**
     * @property
     * @readonly
     * @type {Promise}
     * @return {Promise}
     */
    get startedLatch() {
        return this._startedLatch;
    }

    /**
     * @property
     * @readonly
     * @return {CoinmeWalletClientConfiguration}
     */
    get configuration() {
        return this._configuration;
    }

    //endregion

    /**
     * Creates a brand new copy/clone of this client with a sessionId attached.
     *
     * @param {String} sessionId
     * @return {CoinmeWalletClient}
     */
    withSession(sessionId) {
        return new CoinmeWalletClient({
            configuration: this.configuration.withSessionId(sessionId)
        });
    }

    /**
     *
     * @param {Receipt} receipt
     * @return {Promise}
     */
    notifyReceipt(receipt) {
        return this._execute({
            uri: '/receipt',
            method: 'POST',
            data: receipt.toJson()
        });
    }

    /**
     *
     * @param {String} username
     * @return {Promise.<UserExistenceToken>|Promise}
     */
    peek(username) {
        Preconditions.shouldNotBeBlank(username, 'username');

        return this._execute({
            uri: '/user/peek',
            method: 'GET',
            data: {
                username: username
            },

            type: UserExistenceToken
        });
    }

    /**
     *
     * @private
     *
     * @param {Object} options
     * @param {String|URI} options.uri
     * @param {String} options.method
     * @param {Object} [options.data]
     * @param {Function} [options.adapter]
     * @param {Class} [options.type]
     *
     * @return {Promise}
     */
    _execute(options) {
        var scope = this;

        return Promise.resolve()
            .then(() => this.startedLatch)
            .then(function () {
                let configuration = scope.configuration;

                /**
                 * @type {String}
                 */
                let method = Preconditions.shouldMatchRegexp(options.method, METHOD_REGEXP, 'Must be GET|POST|PUT|DELETE');

                /**
                 * @type {URI}
                 */
                let uri = scope._getUrl(options.uri);

                /**
                 * @type {Object}
                 */
                let data = options.data || {};

                data.transactionId = uuid.v1();
                data.timestamp = (new Date()).getTime();
                data.signature = scope._sign(uri.path(), data);

                let request_args = {
                    url: uri.toString(),

                    method: method,

                    headers: {
                        'X-Transaction-ID': data.transactionId,
                        'X-Timestamp': data.timestamp,
                        'X-Signature': data.signature
                    },

                    // ---

                    json: true,

                    httpSignature: {
                        keyId: configuration.certificate.key.name,
                        key: configuration.certificate.key.value
                    },

                    timeout: scope.configuration.timeout,
                    promiseFactory: customPromiseFactory,
                    fullResponse: true // (default) To resolve the promise with the full response or just the body
                };

                if ('GET' === method && data) {
                    request_args.qs = data;
                } else if ('POST' === method) {
                    request_args.data = data;
                }

                return request(request_args, function (err, res, body) {
                    // console.log('REQUEST RESULTS:', err, res.statusCode, body);
                })
                    .then((result) => {
                        if (options.adapter) {
                            return options.adapter.call(scope, result);
                        } else if (options.type) {
                            return new options.type(result)
                        } else {
                            return result;
                        }
                    });
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

        return URI
            .joinPaths(baseUrl, version, uri)
            .absoluteTo(baseUrl);
    }

}
//endregion

export {CoinmeWalletClientConfiguration};
export {CoinmeWalletClient};
export default CoinmeWalletClient;