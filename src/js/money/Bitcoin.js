'use strict';

import Preconditions from "../Preconditions";
import Currency from "./Currency";
import Money from "./Money";
import Big from "big.js/big";

//
// /**
//  * @private
//  * @type {Converter}
//  */
// let conversions = {
//
//     /**
//      *
//      * @param {Number} valueInBitcoin
//      * @returns {Number}
//      */
//     'Bitcoin->Satoshi': function (valueInBitcoin) {
//         Preconditions.shouldBeNumber(valueInBitcoin);
//
//         return valueInBitcoin * Bitcoin.SATOSHIS_PER_BITCOIN
//     },
//
//     /**
//      *
//      * @param {Number} valueInSatoshi
//      * @returns {Number}
//      */
//     'Satoshi->Bitcoin': function (valueInSatoshi) {
//         Preconditions.shouldBeNumber(valueInSatoshi);
//
//         return valueInSatoshi * Bitcoin.BITCOIN_PER_SATOSHI;
//     }
// };
//
// // Register our known conversions.
// Currency.converter.register(conversions);

/**
 * @type {Big|BigJsLibrary.BigJS}
 */
let STATIC_BITCOIN_PER_SATOSHI = new Big(0.00000001);

/**
 * @type {Big|BigJsLibrary.BigJS}
 */
let STATIC_SATOSHI_PER_BITCOIN = new Big(100000000);

/**
 * Represents the Bitcoin currency in memory.
 *
 * This class cannot be instantiated. Everything is static and the constructor throws, so treat it like a singleton.
 *
 * @class Bitcoin
 */
class Bitcoin extends Currency {

    /**
     *
     * @param {Money|String|Number|null|undefined|Big|BigJsLibrary.BigJS} valueInBitcoin
     * @returns {Money}
     */
    static fromBitcoin(valueInBitcoin) {
        /**
         * @type {Big|BigJsLibrary.BigJS}
         */
        let value = Currency.toValueOrFail(valueInBitcoin);
        /**
         * @type {Class.<Currency>|undefined}
         */
        let currency = Currency.optCurrency(valueInBitcoin);

        if (currency) {
            Bitcoin.shouldBeBitcoin(currency);
        }

        return new Money({
            value: value,
            currency: Bitcoin
        });
    }

    /**
     *
     * @param {Money|String|Number|null|undefined} valueInSatoshis
     * @returns {Money}
     */
    static fromSatoshi(valueInSatoshis) {
        return Bitcoin.fromBitcoin(Currency.toValueOrFail(valueInSatoshis).div(Bitcoin.SATOSHIS_PER_BITCOIN));
    }

    /**
     * @return {BigJsLibrary.BigJS}
     * @readonly
     */
    static get SATOSHIS_PER_BITCOIN() {
        return STATIC_SATOSHI_PER_BITCOIN;
    }

    /**
     * @return {BigJsLibrary.BigJS}
     * @readonly
     */
    static get BITCOIN_PER_SATOSHI() {
        return STATIC_BITCOIN_PER_SATOSHI;
    }

    /**
     * @returns {Class<Bitcoin>}
     */
    static toClass() {
        return this;
    }

    /**
     * @returns {String}
     */
    static toString() {
        return 'Bitcoin';
    }

    //region Detection
    /**
     * Detects if you pass in either Money or Currency of type Bitcoin <br>
     * <br>
     * Bitcoin -> true <br>
     * money<Bitcoin> -> true <br>
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @return {Boolean}
     */
    static isBitcoin(moneyOrCurrency) {
        if (!moneyOrCurrency) {
            return false;
        }

        let currency = Currency.optCurrency(moneyOrCurrency);

        return Bitcoin.isClass(currency) || Bitcoin.isInstance(currency);
    }

    /**
     * If {@link Bitcoin#isBitcoin} returns false, will throw.
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @return {Class<Currency>}
     * @throws {PreconditionsError} if not an instance of Money (for Bitcoin) or the Bitcoin class itself.
     */
    static shouldBeBitcoin(moneyOrCurrency) {
        if (!Bitcoin.isBitcoin(moneyOrCurrency)) {
            Preconditions.fail(Bitcoin, Currency.optCurrency(moneyOrCurrency) || moneyOrCurrency);
        }

        return moneyOrCurrency;
    }

    //endregion

}

// /**
//  *
//  * @param {Money} money
//  * @param {Number} [places]
//  * @returns {String}
//  */
// static serialize(money, places) {
//     let value = this.toBitcoin();
//
//     if (isNaN(value)) {
//         return 'NaN';
//     }
//
//     if (!places) {
//         places = 8;
//     }
//
//     let parts = String(value).split('.');
//
//     if (parts.length === 1) {
//         parts.push('0');
//     }
//
//     let needed = places - parts[1].length;
//
//     for (let i = 0; i < needed; i++) {
//         parts[1] += '0';
//     }
//
//     return parts[0] + '.' + parts[1];
// }
// /**
//  *
//  * @param number
//  * @returns {Number}
//  */
// static calculateSatoshisFromBitcoin(number) {
//     Preconditions.shouldBeDefined(Currency);
//     number = Currency.toValueOrFail(number);
//
//     if (isNaN(number)) {
//         return NaN;
//     }
//
//     if (number === 0) {
//         return 0;
//     }
//
//     let str = String(number);
//     let sign = (str.indexOf('-') === 0) ? '-' : '';
//
//     str = str.replace(/^-/, '');
//
//     if (str.indexOf('e') >= 0) {
//         return parseInt(sign + str.replace('.', '').replace(/e-8/, '').replace(/e-7/, '0'), 10);
//     } else {
//         if (!(/\./).test(str)) {
//             str += '.0';
//         }
//
//         let parts = str.split('.');
//
//         str = parts[0] + '.' + parts[1].slice(0, 8);
//
//         while (!(/\.[0-9]{8}/).test(str)) {
//             str += '0';
//         }
//
//         return parseInt(sign + str.replace('.', '').replace(/^0+/, ''), 10);
//     }
// }

// Currency.types.register('Bitcoin', Bitcoin);
// Currency.types.register('btc', Bitcoin);

export default Bitcoin;