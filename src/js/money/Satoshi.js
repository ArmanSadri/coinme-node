'use strict';

import Currency from "./Currency";
import Money from "./Money";
import Bitcoin from "./Bitcoin";

/**
 * @class Satoshi
 */
export default class Satoshi extends Currency {

    /**
     * @returns {Converter}
     */
    static get converter() {
        return Bitcoin.converter;
    }

    /**
     * @param {Converter} value
     */
    static set converter(value) {
        Bitcoin.converter = value;
    }

    /**
     *
     * @param {Number|String} valueInSatoshis
     * @return {Money}
     */
    static fromSatoshis(valueInSatoshis) {
        return Satoshi.create(valueInSatoshis);
    }

    /**
     *
     * @param valueInBitcoinOrMoney
     */
    static fromBitcoin(valueInBitcoinOrMoney) {
        let bitcoin = Bitcoin.fromBitcoin(valueInBitcoinOrMoney);

        return Satoshi
            .converter
            .convert(bitcoin, Satoshi);
    }

    static toString() {
        return 'Satoshi';
    }
}