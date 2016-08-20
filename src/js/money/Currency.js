'use strict';

import Utility from "../Utility";
import CoreObject from "../CoreObject";
import Preconditions from "../Preconditions";
import Money from "./Money";
import Big from "big.js/big";
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
export default class Currency extends CoreObject {

    constructor() {
        super();

        // if (this.constructor === Currency) {
        throw new TypeError('Cannot construct Currency instances directly');
        // }
    }

    /**
     * @returns {String}
     */
    toString() {
        return this.toClass().toString();
    }

    // /**
    //  * @return {Converter}
    //  */
    // get converter() {
    //     return this.toClass().converter;
    // }

    static equals(currency) {
        currency = Currency.optCurrency(currency);

        if (!Currency.isCurrency(currency)) {
            return false;
        }

        let clazz1 = this.toClass();
        let clazz2 = currency.toClass();

        return (clazz1 === clazz2);
    }

    /**
     *
     * @param {Number|Money|String} value
     * @returns {Money}
     */
    static create(value) {
        let money = Money.optMoney(
            Currency.toValueOrFail(value),
            Currency.optCurrency(value) || this.getChildCurrencyTypeOrFail());

        Preconditions.shouldBeDefined(money, 'Money.optMoney has failed us.');
        Money.shouldBeMoney(money);

        return money;
        // return money.convertTo(this.getChildCurrencyTypeOrFail(), optionalConversion);
    }

    /**
     * @returns {String}
     */
    static toString() {
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
    static getChildCurrencyTypeOrFail() {
        var currency = this;

        Currency.shouldBeCurrency(currency);

        Preconditions.shouldBeTrue(this.isChildCurrency(), 'Cannot be the Currency class directly. Use a subclass, like Bitcoin. You used: ' + this.toClass().toString());

        return currency;
    }

    /**
     * @private
     * @returns {boolean}
     */
    static isChildCurrency() {
        return this.toClass() !== Currency && Currency.isClass(this);
    }

    /**
     *
     * @param {Money|String|Number} valueOrMoney
     * @param {Class<Currency>|Currency} [defaultCurrency]
     * @returns {Money}
     */
    static toMoney(valueOrMoney, defaultCurrency) {
        if (valueOrMoney instanceof Money) {
            return valueOrMoney;
        }

        let value = Currency.toValueOrFail(valueOrMoney);
        let currency = Currency.optCurrency(valueOrMoney) || Currency.optCurrency(defaultCurrency);

        if (!currency) {
            currency = this.getChildCurrencyTypeOrFail();
        }

        Currency.shouldBeCurrency(currency);

        if (currency === Currency) {
        // if (Object.getPrototypeOf(currency) === Currency) {
            throw new Error(`Cannot have myself as a currency. Must use a subclass, like Bitcoin or USD. This is usually because I do Currency.toMoney() instead of Bitcoin.toMoney()`);
        }

        return new Money({
            value: value,
            currency: currency
        });
    }

    /**
     * @param {Class<Currency>|Currency|Object} objectOrCurrency
     * @return {Class<Currency>}
     * @throws error if not a currency type
     */
    static getCurrency(objectOrCurrency) {
        let instance = Currency.optCurrency(objectOrCurrency);

        Currency.shouldBeCurrency(instance, 'Currency not found: ' + objectOrCurrency);

        return instance;
    }

    /**
     * @param {Class<Currency>|Currency|Object|Money|String} objectOrCurrency
     * @return {Class<Currency>|Currency|undefined}
     */
    static optCurrency(objectOrCurrency) {
        if (Currency.isCurrency(objectOrCurrency)) {
            return objectOrCurrency;
        } else if (Currency.isInstance(objectOrCurrency)) {
            return objectOrCurrency.toClass();
        } else if (Money.isInstance(objectOrCurrency)) {
            return objectOrCurrency.currency;
        } else if (Utility.isString(objectOrCurrency)) {
            // let string = objectOrCurrency.toLowerCase();

            if (Utility.isNumeric(objectOrCurrency)) {
                return undefined;
            }

            throw new Error(`Not sure what to do with ${objectOrCurrency}`);
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
    static shouldBeCurrency(clazz, message) {
        Preconditions.shouldBeClass(clazz, Currency, 'Must be currency: ' + message);

        return clazz;
    }

    /**
     *
     * @param {Class<Currency>|Currency|Object|*} object
     * @returns {boolean}
     */
    static isCurrency(object) {
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
    static toValueOrFail(numberOrMoney) {
        let value = this.optValue(numberOrMoney);

        if (value) {
            return value;
        } else {
            Preconditions.fail('Number|Currency', Utility.typeOf(numberOrMoney), `This method fails with the wrong type. You provided ${numberOrMoney} (type: ${Utility.typeOf(numberOrMoney)})`);
        }
    }

    /**
     * Will return undefined if it cannot figure out what to do.
     * Defaults to Zero.
     *
     * @param numberOrMoney
     * @return {Big|BigJsLibrary.BigJS|undefined}
     */
    static optValue(numberOrMoney) {
        if (Utility.isNullOrUndefined(numberOrMoney)) {
            return new Big(0);
        } else if (Money.isInstance(numberOrMoney)) {
            return numberOrMoney.value;
        } else if (Utility.isNumber(numberOrMoney)) {
            return new Big(numberOrMoney);
        } else if (Utility.isString(numberOrMoney)) {
            return new Big(numberOrMoney);
        } else if (numberOrMoney instanceof Big) {
            return numberOrMoney;
        } else {
            return undefined;
        }
    }
}