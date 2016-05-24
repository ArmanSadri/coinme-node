"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require("./..");

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

var _Converter = require("./Converter");

var _Converter2 = _interopRequireDefault(_Converter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _converter = new _Converter2.default({
    conversions: {}
});

var Currency = function (_CoreObject) {
    _inherits(Currency, _CoreObject);

    function Currency() {
        _classCallCheck(this, Currency);

        // if (this.constructor === Currency) {
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Currency).call(this));

        throw new TypeError('Cannot construct Currency instances directly');
        // }
        return _this;
    }

    _createClass(Currency, null, [{
        key: "equals",
        value: function equals(currency) {
            currency = Currency.optCurrency(currency);

            if (!Currency.isCurrency(currency)) {
                return false;
            }

            var clazz1 = this.toClass();
            var clazz2 = currency.toClass();

            return clazz1 === clazz2;
        }

        /**
         *
         * @param {Number|Money|String} value
         * @returns {Money}
         */

    }, {
        key: "create",
        value: function create(value) {
            return _Money2.default.optMoney(Currency.toValueOrFail(value), Currency.optCurrency(value) || this.getChildCurrencyTypeOrFail());
        }
    }, {
        key: "toString",
        value: function toString() {
            return 'Currency';
        }

        /**
         * @returns {Converter}
         */

    }, {
        key: "convertFrom",


        /**
         * @param {Money} money
         * @param {Number|Function|Converter} [optionalConversion]
         * @returns {Money}
         */
        value: function convertFrom(money, optionalConversion) {
            return money.currency.converter.convert(money, this.getChildCurrencyTypeOrFail(), optionalConversion);
        }
    }, {
        key: "canConvertFrom",
        value: function canConvertFrom(money, optionalConversion) {}

        //
        // /**
        //  * If you are using it statically on Currency, then the signature is Currency.convertTo(money, destinationCurrency);
        //  * If you are using it on a subclass of Currency, then the signature is Currency.convertTo(money);
        //  *
        //  * @param {Number|Money|String} valueOrMoney
        //  * @param {Currency} [destinationCurrency]
        //  */
        // static convertTo(valueOrMoney, destinationCurrency) {
        //     if (!destinationCurrency) {
        //         destinationCurrency = this.getChildCurrencyTypeOrFail();
        //     } else {
        //         if (this.isChildCurrency()) {
        //
        //         }
        //     }
        //
        //     Currency.shouldBeCurrency(destinationCurrency);
        //
        //     /**
        //      * @type {Currency}
        //      */
        //     let sourceCurrency = (/** @type {Currency} */(destinationCurrency || this.getChildCurrencyTypeOrFail()));
        //
        //     /**
        //      * @type {Money}
        //      */
        //     let money = sourceCurrency.create(valueOrMoney);
        //
        //     return this.converter.convert(money, destinationCurrency);
        // }

        /**
         * @private
         * @returns {Currency}
         */

    }, {
        key: "getChildCurrencyTypeOrFail",
        value: function getChildCurrencyTypeOrFail() {
            var currency = this;

            Currency.shouldBeCurrency(currency);

            _.Preconditions.shouldBeTrue(this.isChildCurrency(), 'Cannot be the Currency class directly. Use a subclass, like Bitcoin. You used: ' + this.toClass().toString());

            return currency;
        }

        /**
         * @private
         * @returns {boolean}
         */

    }, {
        key: "isChildCurrency",
        value: function isChildCurrency() {
            return this.toClass() !== Currency && Currency.isClass(this);
        }

        /**
         *
         * @param {Money|String|Number} valueOrMoney
         * @param {Currency} [defaultCurrency]
         * @returns {Money}
         */

    }, {
        key: "toMoney",
        value: function toMoney(valueOrMoney, defaultCurrency) {
            var value = Currency.toValueOrFail(valueOrMoney);
            var currency = Currency.optCurrency(valueOrMoney) || Currency.optCurrency(defaultCurrency);

            if (!currency) {
                currency = this;
            }

            Currency.shouldBeCurrency(currency);

            if (Object.getPrototypeOf(currency) === Currency) {
                throw new Error('Cannot have myself as a currency. Must use a subclass, like Bitcoin');
            }

            return new _Money2.default({
                value: value,
                currency: this
            });
        }

        /**
         * @param {Class<Currency>|Currency|Object} objectOrCurrency
         * @return {Class<Currency>}
         * @throws error if not a currency type
         */

    }, {
        key: "getCurrency",
        value: function getCurrency(objectOrCurrency) {
            var instance = Currency.optCurrency(objectOrCurrency);

            Currency.shouldBeCurrency(instance);

            return instance;
        }

        /**
         * @param {Class<Currency>|Currency|Object|Money|String} objectOrCurrency
         * @return {Class<Currency>|Currency|undefined}
         */

    }, {
        key: "optCurrency",
        value: function optCurrency(objectOrCurrency) {
            if (Currency.isCurrency(objectOrCurrency)) {
                return objectOrCurrency;
            } else if (Currency.isInstance(objectOrCurrency)) {
                console.log('object', objectOrCurrency);
                return objectOrCurrency.toClass();
            } else if (_Money2.default.isInstance(objectOrCurrency)) {
                return objectOrCurrency.currency;
            }

            return undefined;
        }

        // static toString(numberOrStringOrMoney, currencyInstanceOrClass) {
        //     Preconditions.shouldBeDefined(Money, 'money should be defined!');
        //
        //     let currency;
        //     let value;
        //
        //     if (numberOrStringOrMoney instanceof Money) {
        //         currency = numberOrStringOrMoney.currency;
        //         value = numberOrStringOrMoney.value;
        //     } else {
        //         currency = Currency.getCurrency(currencyInstanceOrClass);
        //         value = Currency.toValueOrFail(numberOrStringOrMoney);
        //     }
        //
        //     Preconditions.shouldBeDefined(currency);
        //     Currency.shouldBeCurrency(currency);
        //
        //     return currency.toString(value);
        // }

        /**
         * 
         * @param {*} clazz
         * @param {String} [message]
         *
         * @returns {Class<Currency>}
         */

    }, {
        key: "shouldBeCurrency",
        value: function shouldBeCurrency(clazz, message) {
            _.Preconditions.shouldBeClass(clazz, Currency, 'Must be currency: ' + message);

            return clazz;
        }

        /**
         *
         * @param {Class<Currency>|Currency|Object|*} object
         * @returns {boolean}
         */

    }, {
        key: "isCurrency",
        value: function isCurrency(object) {
            if (Currency.isClass(object)) {
                return true;
            }

            if (Currency.isInstance(object)) {
                return true;
            }

            return false;
        }

        /**
         * If the type is correct, will unwrap to the value.
         * If the type is not correct, will throw an exception.
         *
         * @type {Money|Number|String|undefined|null}
         * @return {Number}
         * @throws err if not correct type.
         */

    }, {
        key: "toValueOrFail",
        value: function toValueOrFail(numberOrMoney) {
            if (_.Utility.isNullOrUndefined(numberOrMoney)) {
                return 0;
            } else if (_Money2.default.isInstance(numberOrMoney)) {
                return numberOrMoney.value;
            } else if (_.Utility.isNumber(numberOrMoney)) {
                return numberOrMoney;
            } else if (_.Utility.isString(numberOrMoney)) {
                return parseFloat(numberOrMoney);
            } else {
                console.log(numberOrMoney);

                _.Preconditions.fail('Number|Currency', _.Utility.typeOf(numberOrMoney), 'This method fails with the wrong type.');
            }
        }
    }, {
        key: "toClass",
        value: function toClass() {
            return this;
        }
    }, {
        key: "converter",
        get: function get() {
            return _converter;
        }

        /**
         *
         * @param {Converter} value
         */
        ,
        set: function set(value) {
            _converter = value;
        }
    }]);

    return Currency;
}(_.CoreObject);

exports.default = Currency;
module.exports = exports['default'];
//# sourceMappingURL=Currency.js.map