'use strict';

import Currency from "./Currency";
import Money from "./Money";
import Bitcoin from "./Bitcoin";

/**
 * @class Satoshi
 */
export default class Satoshi extends Currency {

    /**
     * @param {Number|String|Big|BigJsLibrary.BigJS} valueInSatoshis
     * @return {Money}
     */
    static create(valueInSatoshis) {
        /**
         * @type {Big}
         */
        let value = Currency.toValueOrFail(valueInSatoshis);

        return new Money({
            value: value,
            currency: this
        });
    }

    /**
     * @param {Money|Number|String|Big|BigJsLibrary.BigJS} valueInSatoshis
     * @return {Money}
     */
    static fromSatoshis(valueInSatoshis) {
        return Satoshi.create(valueInSatoshis);
    }

    /**
     * @param {Number|String|Money|Big|BigJsLibrary.BigJS} valueInBitcoinOrMoney
     * @return {Money}
     */
    static fromBitcoin(valueInBitcoinOrMoney) {
        let bitcoin = Currency.toValueOrFail(valueInBitcoinOrMoney);

        return Satoshi.fromSatoshis(bitcoin.times(Bitcoin.SATOSHIS_PER_BITCOIN));
    }

    static toString() {
        return 'Satoshi';
    }
}