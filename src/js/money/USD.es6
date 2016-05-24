'use strict';

import { Utility, Preconditions } from "~/";
import Currency from './Currency';
import Satoshi from './Satoshi';
import Money from './Money';
import Lodash from "lodash";
import Converter from './Converter';

/**
 * @class Bitcoin
 */
export default class USD extends Currency {

    static toString() {
        return 'USD';
    }

    //region Detection
    /**
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     */
    static isUSD(moneyOrCurrency) {
        return USD.isClass(Currency.getCurrency(moneyOrCurrency));
    }

    /**
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     */
    static shouldBeUSD(moneyOrCurrency) {
        let currency = Currency.getCurrency(moneyOrCurrency);
        let desiredCurrency = USD;

        if (!desiredCurrency.isClass(currency)) {
            console.log('currency=>', currency);
            Preconditions.fail(desiredCurrency, currency);
        }

        return moneyOrCurrency;
    }
    //endregion

}