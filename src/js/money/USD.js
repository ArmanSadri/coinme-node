'use strict';

import {Utility, Preconditions} from "~/";
import Currency from "./Currency";
import Money from "./Money";

/**
 * @class USD
 */
export default class USD extends Currency {

    /**
     *
     * @returns {String}
     */
    static toString() {
        return 'USD';
    }

    /**
     * @returns {Class<USD>}
     */
    static toClass() {
        return USD;
    }

    //region Detection
    /**
     * Detects if
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @return {Boolean}
     */
    static isUSD(moneyOrCurrency) {
        let currency = Currency.optCurrency(moneyOrCurrency) || moneyOrCurrency;

        return USD.isClass(currency) || USD.isInstance(currency);
    }

    /**
     * Determines if {@link USD#isUSD} returns true
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @throws {PreconditionsError} if not the right currency type
     */
    static shouldBeUSD(moneyOrCurrency) {
        if (!this.isUSD(moneyOrCurrency)) {
            Preconditions.fail(USD, moneyOrCurrency, 'Must be USD');
        }

        return moneyOrCurrency;
    }

    //endregion

}