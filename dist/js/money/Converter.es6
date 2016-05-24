'use strict';

import {Money, Currency, Bitcoin, Satoshi} from "~/money";
import {CoreObject, Preconditions, Utility} from "~/";

/**
 * Supports different conversion directions.
 *
 * The conversion map uses the Currency name for directionality. The internal conversion map is stored like:
 *
 * {
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }
 * }
 *
 * @class
 */
export default class Converter extends CoreObject {

    /**
     * @param {Object} options
     * @param {Object} options.conversions
     */
    constructor(options) {
        let conversions = Utility.take(options, 'conversions');

        super(...arguments);

        /**
         * @type {Object}
         */
        this._conversions = conversions || {};
    }

    get conversions() {
        return this._conversions;
    }

    /**
     * @param {Money|Currency|Class<Currency>|String} sourceCurrency
     * @param {Money|Currency|Class<Currency>|String} destinationCurrency
     *
     * @return {Function}
     */
    getConversion(sourceCurrency, destinationCurrency) {
        sourceCurrency = Currency.getCurrency(sourceCurrency);
        destinationCurrency = Currency.getCurrency(destinationCurrency);

        let converterName = sourceCurrency.toString() + '->' + destinationCurrency.toString();
        let fn = this.conversions[converterName];

        Preconditions.shouldBeFunction(fn, 'Converter not found: ' + converterName + ' with ' + JSON.stringify(this.conversions));

        return fn;
    }

    /**
     *
     * @param {Money} money
     * @param {Class<Currency>|Currency} currency
     * @returns {Money}
     */
    convert(money, currency) {
        currency = Currency.getCurrency(currency);

        let fn = this.getConversion(money.currency, currency);

        let value = fn(money.value);

        return new Money({
            value: value,
            currency: currency
        });
    }

    /**
     *
     * @param {Currency} sourceCurrency
     * @param {Currency} destinationCurrency
     * @param {Function} conversionFn
     * @returns {Converter}
     */
    registerConversion(sourceCurrency, destinationCurrency, conversionFn) {
        Currency.shouldBeCurrency(sourceCurrency);
        Currency.shouldBeCurrency(destinationCurrency);
        Preconditions.shouldBeFunction(conversionFn);

        let conversionName = sourceCurrency.toString() + '->' + destinationCurrency.toString();

        this.conversions[conversionName] = conversionFn;

        return this;
    }
}