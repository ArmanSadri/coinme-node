"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CoinmeWalletClient = exports.CoinmeWalletClientConfiguration = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CoreObject3 = require("../CoreObject");

var _CoreObject4 = _interopRequireDefault(_CoreObject3);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _Receipt = require("../data/Receipt");

var _Receipt2 = _interopRequireDefault(_Receipt);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _requestDebug = require("request-debug");

var _requestDebug2 = _interopRequireDefault(_requestDebug);

var _SignTool = require("../data/SignTool");

var _SignTool2 = _interopRequireDefault(_SignTool);

var _nodeUuid = require("node-uuid");

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _Identity = require("../data/Identity");

var _Identity2 = _interopRequireDefault(_Identity);

var _Address = require("../Address");

var _Address2 = _interopRequireDefault(_Address);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _UserExistenceToken = require("../data/UserExistenceToken");

var _UserExistenceToken2 = _interopRequireDefault(_UserExistenceToken);

var _CertificateBundle = require("../data/CertificateBundle");

var _CertificateBundle2 = _interopRequireDefault(_CertificateBundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _requestDebug2.default)(_requestPromise2.default);

var VERSION_REGEXP = /^\/api\/v(?:\d+\.?\d*)+$/;
var METHOD_REGEXP = /(?:POST)|(?:GET)|(?:DELETE)|(?:PUT)/;

/**
 * @param  {Function} resolver The promise resolver function
 * @return {Object} The promise instance
 */
function customPromiseFactory(resolver) {
    return new _bluebird2.default(resolver);
}

//region class CoinmeWalletClientConfiguration
/**
 * Certificates are required!
 *
 * The default value for certificates are found in CertificateBundle.fromHome()
 */

var CoinmeWalletClientConfiguration = function (_CoreObject) {
    _inherits(CoinmeWalletClientConfiguration, _CoreObject);

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
    function CoinmeWalletClientConfiguration(options) {
        _classCallCheck(this, CoinmeWalletClientConfiguration);

        //region let certificate
        /** @type {CertificateBundle} */
        var certificate = _Utility2.default.take(options, 'certificate', {
            type: _CertificateBundle2.default,
            adapter: function adapter(value) {
                if (!value) {
                    return _CertificateBundle2.default.fromHome();
                } else if (_Utility2.default.isString(value)) {
                    return _CertificateBundle2.default.fromFolder(value);
                }

                return value;
            }
        });
        //endregion

        //region let timeout
        var timeout = _Utility2.default.take(options, 'timeout', {
            type: 'number',
            defaultValue: 30000
        });
        //endregion

        //region let baseUrl
        /** @type {URI} */
        var baseUrl = _Utility2.default.take(options, 'baseUrl', {
            required: false,
            defaultValue: (0, _urijs2.default)('https://www.coinmewallet.com/'),
            // adapter goes first.
            adapter: function adapter(value) {
                if (_Utility2.default.isString(value)) {
                    return (0, _urijs2.default)(value);
                }

                return value;
            },
            validator: function validator(uri) {
                _Preconditions2.default.shouldBeInstanceOf(uri, _urijs2.default, "value must be string or URI. (value:" + uri + ") (type:" + _Utility2.default.typeOf(uri) + ")");
                _Preconditions2.default.shouldBeTrue(uri.is('absolute'), 'uri must be absolute');

                return true;
            }
        });
        //endregion

        //region let version
        var version = _Utility2.default.take(options, 'version', {
            type: 'string',
            defaultValue: '/api/v1',
            required: false,
            validator: function validator(value) {
                _Preconditions2.default.shouldBeString(value, 'version must be a string');
                _Preconditions2.default.shouldMatchRegexp(value, VERSION_REGEXP, "version must match pattern: " + VERSION_REGEXP + ". Was " + value);

                return true;
            }
        });
        //endregion

        //region let sessionId
        var sessionId = _Utility2.default.take(options, 'sessionId', 'string', false);
        //endregion

        //region let identity
        var identity = _Utility2.default.take(options, 'identity', {
            defaultValue: new _Identity2.default('library:/coinme-node'),
            adapter: function adapter(value) {
                if (_Utility2.default.isString(value)) {
                    return new _Identity2.default(value);
                } else if (_Address2.default.isInstance(value)) {
                    return new _Identity2.default(value);
                } else {
                    return value;
                }
            },
            validator: function validator(value) {
                _Preconditions2.default.shouldBeInstance(value, _Identity2.default, "identity " + JSON.stringify(value));
            }
        });
        //endregion

        //region let signTool
        var signTool = _Utility2.default.take(options, 'signTool', {
            type: _SignTool2.default,
            defaultValue: new _SignTool2.default({
                secret: identity.toString(),
                issuer: identity.toString()
            })
        });
        //endregion

        var _this = _possibleConstructorReturn(this, (CoinmeWalletClientConfiguration.__proto__ || Object.getPrototypeOf(CoinmeWalletClientConfiguration)).apply(this, arguments));

        _this._identity = identity;
        _this._sessionId = sessionId;
        _this._baseUrl = baseUrl;
        _this._version = version;
        _this._signTool = signTool;
        _this._certificate = certificate;

        _this._startedLatch = new _bluebird2.default(function (resolve, reject) {
            var promise = _bluebird2.default.resolve();

            promise = promise.then(function () {
                return certificate.startedLatch;
            });

            resolve(promise);
        });
        return _this;
    }

    //endregion

    //region properties
    /**
     * @return {Promise}
     */


    _createClass(CoinmeWalletClientConfiguration, [{
        key: "toJson",


        //endregion

        value: function toJson() {
            return _get(CoinmeWalletClientConfiguration.prototype.__proto__ || Object.getPrototypeOf(CoinmeWalletClientConfiguration.prototype), "toJson", this).call(this, {
                identity: _Utility2.default.optJson(this.identity.toJson()),
                signTool: _Utility2.default.optJson(this.signTool),
                sessionId: this.sessionId,
                version: this.version,
                baseUrl: _Utility2.default.optString(this.baseUrl)
            });
        }

        /**
         *
         * @param {String} sessionId
         * @return {CoinmeWalletClientConfiguration}
         */

    }, {
        key: "withSessionId",
        value: function withSessionId(sessionId) {
            _Preconditions2.default.shouldBeString(sessionId, 'sessionId');

            return new CoinmeWalletClientConfiguration(this.clone({
                sessionId: sessionId
            }));
        }

        /**
         *
         * @param {Object} overrides
         * @return {CoinmeWalletClientConfiguration}
         */

    }, {
        key: "clone",
        value: function clone(overrides) {
            return new CoinmeWalletClientConfiguration(_lodash2.default.assign({}, this, overrides));
        }
    }, {
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }

        /**
         * @readonly
         * @property
         * @type {CertificateBundle}
         * @return {CertificateBundle}
         */

    }, {
        key: "certificate",
        get: function get() {
            return this._certificate;
        }

        /**
         *
         * @readonly
         * @property
         * @type {Identity}
         * @return {Identity}
         */

    }, {
        key: "identity",
        get: function get() {
            return this._identity;
        }

        /**
         * @readonly
         * @property
         * @type {String|undefined}
         * @return {String|undefined}
         */

    }, {
        key: "sessionId",
        get: function get() {
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

    }, {
        key: "version",
        get: function get() {
            return this._version;
        }

        /**
         * @property
         * @readonly
         * @type {Number}
         * @return {Number}
         */

    }, {
        key: "timeout",
        get: function get() {
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

    }, {
        key: "baseUrl",
        get: function get() {
            return this._baseUrl;
        }

        /**
         * @property
         * @readonly
         * @type {SignTool}
         * @return {SignTool}
         */

    }, {
        key: "signTool",
        get: function get() {
            return this._signTool;
        }
    }]);

    return CoinmeWalletClientConfiguration;
}(_CoreObject4.default);
//endregion

//region class CoinmeWalletClient
/**
 *
 */


var CoinmeWalletClient = function (_CoreObject2) {
    _inherits(CoinmeWalletClient, _CoreObject2);

    //region constructor
    /**
     *
     * @param {Object} options
     * @param {CoinmeWalletClientConfiguration} options.configuration
     */
    function CoinmeWalletClient(options) {
        _classCallCheck(this, CoinmeWalletClient);

        /** @type {CoinmeWalletClientConfiguration} */
        var configuration = _Utility2.default.take(options, 'configuration', CoinmeWalletClientConfiguration, true);

        var _this2 = _possibleConstructorReturn(this, (CoinmeWalletClient.__proto__ || Object.getPrototypeOf(CoinmeWalletClient)).apply(this, arguments));

        _this2._configuration = configuration;

        _this2._startedLatch = new _bluebird2.default(function (resolve, reject) {
            var promise = _bluebird2.default.resolve();

            promise = promise.then(function () {
                return configuration.startedLatch;
            });

            resolve(promise);
        });
        return _this2;
    }

    //endregion

    //region properties
    /**
     * @property
     * @readonly
     * @type {Promise}
     * @return {Promise}
     */


    _createClass(CoinmeWalletClient, [{
        key: "withSession",


        //endregion

        /**
         * Creates a brand new copy/clone of this client with a sessionId attached.
         *
         * @param {String} sessionId
         * @return {CoinmeWalletClient}
         */
        value: function withSession(sessionId) {
            return new CoinmeWalletClient({
                configuration: this.configuration.withSessionId(sessionId)
            });
        }

        /**
         *
         * @param {Receipt} receipt
         * @return {Promise}
         */

    }, {
        key: "notifyReceipt",
        value: function notifyReceipt(receipt) {
            var json = receipt.toJson();

            return this._execute({
                uri: '/receipt',
                method: 'POST',
                data: json
            });
        }

        /**
         *
         * @param {String} username
         * @return {Promise<UserExistenceToken>|Promise}
         */

    }, {
        key: "peek",
        value: function peek(username) {
            _Preconditions2.default.shouldNotBeBlank(username, 'username');

            return this._execute({
                uri: '/user/peek',
                method: 'GET',
                data: {
                    username: username
                },

                type: _UserExistenceToken2.default
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

    }, {
        key: "_execute",
        value: function _execute(options) {
            var _this3 = this;

            var scope = this;

            return _bluebird2.default.resolve().then(function () {
                return _this3.startedLatch;
            }).then(function () {
                var configuration = scope.configuration;

                /**
                 * @type {String}
                 */
                var method = _Preconditions2.default.shouldMatchRegexp(options.method, METHOD_REGEXP, 'Must be GET|POST|PUT|DELETE');

                /**
                 * @type {URI}
                 */
                var uri = scope._getUrl(options.uri);

                /**
                 * @type {Object}
                 */
                var data = options.data || {};

                data.transactionId = _nodeUuid2.default.v1();
                data.timestamp = new Date().getTime();
                data.signature = scope._sign(uri.path(), data);

                var request_args = {
                    url: uri.toString(),
                    method: method,
                    json: true,

                    httpSignature: {
                        keyId: configuration.certificate.key.name,
                        key: configuration.certificate.key.value
                    },
                    timeout: scope.configuration.timeout,
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
                    request_args.data = data;
                }

                return (0, _requestPromise2.default)(request_args, function (err, res, body) {
                    // console.log('REQUEST RESULTS:', err, res.statusCode, body);
                }).then(function (result) {
                    if (options.adapter) {
                        return options.adapter.call(scope, result);
                    } else if (options.type) {
                        return new options.type(result);
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

    }, {
        key: "_sign",
        value: function _sign(relativeUri, parameters) {
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

    }, {
        key: "_getUrl",
        value: function _getUrl(stringOrUri) {
            /** @type {URI} */
            var uri = (0, _urijs2.default)(stringOrUri);
            /** @type {CoinmeWalletClientConfiguration} */
            var configuration = this.configuration;
            var baseUrl = configuration.baseUrl;
            var version = configuration.version;

            _Preconditions2.default.shouldBeTrue(uri.is('relative'), "Must be relative. Was " + stringOrUri);

            return _urijs2.default.joinPaths(baseUrl, version, uri).absoluteTo(baseUrl);
        }
    }, {
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }

        /**
         * @property
         * @readonly
         * @return {CoinmeWalletClientConfiguration}
         */

    }, {
        key: "configuration",
        get: function get() {
            return this._configuration;
        }
    }]);

    return CoinmeWalletClient;
}(_CoreObject4.default);
//endregion

exports.CoinmeWalletClientConfiguration = CoinmeWalletClientConfiguration;
exports.CoinmeWalletClient = CoinmeWalletClient;
exports.default = CoinmeWalletClient;
//# sourceMappingURL=CoinmeWalletClient.js.map