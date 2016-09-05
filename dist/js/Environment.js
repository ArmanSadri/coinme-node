"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Environment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Identity = require("data/Identity");

var _Identity2 = _interopRequireDefault(_Identity);

var _nodeSnowflake = require("node-snowflake");

var _nodeSnowflake2 = _interopRequireDefault(_nodeSnowflake);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _CoreObject2 = require("./CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _CertificateBundle = require("./data/CertificateBundle");

var _osenv = require("osenv");

var _osenv2 = _interopRequireDefault(_osenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Environment = function (_CoreObject) {
    _inherits(Environment, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {Identity} options.identity
     * @param {Object} options.configuration
     */
    function Environment(options) {
        _classCallCheck(this, Environment);

        var identity = _Utility2.default.take(options, 'identity', _Identity2.default, true);
        var configuration = _Utility2.default.take(options, 'configuration', false);
        var certificate = _Utility2.default.take(options, 'certificate', {
            required: true,
            adapter: function adapter(value) {
                if (!value) {
                    return _CertificateBundle.CertificateBundle.fromHome();
                }

                return value;
            }
        });

        var _this = _possibleConstructorReturn(this, (Environment.__proto__ || Object.getPrototypeOf(Environment)).call(this, options));

        _this._identity = identity;
        _this._configuration = configuration;
        _this._certificate = certificate;
        return _this;
    }

    /**
     * @returns {{
     *  hostname:String,
     *  user:String,
     *  tmpdir:String,
     *  home: function,
     *  searchPaths: Array,
     *  editor: function,
     *  shell:Object
     * }}
     */


    _createClass(Environment, [{
        key: "runtime",
        get: function get() {
            return {
                hostname: _osenv2.default.host(),
                whoami: _osenv2.default.user(),
                tmpdir: _osenv2.default.tmpdir(),
                home: _osenv2.default.home()
            };
        }

        /**
         * @return {Identity}
         */

    }, {
        key: "identity",
        get: function get() {
            return this._identity;
        }

        /**
         *
         * @return {CertificateBundle}
         */

    }, {
        key: "certificate",
        get: function get() {
            return this._certificate;
        }

        /**
         * @property
         * @readonly
         * @returns {Object}
         */

    }, {
        key: "configuration",
        get: function get() {
            return this._configuration;
        }
    }]);

    return Environment;
}(_CoreObject3.default);

exports.Environment = Environment;
exports.default = Environment;
//# sourceMappingURL=Environment.js.map