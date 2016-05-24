'use strict';

import {Utility, Preconditions} from "~/";
import Currency from "./Currency";
import Money from "./Money";
import Bitcoin from "./Bitcoin";


/**
 * @class Bitcoin
 */
export default class Satoshi extends Currency {

    constructor() {
        super(...arguments);
    }

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
        if (Money.isInstance(valueInSatoshis)) {
            Currency.shouldBeCurrency(Currency.getCurrency(valueInSatoshis), Satoshi);
        }

        return new Money({
            currency: Satoshi,
            value: Currency.toValueOrFail(valueInSatoshis)
        });
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


    static convertTo(valueOrMoney, currency) {
        Currency.shouldBeCurrency(currency);

        let satoshis = Satoshi.create(valueOrMoney);
        let converter = this.converter.convert(satoshis, currency);
    }

    static toString() {
        return 'Satoshi';
    }
}