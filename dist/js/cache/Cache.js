"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cache = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Cache
 * @extends CoreObject
 * @abstract
 */
var Cache = function (_CoreObject) {
    _inherits(Cache, _CoreObject);

    //region constructor
    function Cache(options) {
        _classCallCheck(this, Cache);

        var _this = _possibleConstructorReturn(this, (Cache.__proto__ || Object.getPrototypeOf(Cache)).call(this, options));

        _Preconditions2.default.shouldBeAbstract(_this, Cache);
        return _this;
    }

    //endregion

    //region getters/setters
    /**
     * @readonly
     * @property
     * @return {Promise}
     */


    /**
     * @protected
     * @type {Promise}
     */


    _createClass(Cache, [{
        key: "read",


        //endregion

        /**
         * @abstract
         * @param {String|URI} path
         * @return {Promise}
         */
        value: function read(path) {
            var scope = this;

            return _bluebird2.default.resolve().then(function () {
                return scope.startedLatch;
            }).then(function () {
                return _Utility2.default.getPath(path);
            });
        }
    }, {
        key: "startedLatch",
        get: function get() {
            return this._startedLatch;
        }
    }]);

    return Cache;
}(_CoreObject3.default);

exports.Cache = Cache;
exports.default = Cache;
//# sourceMappingURL=Cache.js.map