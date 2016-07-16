"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require("./CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _altcoinAddress = require("altcoin-address");

var _altcoinAddress2 = _interopRequireDefault(_altcoinAddress);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VALIDATORS = {

    /**
     * @param {URI|null|String} uri
     */
    'general': function general(uri) {
        if (!uri) {
            return false;
        }

        if (_Utility2.default.isString(uri)) {
            var index = uri.indexOf(":/");

            if (-1 === index) {
                return false;
            }

            var protocol = uri.substring(0, index);
            var rest = uri.substring(index + 2);

            uri = new _urijs2.default(protocol + "://" + rest);
        }

        var scheme = uri.scheme();
        var host = uri.host();

        return !(_Utility2.default.isBlank(scheme) || _Utility2.default.isBlank(host));
    },

    /**
     * @param {URI} uri
     * @returns {*}
     */
    'bitcoin': function bitcoin(uri) {
        return _altcoinAddress2.default.validate(_Utility2.default.optString(uri));
    }
};

/**
 * A class for uniquely identifying something.
 */

var Address = function (_CoreObject) {
    _inherits(Address, _CoreObject);

    /**
     *
     * @param {URI|String|Object} options
     * @param {Function} [options.validator]
     * @param {Boolean} [options.strict] Set to false to skip validation.
     */

    function Address(options) {
        _classCallCheck(this, Address);

        if (_Utility2.default.isString(options)) {
            options = { value: options };
        } else if (options instanceof _urijs2.default) {
            options = { value: options };
        }

        /**
         * @type {String|URI}
         */
        var value = _Utility2.default.take(options, 'value');
        var validator = _Utility2.default.take(options, 'validator');
        var strict = _Utility2.default.take(options, 'strict');

        _Preconditions2.default.shouldBeDefined(value, 'Cannot construct an empty Address.');

        var generalValidator = _Preconditions2.default.shouldBeFunction(VALIDATORS['general'], 'general validator is required');

        {
            _Preconditions2.default.shouldBeTrue(generalValidator(value), 'general validator failed for: ' + value);
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Address).call(this, options));

        _this._uri = (0, _urijs2.default)(value);
        _this._validator = validator || VALIDATORS[_Utility2.default.toLowerCase(_this.resource)];
        _this._strict = false === strict;

        if (_this._strict) {
            // Require Validation
            _Preconditions2.default.shouldBeFunction(_this.validator, 'validator not found for \'' + _this.toString() + '\'');
            _Preconditions2.default.shouldBeTrue(_this.valid, 'not valid');
        }
        return _this;
    }

    _createClass(Address, [{
        key: "toString",


        /**
         *
         * @returns {String}
         */
        value: function toString() {
            return this.valueOf();
        }

        /**
         * @returns {String}
         */

    }, {
        key: "valueOf",
        value: function valueOf() {
            return this._uri.toString();
        }

        /**
         * @returns {String}
         */

    }, {
        key: "strict",
        get: function get() {
            return this._strict;
        }
    }, {
        key: "value",
        get: function get() {
            return this.uri.host();
        }
    }, {
        key: "resource",
        get: function get() {
            return this.uri.scheme();
        }

        /**
         * @returns {URI}
         */

    }, {
        key: "uri",
        get: function get() {
            return this._uri;
        }

        /**
         *
         * @returns {Boolean}
         */

    }, {
        key: "valid",
        get: function get() {
            if (_Utility2.default.isUndefined(this._valid) && this.validator) {
                this._valid = this.validator(this.uri);
            }

            return this._valid;
        }

        /**
         * @returns {Function}
         */

    }, {
        key: "validator",
        get: function get() {
            return this._validator;
        }
    }], [{
        key: "toString",
        value: function toString() {
            return 'Address';
        }

        /**
         * @param {String} scheme
         * @param {Function} validatorFn
         */

    }, {
        key: "registerValidator",
        value: function registerValidator(scheme, validatorFn) {
            scheme = _Preconditions2.default.shouldNotBeBlank(_Utility2.default.toLowerCase(_Preconditions2.default.shouldBeString(scheme)));
            validatorFn = _Preconditions2.default.shouldBeFunction(validatorFn);

            VALIDATORS[_Utility2.default.toLowerCase(scheme)] = validatorFn;

            return validatorFn;
        }
    }]);

    return Address;
}(_CoreObject3.default);

exports.default = Address;
module.exports = exports['default'];
//# sourceMappingURL=Address.js.map