"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VALIDATORS = {

    /**
     * @param {Address} address
     */
    'general': function general(address) {
        _Preconditions2.default.shouldBeInstance(address, Address);

        return !(_Utility2.default.isBlank(address.resource) || _Utility2.default.isBlank(address.value));
    },

    /**
     * @param {Address} address
     * @returns {boolean}
     */
    'bitcoin': function bitcoin(address) {
        _Preconditions2.default.shouldBeInstance(address, Address);

        if (address.resource !== 'bitcoin') {
            return false;
        }

        return _altcoinAddress2.default.validate(address.value, 'bitcoin');
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
     * @param {String} [options.value]
     * @param {Function} [options.validator]
     * @param {Boolean} [options.strict] Set to false to skip validation.
     */
    function Address(options) {
        _classCallCheck(this, Address);

        if (_Utility2.default.isString(options)) {
            options = { value: options };
        } else if (options instanceof _urijs2.default) {
            options = { value: options };
        } else if (options instanceof Address) {
            /**
             * @type {Address}
             */
            var address = options;

            options = {
                value: address.value,
                validator: address.validator,
                strict: address.strict
            };
        }

        /**
         * @type {String|URI}
         */
        var value = _Utility2.default.take(options, 'value');
        var validator = _Utility2.default.take(options, 'validator');
        var strict = _Utility2.default.take(options, 'strict');

        _Preconditions2.default.shouldBeDefined(value, 'Cannot construct an empty Address.');

        var _this = _possibleConstructorReturn(this, (Address.__proto__ || Object.getPrototypeOf(Address)).call(this, options));

        _this._uri = Address.toUri(value);
        _this._validator = validator || VALIDATORS[_Utility2.default.toLowerCase(_this.resource)];
        _this._strict = false === strict;

        {
            var generalValidator = _Preconditions2.default.shouldBeFunction(VALIDATORS['general'], 'general validator is required');

            _Preconditions2.default.shouldBeTrue(generalValidator(_this), 'general validator failed for: ' + value);
        }

        if (_this.strict) {
            // Require Validation
            _Preconditions2.default.shouldBeFunction(_this.validator, 'validator not found for \'' + _this.toString() + '\'');
            _Preconditions2.default.shouldBeTrue(_this.valid, 'not valid');
        }
        return _this;
    }

    /**
     * @return {boolean}
     */


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
    }, {
        key: "toJson",
        value: function toJson() {
            return _get(Address.prototype.__proto__ || Object.getPrototypeOf(Address.prototype), "toJson", this).call(this, {
                value: _Utility2.default.optString(this)
            });
        }

        /**
         * @returns {String}
         */

    }, {
        key: "strict",
        get: function get() {
            return this._strict;
        }

        /**
         * [resource]:/[value]
         *
         * @return {String}
         */

    }, {
        key: "value",
        get: function get() {
            return this.uri.host();
        }

        /**
         * [resource]:/[value]
         *
         * @return {String}
         */

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
            if (_Utility2.default.isUndefined(this._valid)) {
                if (this.validator) {
                    this._valid = this.validator(this);
                } else {
                    this._valid = true; // because it passed general.
                }
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

        /**
         *
         * @param {String|Address|URI} stringOrAddressOrUri
         * @return {Address|null}
         */

    }, {
        key: "toAddress",
        value: function toAddress(stringOrAddressOrUri) {
            if (_Utility2.default.isString(stringOrAddressOrUri) || stringOrAddressOrUri instanceof _urijs2.default) {
                return new Address(stringOrAddressOrUri);
            } else if (Address.isInstance(stringOrAddressOrUri)) {
                return stringOrAddressOrUri;
            } else {
                throw new _errors.NotImplementedError("Cannot handle " + stringOrAddressOrUri);
            }
        }

        /**
         *
         * @param {String|Address|URI} stringOrAddressOrUri
         * @param {String} [defaultScheme]
         * @return {Address}
         */

    }, {
        key: "toAddressWithDefaultScheme",
        value: function toAddressWithDefaultScheme(stringOrAddressOrUri, defaultScheme) {
            if (_Utility2.default.isString(stringOrAddressOrUri)) {
                return new Address(Address.toUriWithDefaultScheme(stringOrAddressOrUri, defaultScheme));
            } else {
                return Address.toAddress(stringOrAddressOrUri);
            }
        }

        /**
         *
         * @param {String|Address|URI} stringOrAddressOrUri
         * @param {String} [defaultScheme]
         * @return {URI}
         */

    }, {
        key: "toUriWithDefaultScheme",
        value: function toUriWithDefaultScheme(stringOrAddressOrUri, defaultScheme) {
            if (_Utility2.default.isNullOrUndefined(stringOrAddressOrUri)) {
                return null;
            } else if (stringOrAddressOrUri instanceof _urijs2.default) {
                return stringOrAddressOrUri;
            } else if (_Utility2.default.isString(stringOrAddressOrUri)) {
                if (~stringOrAddressOrUri.indexOf('://')) {
                    var u = new _urijs2.default(stringOrAddressOrUri);

                    return new _urijs2.default(u.scheme() + "://" + u.host());
                }

                var index = stringOrAddressOrUri.indexOf(":/");

                if (-1 === index) {
                    if (!_Utility2.default.isBlank(defaultScheme)) {
                        stringOrAddressOrUri = defaultScheme + ':/' + stringOrAddressOrUri;

                        index = defaultScheme.length;
                    } else {
                        return new _urijs2.default(stringOrAddressOrUri);
                    }
                }

                var protocol = stringOrAddressOrUri.substring(0, index);
                var rest = stringOrAddressOrUri.substring(index + 2);

                return new _urijs2.default(protocol + "://" + rest);
            } else {
                throw new _errors.NotImplementedError('Do not know how to handle: ' + stringOrAddressOrUri);
            }
        }

        /**
         *
         * @param {String|URI|null|undefined} uri
         * @return {URI}
         */

    }, {
        key: "toUri",
        value: function toUri(uri) {
            return Address.toUriWithDefaultScheme(uri);
        }
    }]);

    return Address;
}(_CoreObject3.default);

exports.Address = Address;
exports.default = Address;
//# sourceMappingURL=Address.js.map