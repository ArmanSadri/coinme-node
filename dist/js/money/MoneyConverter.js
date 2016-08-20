'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MoneyConverter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

var _Currency = require("./Currency");

var _Currency2 = _interopRequireDefault(_Currency);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _data = require("../data");

var _CurrencyAdapter = require("./CurrencyAdapter");

var _CurrencyAdapter2 = _interopRequireDefault(_CurrencyAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Supports different conversion directions.
 *
 * The conversion map uses the Currency name for directionality. The internal conversion map is stored like:
 *
 * {<br>
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },<br>
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }<br>
 * }<br>
 *
 * @class
 */

var MoneyConverter = function (_DelegatedConverter) {
    _inherits(MoneyConverter, _DelegatedConverter);

    /**
     * @param {Object} options
     * @param {Object} options.conversions
     */

    function MoneyConverter(options) {
        _classCallCheck(this, MoneyConverter);

        _Utility2.default.defaults(options, {
            adapter: new _CurrencyAdapter2.default()
        });

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MoneyConverter).apply(this, arguments));
    }

    /**
     * Determines if this Converter instance can convert between the two currencies.
     *
     * NOTE: The direction matters.
     *
     * @param {Class<Currency>|Currency|String} currency1
     * @param {Class<Currency>|Currency|String} currency2
     * @returns {boolean}
     */


    _createClass(MoneyConverter, [{
        key: "supports",
        value: function supports(currency1, currency2) {
            currency1 = _Currency2.default.optCurrency(currency1);
            currency2 = _Currency2.default.optCurrency(currency2);

            var conversion = this.optConversion(currency1, currency2, optionalConversion);

            return _Utility2.default.isFunction(conversion);
        }

        /**
         * Executes the conversion.
         *
         * @param {Money} sourceMoney
         * @param {Class<Currency>|Currency} destinationCurrency
         * @returns {Money}
         * @throws {PreconditionsError} if the converter fails to convert into a valid number
         * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
         * @throws {PreconditionsError} if converter cannot support the conversion
         */

    }, {
        key: "convert",
        value: function convert(sourceMoney, destinationCurrency) {
            return _Money2.default.shouldBeMoney(_get(Object.getPrototypeOf(MoneyConverter.prototype), "convert", this).call(this, sourceMoney, destinationCurrency), destinationCurrency);
        }

        /**
         * Detects the conversion function, given the inputs.
         *
         * @param {Class<Currency>|Currency|String} sourceCurrency
         * @param {Class<Currency>|Currency|String} destinationCurrency
         * @param {Function|Number|String|Converter} [optionalConversion]
         *
         * @returns {Function}
         */

    }, {
        key: "optConversion",
        value: function optConversion(sourceCurrency, destinationCurrency, optionalConversion) {
            sourceCurrency = _Currency2.default.optCurrency(sourceCurrency);
            destinationCurrency = _Currency2.default.optCurrency(destinationCurrency);

            if (!sourceCurrency || !destinationCurrency) {
                return null;
            } else if (sourceCurrency.equals(destinationCurrency)) {
                return function (value) {
                    return value;
                };
            } else if (_Utility2.default.isFunction(optionalConversion)) {
                return optionalConversion;
            } else if (_Utility2.default.isNumber(optionalConversion)) {
                return function (value) {
                    return value * optionalConversion;
                };
            } else if (_data.Converter.isInstance(optionalConversion)) {
                return this._getConversion(optionalConversion, sourceCurrency, destinationCurrency);
            } else {
                return this._getConversion(this, sourceCurrency, destinationCurrency);
            }
        }

        /**
         * Register a conversion with this converter. This must be a valid object.
         *
         * Example:
         *
         * {<br>
         *     'USD->Bitcoin': function() ...<br>
         * }<br>
         *
         * @param {Object} conversions
         * @returns {Converter}
         */

    }, {
        key: "register",
        value: function register(conversions) {
            _Preconditions2.default.shouldBeObject(conversions);

            _lodash2.default.assign(this.conversions, conversions);

            return this;
        }

        /**
         * @param {Converter} converter
         * @param {Money|Currency|Class<Currency>|String} sourceCurrency
         * @param {Money|Currency|Class<Currency>|String} destinationCurrency
         * @private
         * @return {Function}
         */

    }, {
        key: "_getConversion",
        value: function _getConversion(converter, sourceCurrency, destinationCurrency) {
            sourceCurrency = _Currency2.default.getCurrency(sourceCurrency);
            destinationCurrency = _Currency2.default.getCurrency(destinationCurrency);

            var converterName = sourceCurrency.toString() + '->' + destinationCurrency.toString();
            var fn = converter.conversions[converterName];

            _Preconditions2.default.shouldBeFunction(fn, 'Converter not found: ' + converterName);

            return fn;
        }
    }]);

    return MoneyConverter;
}(_data.DelegatedConverter);

exports.MoneyConverter = MoneyConverter;
exports.default = MoneyConverter;
//# sourceMappingURL=MoneyConverter.js.map