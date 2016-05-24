'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require("./");

var _2 = require("./..");

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
 * {
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }
 * }
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

        var conversions = _2.Utility.take(options, 'conversions');

        /**
         * @type {Object}
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Converter).apply(this, arguments));

        _this._conversions = conversions || {};
        return _this;
    }

    _createClass(Converter, [{
        key: "canConvert",
        value: function canConvert(currency1, currency2, optionalConversion) {
            currency1 = _.Currency.optCurrency(currency1);
            currency2 = _.Currency.optCurrency(currency2);

            var conversion = this.optConversion(currency1, currency2, optionalConversion);

            return _2.Utility.isFunction(conversion);
        }

        /**
         *
         * @param {Money} money
         * @param {Class<Currency>|Currency} currency
         * @param {Function} [optionalConversion]
         * @returns {Money}
         */

    }, {
        key: "convert",
        value: function convert(money, currency, optionalConversion) {
            currency = _.Currency.getCurrency(currency);

            var fn = this.optConversion(money.currency, currency, optionalConversion);
            var value = fn.call(this, money.value);

            _2.Preconditions.shouldBeNumber(value, 'Sanity check failure, the value should be a number: ' + value);

            return new _.Money({
                value: value,
                currency: currency
            });
        }

        /**
         *
         * @param {Class<Currency>|Currency|String} sourceCurrency
         * @param {Class<Currency>|Currency|String} destinationCurrency
         * @param {Function|Number|String} [optionalConversion]
         * @returns {*}
         */

    }, {
        key: "optConversion",
        value: function optConversion(sourceCurrency, destinationCurrency, optionalConversion) {
            sourceCurrency = _.Currency.optCurrency(sourceCurrency);
            destinationCurrency = _.Currency.optCurrency(destinationCurrency);

            if (!sourceCurrency || !destinationCurrency) {
                return null;
            } else if (sourceCurrency.equals(destinationCurrency)) {
                return function (value) {
                    return value;
                };
            } else if (_2.Utility.isFunction(optionalConversion)) {
                return optionalConversion;
            } else if (_2.Utility.isNumber(optionalConversion)) {
                return function (value) {
                    return value * optionalConversion;
                };
            } else {
                return this._getConversion(sourceCurrency, destinationCurrency);
            }
        }

        /**
         *
         *
         * @param {Object} conversions
         * @returns {Converter}
         */

    }, {
        key: "register",
        value: function register(conversions) {
            _2.Preconditions.shouldBeObject(conversions);

            _lodash2.default.assign(this.conversions, conversions);

            return this;
        }

        /**
         * @param {Money|Currency|Class<Currency>|String} sourceCurrency
         * @param {Money|Currency|Class<Currency>|String} destinationCurrency
         * @private
         * @return {Function}
         */

    }, {
        key: "_getConversion",
        value: function _getConversion(sourceCurrency, destinationCurrency) {
            sourceCurrency = _.Currency.getCurrency(sourceCurrency);
            destinationCurrency = _.Currency.getCurrency(destinationCurrency);

            var converterName = sourceCurrency.toString() + '->' + destinationCurrency.toString();
            var fn = this.conversions[converterName];

            _2.Preconditions.shouldBeFunction(fn, 'Converter not found: ' + converterName);

            return fn;
        }
    }, {
        key: "conversions",
        get: function get() {
            return this._conversions;
        }
    }]);

    return Converter;
}(_2.CoreObject);

exports.default = Converter;
module.exports = exports['default'];
//# sourceMappingURL=Converter.js.map