"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LocalFileCache = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _filecache = require("filecache");

var _filecache2 = _interopRequireDefault(_filecache);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _osenv = require("osenv");

var _osenv2 = _interopRequireDefault(_osenv);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _Cache2 = require("./Cache");

var _Cache3 = _interopRequireDefault(_Cache2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class LocalFileCache
 * @extends Cache
 */
var LocalFileCache = function (_Cache) {
    _inherits(LocalFileCache, _Cache);

    //region constructor
    /**
     *
     * @param {Object} options
     * @param {String|URI} [options.path] defaults to tmpdir
     * @param {{watchDirectoryChanges: boolean, watchFileChanges: boolean, hashAlgo: string, gzip: boolean, deflate: boolean, debug: boolean}} [options.config]
     */
    function LocalFileCache(options) {
        _classCallCheck(this, LocalFileCache);

        var path = _Utility2.default.take(options, 'path', {
            adapter: function adapter(value) {
                return (0, _urijs2.default)(value || _osenv2.default.tmpdir() + '/coinme');
            }
        });

        var config = _Utility2.default.take(options, 'config', false);

        var _this = _possibleConstructorReturn(this, (LocalFileCache.__proto__ || Object.getPrototypeOf(LocalFileCache)).call(this, options));

        _this._config = {
            watchDirectoryChanges: true,
            watchFileChanges: false,
            hashAlgo: 'sha1',
            gzip: true,
            deflate: true,
            debug: true
        };


        _this._config = _Utility2.default.defaults(config || {}, _this._config);
        _this._fc = (0, _filecache2.default)(_this.config);
        _this._path = path;
        _this._started = false;

        var fc = _this.fc;
        var scope = _this;

        if (_this.config.watchDirectoryChanges && _this.config.debug) {
            fc.on('change', function (d) {
                scope.logger.debug('! file changed');
                scope.logger.debug('     full path: %s', d.p);
                scope.logger.debug(' relative path: %s', d.k);
                scope.logger.debug('        length: %s bytes', d.length);
                scope.logger.debug('                %s bytes (gzip)', d.gzip.length);
                scope.logger.debug('                %s bytes (deflate)', d.deflate.length);
                scope.logger.debug('     mime-type: %s', d.mime_type);
                scope.logger.debug('         mtime: %s', d.mtime.toUTCString());
            });
        }

        _this._startedLatch = new _bluebird2.default(function (resolve, reject) {
            var cache_dir = scope.path.toString();

            (0, _mkdirp2.default)(cache_dir, function (err) {
                if (err) {
                    return reject(err);
                }

                fc.load(cache_dir, function (err, cache) {
                    if (err) {
                        reject(err);
                    } else {
                        scope._items = cache;

                        resolve();
                    }
                });

                fc.on('ready', function (cache) {
                    scope._items = cache;
                });
            });
        });

        _this.startedLatch.catch(function (err) {
            scope._error = err;
        });

        _this.startedLatch.finally(function () {
            scope._started = true;
        });
        return _this;
    }

    //endregion

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {Promise}
     * @return {Promise}
     */


    _createClass(LocalFileCache, [{
        key: "read",


        //endregion

        /**
         *
         * @param {String|URI} path
         * @return {Promise}
         */
        value: function read(path) {
            /** @type {URI} */
            var base_path = this.path;
            /** @type {winston.Logger} */
            var logger = this.logger;

            var scope = this;

            return _get(LocalFileCache.prototype.__proto__ || Object.getPrototypeOf(LocalFileCache.prototype), "read", this).call(this, path).then(function ( /** @type {URI} */path) {
                if (scope.error) {
                    // an error here means that this cache is fucked.
                    throw scope.error;
                }

                return path;
            }).then(function (path) {
                return _urijs2.default.joinPaths(base_path, path);
            }).then(function ( /** @type {URI} */absolutePath) {
                var pathString = absolutePath.toString().substring(base_path.toString().length);

                if (pathString.startsWith('/')) {
                    pathString = pathString.substring(1);
                }

                return pathString;
            }).then(function ( /** @type {String} */filePath) {
                var items = scope.items;
                var result = items[filePath];

                if (!result) {
                    logger.warn("Not sure why, but " + filePath + " was not found in " + items);
                }

                return result;
            });
        }
    }, {
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }

        /**
         * @property
         * @readonly
         * @type {boolean}
         * @return {boolean}
         */

    }, {
        key: "started",
        get: function get() {
            return this._started;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Error}
         * @return {boolean}
         */

    }, {
        key: "hasError",
        get: function get() {
            return !!this.error;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Error}
         * @return {undefined|Error}
         */

    }, {
        key: "error",
        get: function get() {
            return this._error;
        }

        /**
         * The items in the cache.
         * @readonly
         * @private
         * @type {Object}
         * @return {Object}
         */

    }, {
        key: "items",
        get: function get() {
            return this._items;
        }

        /**
         * @private
         * @property
         * @readonly
         * @type {filecache}
         * @return {filecache}
         */

    }, {
        key: "fc",
        get: function get() {
            return this._fc;
        }

        /**
         * @property
         * @readonly
         * @type {String}
         * @return {{watchDirectoryChanges: boolean, watchFileChanges: boolean, hashAlgo: string, gzip: boolean, deflate: boolean, debug: boolean}}
         */

    }, {
        key: "config",
        get: function get() {
            return this._config;
        }

        /**
         * @property
         * @readonly
         * @type {URI}
         * @return {URI}
         */

    }, {
        key: "path",
        get: function get() {
            return this._path;
        }
    }]);

    return LocalFileCache;
}(_Cache3.default);

exports.LocalFileCache = LocalFileCache;
exports.default = LocalFileCache;
//# sourceMappingURL=LocalFileCache.js.map