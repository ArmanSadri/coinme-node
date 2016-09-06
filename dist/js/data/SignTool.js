'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SignTool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class SignTool
 */
var SignTool = function (_CoreObject) {
    _inherits(SignTool, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {String} [options.secret]
     * @param {String} [options.issuer]
     */
    function SignTool(options) {
        _classCallCheck(this, SignTool);

        var secret = _Utility2.default.take(options, 'secret', 'string', false);
        var issuer = _Utility2.default.take(options, 'issuer', 'string', false);

        var _this = _possibleConstructorReturn(this, (SignTool.__proto__ || Object.getPrototypeOf(SignTool)).apply(this, arguments));

        _this._issuer = issuer;
        _this._secret = secret;
        return _this;
    }

    /**
     * @readonly
     * @property
     * @type {String}
     * @return {String}
     */


    _createClass(SignTool, [{
        key: "containsHeaders",


        /**
         *
         * @param {String} token
         * @param {Object} options
         * @param {boolean|String} [options.issuer]
         * @param {boolean|String} [options.subject]
         * @param {boolean|String} [options.audience]
         * @static
         */
        value: function containsHeaders(token, options) {
            // Will crash if not valid

            var decodedObject = _jsonwebtoken2.default.decode(token, {
                complete: true
            });

            // let result = decodedObject.payload;
            var payload = decodedObject.payload;

            {
                var requiresAudience = _Utility2.default.isTrue(options.audience);
                var hasAudience = !_Utility2.default.isBlank(payload.aud);

                if (requiresAudience && !hasAudience) {
                    return null;
                }
            }

            {
                var requiresIssuer = _Utility2.default.isTrue(options.issuer);
                var hasIssuer = !_Utility2.default.isBlank(payload.iss);

                if (requiresIssuer && !hasIssuer) {
                    return null;
                }
            }

            {
                var requiredSubject = _Utility2.default.isTrue(options.subject);
                var hasSubject = !_Utility2.default.isBlank(payload.sub);

                if (requiredSubject && !hasSubject) {
                    return null;
                }
            }

            // TODO: verify the signature somehow?

            return true;
        }

        /**
         *
         * @param {String} token
         * @param {Object} options
         * @param {String} [options.issuer]
         * @param {String} [options.subject]
         * @param {String} [options.audience]
         * @static
         */

    }, {
        key: "read",
        value: function read(token, options) {
            var secret = this.secret;

            // Will crash if not valid
            _jsonwebtoken2.default.verify(token, secret, options);

            return _jsonwebtoken2.default.decode(token, secret);
        }

        /**
         *
         * @param {Object} object
         * @param {Object} options
         * @param {String} [options.issuer]
         * @param {String} [options.subject]
         * @param {String} [options.audience]
         * @param {String} [options.secret]
         * @return {String} token
         * @static
         */

    }, {
        key: "write",
        value: function write(object, options) {
            var secret = _Utility2.default.defaultValue(options.secret, this.secret);

            _Preconditions2.default.shouldBeObject(object);

            return _jsonwebtoken2.default.sign(object, secret, options);
        }
    }, {
        key: "issuer",
        get: function get() {
            return this._issuer;
        }

        /**
         * @readonly
         * @property
         * @type {String}
         * @returns {String}
         */

    }, {
        key: "secret",
        get: function get() {
            return this._secret;
        }
    }]);

    return SignTool;
}(_CoreObject3.default);

exports.SignTool = SignTool;
exports.default = SignTool;
//# sourceMappingURL=SignTool.js.map