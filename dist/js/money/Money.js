"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Currency = require("./Currency");

var _Currency2 = _interopRequireDefault(_Currency);

var _big = require("big.js/big");

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Money = function (_CoreObject) {
    _inherits(Money, _CoreObject);

    /**
     * @param {Object} options
     * @param {BigJsLibrary.BigJS} options.value
     */

    function Money(options) {
        _classCallCheck(this, Money);

        _Preconditions2.default.shouldBeDefined(_Currency2.default);

        var value = _Currency2.default.toValueOrFail(_Utility2.default.take(options, 'value'));
        var currency = _Preconditions2.default.shouldBeDefined(_Currency2.default.getCurrency(_Utility2.default.take(options, 'currency')));

        /**
         * @type {BigJsLibrary.BigJS}
         * @private
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Money).apply(this, arguments));

        _Preconditions2.default.shouldBe(function () {
            return value instanceof _big2.default;
        }, _Utility2.default.typeOf(_big2.default), _Utility2.default.typeOf(value), 'should be Big');
        _this._value = value;

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
        key: "toString",


        /**
         * @returns {string}
         */
        value: function toString() {
            return this.value + " " + this.currency;
        }

        /**
         *
         * @returns {{value, currency}|{value: BigJsLibrary.BigJS, currency: Class.<Currency>}}
         */

    }, {
        key: "toJson",
        value: function toJson() {
            return {
                value: this.value,
                currency: this.currency.toString()
            };
        }

        /**
         * @returns {{value, currency}|{value: BigJsLibrary.BigJS, currency: Class.<Currency>}}
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            return this.toJson();
        }

        /**
         * Returns a new instance of money, since this is immutable.
         *
         * @param {String|Number|Money} money
         * @return {Money}
         */

    }, {
        key: "plus",
        value: function plus(money) {
            var big1 = this._toValue(money);
            var big2 = this._toValue(this);

            var big3 = big1.plus(big2);

            return this.withValue(big3);
        }

        /**
         * Returns a new instance of money, since this is immutable.
         *
         * @param {String|Number|Money} money
         * @return {Money}
         */

    }, {
        key: "minus",
        value: function minus(money) {
            return this.withValue(this._toValue(money) - this.value);
        }

        /**
         * @param {Money|String|Number} money
         * @returns {boolean}
         */

    }, {
        key: "equals",
        value: function equals(money) {
            if (!money) {
                return false;
            }

            /**
             * @type {BigJsLibrary.BigJS}
             */
            var value1 = this._toValue(money);

            /**
             * @type {BigJsLibrary.BigJS}
             */
            var value2 = this._toValue(this);

            return value1.eq(value2);
        }

        /**
         *
         * @param {Money|Currency} currencyOrMoney
         * @returns {boolean}
         */

    }, {
        key: "isSameCurrency",
        value: function isSameCurrency(currencyOrMoney) {
            var c1 = _Preconditions2.default.shouldBeExisting(_Currency2.default.getCurrency(currencyOrMoney));
            var c2 = _Preconditions2.default.shouldBeExisting(_Currency2.default.getCurrency(this));

            return c1.equals(c2) && c2.equals(c1);
        }
    }, {
        key: "valueOf",
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
        key: "withValue",
        value: function withValue(value) {
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
         * @param {Money} money
         * @return {BigJsLibrary.BigJS}
         * @private
         */

    }, {
        key: "_toValue",
        value: function _toValue(money) {
            money = Money.shouldBeMoney(Money.optMoney(money, this.currency));

            var that = this;
            _Preconditions2.default.shouldBe(function () {
                return that.isSameCurrency(money);
            }, this.currency, _Currency2.default.optCurrency(money), 'Must be the same currency.');

            return _Currency2.default.toValueOrFail(money);
        }

        /**
         * @returns {string}
         */

    }, {
        key: "currency",
        get: function get() {
            return this._currency;
        }

        /**
         * @returns {BigJsLibrary.BigJS}
         */

    }, {
        key: "value",
        get: function get() {
            return this._value;
        }
    }], [{
        key: "toString",
        value: function toString() {
            return 'Money';
        }

        /**
         *
         * @param {*} object
         * @returns {Money}
         */

    }, {
        key: "shouldBeMoney",
        value: function shouldBeMoney(object) {
            if (_CoreObject3.default.isClass(object)) {
                _Preconditions2.default.shouldBeClass(object, Money, 'object should be money');
            } else {
                _Preconditions2.default.shouldBeInstance(object, Money, 'object should be money');
            }

            return object;
        }

        /**
         *
         * @param {Big|Number|String|Money} valueOrMoney
         * @param {Class<Currency>} [defaultCurrency]
         * @returns {Money|undefined}
         */

    }, {
        key: "optMoney",
        value: function optMoney(valueOrMoney, defaultCurrency) {
            if (Money.isInstance(valueOrMoney)) {
                return valueOrMoney;
            }

            return new Money({
                value: _Currency2.default.toValueOrFail(valueOrMoney),
                currency: defaultCurrency
            });
        }
    }]);

    return Money;
}(_CoreObject3.default);

exports.default = Money;
module.exports = exports['default'];
//# sourceMappingURL=Money.js.map