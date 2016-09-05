"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CertificateBundle = exports.Certificate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject3 = require("../CoreObject");

var _CoreObject4 = _interopRequireDefault(_CoreObject3);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _osenv = require("osenv");

var _osenv2 = _interopRequireDefault(_osenv);

var _ = require("./");

var _cache = require("../cache");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 */
var Certificate = function (_CoreObject) {
    _inherits(Certificate, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {String|URI} options.path
     */
    function Certificate(options) {
        _classCallCheck(this, Certificate);

        //region let uri
        /** @type {URI} */
        var uri = _Utility2.default.take(options, 'path', {
            required: true,
            adapter: function adapter(value) {
                return _Utility2.default.getPath(value);
            }
        });
        //endregion

        //region let resourceLoader
        /** @type {ResourceLoader} */
        var resourceLoader = _Utility2.default.take(options, 'resourceLoader', {
            adapter: function adapter(value) {
                if (!value) {
                    var directoryPath = uri.clone().filename('');

                    value = new _.CachedResourceLoader({
                        resourceLoader: new _.FileResourceLoader({
                            path: directoryPath,
                            cache: new _cache.LocalFileCache({
                                path: directoryPath
                            })
                        })
                    });
                }

                return value;
            }
        });
        //endregion

        var _this = _possibleConstructorReturn(this, (Certificate.__proto__ || Object.getPrototypeOf(Certificate)).apply(this, arguments));

        _this._uri = uri;
        _this._path = _this.uri.toString();
        _this._name = _this.uri.filename();
        _this._resourceLoader = resourceLoader;

        //region startedLatch
        var scope = _this;

        _this._startedLatch = new _bluebird2.default(function (resolve, reject) {
            var promise = _bluebird2.default.resolve();

            promise = promise.then(function () {
                return resourceLoader.startedLatch;
            });

            promise = promise.then(function () {
                return _this.open().then(function (value) {
                    scope._value = value;
                });
            });

            resolve(promise);
        });

        _this._startedLatch.finally(function () {
            return scope._started = true;
        });
        //endregion
        return _this;
    }

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {Boolean}
     * @return {Boolean}
     */


    _createClass(Certificate, [{
        key: "open",

        //endregion

        /**
         * @return {Buffer}
         */
        value: function open() {
            var scope = this;

            return this.resourceLoader.load(this.path).then(function (value) {
                scope._value = value;

                return value;
            });
        }
    }, {
        key: "started",
        get: function get() {
            return this._started;
        }
        /**
         * @property
         * @readonly
         * @type {Promise}
         * @return {Promise}
         */

    }, {
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }

        /**
         * @property
         * @readonly
         * @type {ResourceLoader}
         * @return {ResourceLoader}
         */

    }, {
        key: "resourceLoader",
        get: function get() {
            return this._resourceLoader;
        }

        /**
         * @readonly
         * @property
         * @type {URI}
         * @return {URI}
         */

    }, {
        key: "uri",
        get: function get() {
            return this._uri;
        }

        /**
         * @readonly
         * @property
         * @type {String}
         * @return {String}
         */

    }, {
        key: "path",
        get: function get() {
            return this._path;
        }

        /**
         * @readonly
         * @property
         * @type {String}
         * @return {String}
         */

    }, {
        key: "name",
        get: function get() {
            return this._name;
        }

        /**
         * @readonly
         * @property
         * @throws {Error}
         */

    }, {
        key: "value",
        get: function get() {
            _Preconditions2.default.shouldBeTrue(this._started, 'is not started yet');
            _Preconditions2.default.shouldBeTrue(this.startedLatch.isFulfilled(), 'must be started');
            _Preconditions2.default.shouldBeFalsey(this.startedLatch.isCancelled(), 'must be started');
            _Preconditions2.default.shouldBeFalsey(this.startedLatch.isRejected(), 'must not be rejected');
            _Preconditions2.default.shouldBeTrue(this.startedLatch.isResolved(), 'must be resolved');

            return this._value;
        }
    }]);

    return Certificate;
}(_CoreObject4.default);

/**
 * System for bundling 3 keys together (key, cert, and ca)
 *
 * @class
 */


var CertificateBundle = function (_CoreObject2) {
    _inherits(CertificateBundle, _CoreObject2);

    /**
     *
     * @param {Object} options
     * @param {Certificate} options.certificate
     * @param {Certificate} options.key
     * @param {Certificate} options.authority
     */
    function CertificateBundle(options) {
        _classCallCheck(this, CertificateBundle);

        function adapter(value) {
            if (_Utility2.default.isString(value) || value instanceof _urijs2.default) {
                return new Certificate({ path: value });
            }

            return value;
        }

        /** @type {Certificate} */
        var certificate = _Utility2.default.take(options, 'certificate', {
            required: true,
            adapter: adapter
        });

        /** @type {Certificate} */
        var key = _Utility2.default.take(options, 'key', {
            required: true,
            adapter: adapter
        });

        /** @type {Certificate} */
        var authority = _Utility2.default.take(options, 'authority', {
            required: true,
            adapter: adapter
        });

        var _this2 = _possibleConstructorReturn(this, (CertificateBundle.__proto__ || Object.getPrototypeOf(CertificateBundle)).call(this, options));

        _this2._authority = authority;
        _this2._key = key;
        _this2._certificate = certificate;

        //region startedLatch
        _this2._startedLatch = new _bluebird2.default(function (resolve, reject) {
            var promise = _bluebird2.default.resolve();

            if (authority) {
                promise = promise.then(function () {
                    return authority.open();
                });
            }
            if (key) {
                promise = promise.then(function () {
                    return key.open();
                });
            }

            if (certificate) {
                promise = promise.then(function () {
                    return certificate.open();
                });
            }

            resolve(promise);
        });
        //endregion
        return _this2;
    }

    //region getters/setters


    _createClass(CertificateBundle, [{
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }

        /**
         * @readonly
         * @property
         * @type {Certificate}
         * @return {Certificate}
         */

    }, {
        key: "certificate",
        get: function get() {
            return this._certificate;
        }

        /**
         * @readonly
         * @property
         * @type {Certificate}
         * @return {Certificate}
         */

    }, {
        key: "key",
        get: function get() {
            return this._key;
        }

        /**
         * @readonly
         * @property
         * @type {Certificate}
         * @return {Certificate}
         */

    }, {
        key: "authority",
        get: function get() {
            return this._authority;
        }
        //endregion

        /**
         * coinme-node-key.pem
         * coinme-node-cert.pem
         * coinme-wallet-ca-cert.pem
         *
         * @param {String} path example ~/.coinme-node
         * @return {CertificateBundle}
         */

    }], [{
        key: "fromFolder",
        value: function fromFolder(path) {
            var uri = (0, _urijs2.default)(_Utility2.default.getPath(path).toString() + '/'); // fixes the bug when the folder has a leading dot.

            return new CertificateBundle({
                key: uri.filename('coinme-node-key.pem').clone(),
                certificate: uri.filename('coinme-node-cert.pem').clone(),
                authority: uri.filename('coinme-wallet-ca-cert.pem').clone()
            });
        }
    }, {
        key: "fromHome",
        value: function fromHome() {
            return CertificateBundle.fromFolder('~/.coinme-node');
        }
    }]);

    return CertificateBundle;
}(_CoreObject4.default);

exports.Certificate = Certificate;
exports.CertificateBundle = CertificateBundle;
exports.default = CertificateBundle;
//# sourceMappingURL=CertificateBundle.js.map