'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ = require('./..');

var _Currency = require('./Currency');

var _Currency2 = _interopRequireDefault(_Currency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Money = function (_CoreObject) {
    _inherits(Money, _CoreObject);

    /**
     * @param {Object} options
     * @param {Number} options.value
     */

    function Money(options) {
        _classCallCheck(this, Money);

        _.Preconditions.shouldBeDefined(_Currency2.default);

        var value = _.Preconditions.shouldBeNumber(_Currency2.default.toValueOrFail(_.Utility.take(options, 'value')));
        var currency = _.Preconditions.shouldBeDefined(_Currency2.default.getCurrency(_.Utility.take(options, 'currency')));

        /**
         * @type {Number}
         * @private
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Money).apply(this, arguments));

        _this._value = _.Preconditions.shouldBeNumber(value);

        /**
         * @type {Class<Currency>}
         * @private
         */
        _this._currency = _Currency2.default.shouldBeCurrency(currency);
        return _this;
    }

    /**
     *
     * @returns {Class<Currency>}
     */


    _createClass(Money, [{
        key: 'toString',
        value: function toString() {
            return this.currency.toString(this);
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            return this.currency.toJson(this);
        }

        /**
         * Returns a new instance of money, since this is immutable.
         *
         * @param {String|Number|Money} money
         * @return {Money}
         */

    }, {
        key: 'add',
        value: function add(money) {
            money = Money.optMoney(money, this.currency);
            var convertedValue = this.currency.convertFrom(money);

            return this.mutate(convertedValue + this);
        }

        /**
         * Returns a new instance of money, since this is immutable.
         *
         * @param {String|Number|Money} money
         * @return {Money}
         */

    }, {
        key: 'subtract',
        value: function subtract(money) {
            money = Money.optMoney(money, this.currency);
            var convertedValue = this.currency.convertFrom(money).value;

            return this.mutate(convertedValue - this.value);
        }

        /**
         * @param {Money|String|Number} money
         * @param {Number|Function} [optionalConversion]
         * @returns {boolean}
         */

    }, {
        key: 'equals',
        value: function equals(money, optionalConversion) {
            money = Money.optMoney(money, this.currency);

            if (!money) {
                return false;
            }

            var convertedAlien = _.Preconditions.shouldBeNumber(_Currency2.default.toValueOrFail(this.currency.convertFrom(money, optionalConversion)), 'Converted value must be a number.');
            var value = _.Preconditions.shouldBeNumber(_Currency2.default.toValueOrFail(this), 'Our value must be a number.');

            return convertedAlien === value;
        }
    }, {
        key: 'valueOf',
        value: function valueOf() {
            return this.value;
        }

        /**
         *
         * @param {Number} value
         * @returns {Money}
         * @private
         */

    }, {
        key: 'mutate',
        value: function mutate(value) {
            if (!value) {
                value = 0;
            }

            return new Money({
                currency: this.currency,
                value: value
            });
        }

        /**
         *
         * @param {Currency|Class<Currency>|String} currencyOrString
         * @param {Number|Function|Converter} [optionalConversion]
         * @returns {Money}
         */

    }, {
        key: 'convertTo',
        value: function convertTo(currencyOrString, optionalConversion) {
            var currency = _Currency2.default.getCurrency(currencyOrString);

            return currency.convertFrom(this, optionalConversion);
        }

        /**
         *
         * @param {Number|String|Money} valueOrMoney
         * @param {Class<Currency>} [defaultCurrency]
         * @returns {Money|undefined}
         */

    }, {
        key: 'currency',
        get: function get() {
            return this._currency;
        }

        /**
         * @returns {Number}
         */

    }, {
        key: 'value',
        get: function get() {
            return this._value;
        }
    }], [{
        key: 'optMoney',
        value: function optMoney(valueOrMoney, defaultCurrency) {
            if (Money.isInstance(valueOrMoney)) {
                return valueOrMoney;
            }

            return new Money({
                value: valueOrMoney,
                currency: defaultCurrency
            });
        }
    }]);

    return Money;
}(_.CoreObject);

exports.default = Money;
module.exports = exports['default'];
//# sourceMappingURL=Money.js.map