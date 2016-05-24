'use strict';

import {Utility, Preconditions} from "~/";
import Currency from "./Currency";
import Satoshi from "./Satoshi";
import Money from "./Money";

/**
 * @private
 * @type {Converter}
 */
let conversions = {
    /**
     *
     * @param {Number} valueInBitcoin
     * @returns {Number}
     */
    'Bitcoin->Satoshi': function (valueInBitcoin) {
        Preconditions.shouldBeNumber(valueInBitcoin);

        return valueInBitcoin * Bitcoin.SATOSHIS_PER_BITCOIN
    },

    /**
     *
     * @param {Number} valueInSatoshi
     * @returns {Number}
     */
    'Satoshi->Bitcoin': function (valueInSatoshi) {
        Preconditions.shouldBeNumber(valueInSatoshi);

        return valueInSatoshi * Bitcoin.BITCOIN_PER_SATOSHI;
    }
};

// Register our known conversions.
Currency.converter.register(conversions);

/**
 * @class Bitcoin
 */
export default class Bitcoin extends Currency {

    static toString() {
        return 'Bitcoin';
    }

    /**
     *
     * @param {Money} money
     * @param {Number} [places]
     * @returns {String}
     */
    static serialize(money, places) {
        let value = this.toBitcoin();

        if (isNaN(value)) {
            return 'NaN';
        }

        if (!places) {
            places = 8;
        }

        let parts = String(value).split('.');

        if (parts.length === 1) {
            parts.push('0');
        }

        let needed = places - parts[1].length;

        for (let i = 0; i < needed; i++) {
            parts[1] += '0';
        }

        return parts[0] + '.' + parts[1];
    }

    /**
     *
     * @param {Money|String|Number|null|undefined} valueInBitcoin
     * @returns {Money}
     */
    static fromBitcoin(valueInBitcoin) {
        /**
         * @type {Number}
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
        return Satoshi.fromSatoshis(valueInSatoshis);
    }

    /**
     *
     * @param valueInBitcoin
     */
    static toSatoshis(valueInBitcoin) {
        return Satoshi.fromBitcoin(valueInBitcoin);
    }

    /**
     *
     * @param number
     * @returns {Number}
     */
    static calculateSatoshisFromBitcoin(number) {
        Preconditions.shouldBeDefined(Currency);
        number = Currency.toValueOrFail(number);

        if (isNaN(number)) {
            return NaN;
        }

        if (number === 0) {
            return 0;
        }

        let str = String(number);
        let sign = (str.indexOf('-') === 0) ? '-' : '';

        str = str.replace(/^-/, '');

        if (str.indexOf('e') >= 0) {
            return parseInt(sign + str.replace('.', '').replace(/e-8/, '').replace(/e-7/, '0'), 10);
        } else {
            if (!(/\./).test(str)) {
                str += '.0';
            }

            let parts = str.split('.');

            str = parts[0] + '.' + parts[1].slice(0, 8);

            while (!(/\.[0-9]{8}/).test(str)) {
                str += '0';
            }

            return parseInt(sign + str.replace('.', '').replace(/^0+/, ''), 10);
        }
    }

    /**
     * @return {Number}
     */
    static get SATOSHIS_PER_BITCOIN() {
        return 100000000;
    }

    /**
     * @return {number}
     */
    static get BITCOIN_PER_SATOSHI() {
        return 1 / 100000000;
    }

    static toClass() {
        return Bitcoin;
    }

    //region Detection
    /**
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     */
    static isBitcoin(moneyOrCurrency) {
        return Bitcoin.isClass(Currency.getCurrency(moneyOrCurrency));
    }

    /**
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     */
    static shouldBeBitcoin(moneyOrCurrency) {
        let currency = Currency.getCurrency(moneyOrCurrency);

        if (!Bitcoin.isClass(currency)) {
            console.log('currency=>', currency);
            Preconditions.fail(Bitcoin, currency);
        }

        return moneyOrCurrency;
    }

    //endregion

}