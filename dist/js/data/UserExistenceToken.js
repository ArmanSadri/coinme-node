'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserExistenceToken = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */
var UserExistenceToken = function (_CoreObject) {
    _inherits(UserExistenceToken, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {String} options.username
     * @param {Boolean} options.requiresNewPassword
     * @param {Boolean} options.usingTemporaryPassword
     * @param {Boolean} options.usingVerifiedEmail
     * @param {Boolean} options.usingEmail
     * @param {String} options.emailToken
     * @param {Boolean} options.exists
     */
    function UserExistenceToken(options) {
        _classCallCheck(this, UserExistenceToken);

        var username = _Utility2.default.take(options, 'username', 'string', true);
        var requiresNewPassword = _Utility2.default.take(options, 'requiresNewPassword', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        var usingTemporaryPassword = _Utility2.default.take(options, 'usingTemporaryPassword', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        var usingVerifiedEmail = _Utility2.default.take(options, 'usingVerifiedEmail', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        var usingEmail = _Utility2.default.take(options, 'usingEmail', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        var emailToken = _Utility2.default.take(options, 'emailToken', 'string', false);
        var exists = _Utility2.default.take(options, 'exists', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });

        var _this = _possibleConstructorReturn(this, (UserExistenceToken.__proto__ || Object.getPrototypeOf(UserExistenceToken)).apply(this, arguments));

        _this._requiresNewPassword = requiresNewPassword;
        _this._usingVerifiedEmail = usingVerifiedEmail;
        _this._usingEmail = usingEmail;
        _this._usingTemporaryPassword = usingTemporaryPassword;
        _this._emailToken = emailToken;
        _this._exists = exists;
        _this._username = username;
        return _this;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|String}
     * @return {undefined|String}
     */


    _createClass(UserExistenceToken, [{
        key: "toJson",
        value: function toJson() {
            return _get(UserExistenceToken.prototype.__proto__ || Object.getPrototypeOf(UserExistenceToken.prototype), "toJson", this).call(this, {
                username: this.username,
                requiresNewPassword: this.requiresNewPassword,
                usingTemporaryPassword: this.usingTemporaryPassword,
                usingEmail: this.usingEmail,
                usingVerifiedEmail: this.usingVerifiedEmail,
                emailToken: this.emailToken,
                exists: this.exists
            });
        }
    }, {
        key: "emailToken",
        get: function get() {
            return this._emailToken;
        }

        /**
         * @property
         * @readonly
         * @type {String}
         * @return {String}
         */

    }, {
        key: "username",
        get: function get() {
            return this._username;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Boolean}
         * @return {undefined|Boolean}
         */

    }, {
        key: "requiresNewPassword",
        get: function get() {
            return this._requiresNewPassword;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Boolean}
         * @return {undefined|Boolean}
         */

    }, {
        key: "usingTemporaryPassword",
        get: function get() {
            return this._usingTemporaryPassword;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Boolean}
         * @return {undefined|Boolean}
         */

    }, {
        key: "usingEmail",
        get: function get() {
            return this._usingEmail;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Boolean}
         * @return {undefined|Boolean}
         */

    }, {
        key: "usingVerifiedEmail",
        get: function get() {
            return this._usingVerifiedEmail;
        }

        /**
         * @property
         * @readonly
         * @type {undefined|Boolean}
         * @return {undefined|Boolean}
         */

    }, {
        key: "exists",
        get: function get() {
            return this._exists;
        }
    }]);

    return UserExistenceToken;
}(_CoreObject3.default);

exports.UserExistenceToken = UserExistenceToken;
exports.default = UserExistenceToken;
//# sourceMappingURL=UserExistenceToken.js.map