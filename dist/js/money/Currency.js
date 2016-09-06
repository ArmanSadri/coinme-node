'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

var _big = require("big.js/big");

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import {Utility, CoreObject, Preconditions} from '../index';
// import Converter from "./Converter";

// let _converter = new Converter({
//     conversions: {
//
//     }
// });
//
// let _types = {
//
//     /**
//      *
//      * @param {String|Class} stringOrClass
//      * @param {Class} [clazz]
//      */
//     register: function(stringOrClass, clazz) {
//         let name = (stringOrClass.toString().toLowerCase());
//
//         if (!clazz && Currency.isClass(stringOrClass)) {
//             clazz = stringOrClass;
//         }
//
//         this[name] = clazz;
//
//         return this;
//     }
// };

/**
 * @class
 */
var Currency = function (_CoreObject) {
    _inherits(Currency, _CoreObject);

    function Currency() {
        _classCallCheck(this, Currency);

        // if (this.constructor === Currency) {
        var _this = _possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).call(this));

        throw new TypeError('Cannot construct Currency instances directly');
        // }
        return _this;
    }

    /**
     * @returns {String}
     */


    _createClass(Currency, [{
        key: "toString",
        value: function toString() {
            return this.toClass().toString();
        }

        // /**
        //  * @return {Converter}
        //  */
        // get converter() {
        //     return this.toClass().converter;
        // }

    }], [{
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
            var money = _Money2.default.optMoney(Currency.toValueOrFail(value), Currency.optCurrency(value) || this.getChildCurrencyTypeOrFail());

            _Preconditions2.default.shouldBeDefined(money, 'Money.optMoney has failed us.');
            _Money2.default.shouldBeMoney(money);

            return money;
            // return money.convertTo(this.getChildCurrencyTypeOrFail(), optionalConversion);
        }

        /**
         * @returns {String}
         */

    }, {
        key: "toString",
        value: function toString() {
            return 'Currency';
        }

        // /**
        //  * @returns {Converter}
        //  */
        // static get converter() {
        //     return _converter;
        // }

        // /**
        //  * @returns {{register: function(name:string, type:Currency)}}
        //  */
        // static get types() {
        //     return _types;
        // }

        // /**
        //  *
        //  * @param {Converter} value
        //  */
        // static set converter(value) {
        //     _converter = value;
        // }

        // /**
        //  * @param {Money} money
        //  * @param {Number|Function|Converter} [optionalConversion]
        //  * @return {Money}
        //  * @throws {PreconditionsError} if money is not of the correct type.
        //  */
        // static convertFrom(money, optionalConversion) {
        //     Money.shouldBeMoney(money);
        //     Money.shouldBeInstance(money);
        //
        //     return money.currency.converter.convert(money, this.getChildCurrencyTypeOrFail(), optionalConversion);
        // }

        //
        // static canConvertFrom(money, optionalConversion) {
        //     return money.currency.canConvertFrom(money, optionalConversion);
        // }

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

            _Preconditions2.default.shouldBeTrue(this.isChildCurrency(), 'Cannot be the Currency class directly. Use a subclass, like Bitcoin. You used: ' + this.toClass().toString());

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
         * @param {Class<Currency>|Currency} [defaultCurrency]
         * @returns {Money}
         */

    }, {
        key: "toMoney",
        value: function toMoney(valueOrMoney, defaultCurrency) {
            if (valueOrMoney instanceof _Money2.default) {
                return valueOrMoney;
            }

            var value = Currency.toValueOrFail(valueOrMoney);
            var currency = Currency.optCurrency(valueOrMoney) || Currency.optCurrency(defaultCurrency);

            if (!currency) {
                currency = this.getChildCurrencyTypeOrFail();
            }

            Currency.shouldBeCurrency(currency);

            if (currency === Currency) {
                // if (Object.getPrototypeOf(currency) === Currency) {
                throw new Error("Cannot have myself as a currency. Must use a subclass, like Bitcoin or USD. This is usually because I do Currency.toMoney() instead of Bitcoin.toMoney()");
            }

            return new _Money2.default({
                value: value,
                currency: currency
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

            Currency.shouldBeCurrency(instance, 'Currency not found: ' + objectOrCurrency);

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
                return objectOrCurrency.toClass();
            } else if (_Money2.default.isInstance(objectOrCurrency)) {
                return objectOrCurrency.currency;
            } else if (_Utility2.default.isString(objectOrCurrency)) {
                // let string = objectOrCurrency.toLowerCase();

                if (_Utility2.default.isNumeric(objectOrCurrency)) {
                    return undefined;
                }

                throw new Error("Not sure what to do with " + objectOrCurrency);
            }

            return undefined;
        }

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
            _Preconditions2.default.shouldBeClass(clazz, Currency, 'Must be currency: ' + message);

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
         * @type {Money|Number|String|undefined|null|Big|BigJsLibrary.BigJS}
         * @return {Big|BigJsLibrary.BigJS}
         * @throws err if not correct type.
         */

    }, {
        key: "toValueOrFail",
        value: function toValueOrFail(numberOrMoney) {
            var value = this.optValue(numberOrMoney);

            if (value) {
                return value;
            } else {
                _Preconditions2.default.fail('Number|Currency', _Utility2.default.typeOf(numberOrMoney), "This method fails with the wrong type. You provided " + numberOrMoney + " (type: " + _Utility2.default.typeOf(numberOrMoney) + ")");
            }
        }

        /**
         * Will return undefined if it cannot figure out what to do.
         * Defaults to Zero.
         *
         * @param numberOrMoney
         * @return {Big|BigJsLibrary.BigJS|undefined}
         */

    }, {
        key: "optValue",
        value: function optValue(numberOrMoney) {
            if (_Utility2.default.isNullOrUndefined(numberOrMoney)) {
                return new _big2.default(0);
            } else if (_Money2.default.isInstance(numberOrMoney)) {
                return numberOrMoney.value;
            } else if (_Utility2.default.isNumber(numberOrMoney)) {
                return new _big2.default(numberOrMoney);
            } else if (_Utility2.default.isString(numberOrMoney)) {
                return new _big2.default(numberOrMoney);
            } else if (numberOrMoney instanceof _big2.default) {
                return numberOrMoney;
            } else {
                return undefined;
            }
        }
    }]);

    return Currency;
}(_CoreObject3.default);

exports.default = Currency;
//# sourceMappingURL=Currency.js.map