"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CachedResourceLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _cache = require("../cache");

var _ResourceLoader2 = require("./ResourceLoader");

var _ResourceLoader3 = _interopRequireDefault(_ResourceLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class CachedResourceLoader
 * @extends ResourceLoader
 */
var CachedResourceLoader = function (_ResourceLoader) {
    _inherits(CachedResourceLoader, _ResourceLoader);

    /**
     *
     * @param {Object} options
     * @param {ResourceLoader} options.resourceLoader
     * @param {Cache} [options.cache]
     */
    function CachedResourceLoader(options) {
        _classCallCheck(this, CachedResourceLoader);

        //region let cache
        /** @type {Cache} */
        var cache = _Utility2.default.take(options, 'cache', {
            adapter: function adapter(value) {
                if (!value) {
                    value = new _cache.LocalFileCache();
                }

                return value;
            }
        });
        //endregion

        /** @type {ResourceLoader} */
        var resourceLoader = _Utility2.default.take(options, 'resourceLoader', _ResourceLoader3.default, true);

        var _this = _possibleConstructorReturn(this, (CachedResourceLoader.__proto__ || Object.getPrototypeOf(CachedResourceLoader)).call(this, options));

        _this._loader = resourceLoader;
        _this._cache = cache;

        _this._startedLatch = new Promise(function (resolve, reject) {
            var promise = Promise.resolve();

            promise = promise.then(function () {
                return cache.startedLatch;
            });
            promise = promise.then(function () {
                return resourceLoader.startedLatch;
            });

            resolve(promise);
        });
        return _this;
    }

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {ResourceLoader}
     * @return {ResourceLoader}
     */


    _createClass(CachedResourceLoader, [{
        key: "load",


        //endregion

        value: function load(path) {
            var cache = this.cache;
            var resourceLoader = this.resourceLoader;

            return _get(CachedResourceLoader.prototype.__proto__ || Object.getPrototypeOf(CachedResourceLoader.prototype), "load", this).call(this, path).then(function ( /**@type {URI}*/path) {
                return cache.read(path).then(function (value) {
                    return value || resourceLoader.load(path);
                });
            });
        }
    }, {
        key: "resourceLoader",
        get: function get() {
            return this._loader;
        }

        /**
         * @property
         * @readonly
         * @type {Cache}
         * @return {Cache}
         */

    }, {
        key: "cache",
        get: function get() {
            return this._cache;
        }
    }]);

    return CachedResourceLoader;
}(_ResourceLoader3.default);

exports.CachedResourceLoader = CachedResourceLoader;
exports.default = CachedResourceLoader;
//# sourceMappingURL=CachedResourceLoader.js.map