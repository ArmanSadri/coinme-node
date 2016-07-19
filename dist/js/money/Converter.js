'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

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

var Converter = function (_CoreObject) {
    _inherits(Converter, _CoreObject);

    /**
     * @param {Object} options
     * @param {Object} options.conversions
     */

    function Converter(options) {
        _classCallCheck(this, Converter);

        var conversions = _Utility2.default.take(options, 'conversions');

        /**
         * @type {Object}
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Converter).apply(this, arguments));

        _this._conversions = conversions || {};
        return _this;
    }

    /**
     * This is the conversion map. The keys of this object should be 'Currency1->Currency2'
     *
     * The value of each key should be a conversion function of 'function(valueInSource) { return valueInDestination; }
     *
     * @returns {Object}
     */


    _createClass(Converter, [{
        key: "canConvert",


        /**
         * Determines if this Converter instance can convert between the two currencies.
         *
         * NOTE: The direction matters.
         *
         * @param {Class<Currency>|Currency|String} currency1
         * @param {Class<Currency>|Currency|String} currency2
         * @param {Number|String|Function|Converter} [optionalConversion]
         * @returns {boolean}
         */
        value: function canConvert(currency1, currency2, optionalConversion) {
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
         * @param {Function} [optionalConversion]
         * @returns {Money}
         * @throws {PreconditionsError} if the converter fails to convert into a valid number
         * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
         * @throws {PreconditionsError} if converter cannot support the conversion
         */

    }, {
        key: "convert",
        value: function convert(sourceMoney, destinationCurrency, optionalConversion) {
            destinationCurrency = _Currency2.default.getCurrency(destinationCurrency);

            var fn = this.optConversion(sourceMoney.currency, destinationCurrency, optionalConversion);
            var scope = Converter.isInstance(optionalConversion) ? optionalConversion : this;
            var value = fn.call(scope, sourceMoney.value);

            return new _Money2.default({
                value: value,
                currency: destinationCurrency
            });
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
            } else if (Converter.isInstance(optionalConversion)) {
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
    }, {
        key: "conversions",
        get: function get() {
            return this._conversions;
        }
    }]);

    return Converter;
}(_CoreObject3.default);

exports.default = Converter;
module.exports = exports['default'];
//# sourceMappingURL=Converter.js.map