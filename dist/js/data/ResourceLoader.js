"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResourceLoader = undefined;

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
 * @class ResourceLoader
 * @extends CoreObject
 */
var ResourceLoader = function (_CoreObject) {
    _inherits(ResourceLoader, _CoreObject);

    function ResourceLoader(options) {
        _classCallCheck(this, ResourceLoader);

        var _this = _possibleConstructorReturn(this, (ResourceLoader.__proto__ || Object.getPrototypeOf(ResourceLoader)).call(this, options));

        _Preconditions2.default.shouldBeAbstract(new.target, ResourceLoader);
        return _this;
    }

    /**
     * @abstract
     * @param {String|URI} path
     * @return {Promise|Promise<Buffer>|Promise<String>}
     */


    _createClass(ResourceLoader, [{
        key: "load",
        value: function load(path) {
            return _bluebird2.default.resolve().then(function () {
                return _Utility2.default.getPath(path);
            });
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
    }]);

    return ResourceLoader;
}(_CoreObject3.default);

exports.ResourceLoader = ResourceLoader;
exports.default = ResourceLoader;
//# sourceMappingURL=ResourceLoader.js.map