'use strict';

import {Money, Currency, Bitcoin, Satoshi} from "~/money";
import {CoreObject, Preconditions, Utility} from "~/";
import Lodash from 'lodash';

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

    canConvert(currency1, currency2, optionalConversion) {
        currency1 = Currency.optCurrency(currency1);
        currency2 = Currency.optCurrency(currency2);

        let conversion = this.optConversion(currency1, currency2, optionalConversion);

        return Utility.isFunction(conversion);
    }

    /**
     *
     * @param {Money} money
     * @param {Class<Currency>|Currency} currency
     * @param {Function} [optionalConversion]
     * @returns {Money}
     */
    convert(money, currency, optionalConversion) {
        currency = Currency.getCurrency(currency);

        let fn = this.optConversion(money.currency, currency, optionalConversion);
        let scope = (Converter.isInstance(optionalConversion)) ? optionalConversion : this;
        let value = fn.call(scope, money.value);
        
        Preconditions.shouldBeNumber(value, 'Sanity check failure, the value should be a number: ' + value);

        return new Money({
            value: value,
            currency: currency
        });
    }

    /**
     *
     * @param {Class<Currency>|Currency|String} sourceCurrency
     * @param {Class<Currency>|Currency|String} destinationCurrency
     * @param {Function|Number|String|Converter} [optionalConversion]
     *
     * @returns {Function}
     */
    optConversion(sourceCurrency, destinationCurrency, optionalConversion) {
        sourceCurrency = Currency.optCurrency(sourceCurrency);
        destinationCurrency = Currency.optCurrency(destinationCurrency);

        if (!sourceCurrency || !destinationCurrency) {
            return null;
        } else if (sourceCurrency.equals(destinationCurrency)) {
            return function(value) { return value; }
        } else if (Utility.isFunction(optionalConversion)) {
            return optionalConversion;
        } else if (Utility.isNumber(optionalConversion)) {
            return function(value) { return value * optionalConversion; }
        } else if (Converter.isInstance(optionalConversion)) {
            return this._getConversion(optionalConversion, sourceCurrency, destinationCurrency);
        } else {
            return this._getConversion(this, sourceCurrency, destinationCurrency);
        }
    }

    /**
     *
     *
     * @param {Object} conversions
     * @returns {Converter}
     */
    register(conversions) {
        Preconditions.shouldBeObject(conversions);

        Lodash.assign(this.conversions, conversions);

        return this;
    }

    /**
     * @param {Converter} converter
     * @param {Money|Currency|Class<Currency>|String} sourceCurrency
     * @param {Money|Currency|Class<Currency>|String} destinationCurrency
     * @private
     * @return {Function}
     */
    _getConversion(converter, sourceCurrency, destinationCurrency) {
        sourceCurrency = Currency.getCurrency(sourceCurrency);
        destinationCurrency = Currency.getCurrency(destinationCurrency);

        let converterName = sourceCurrency.toString() + '->' + destinationCurrency.toString();
        let fn = converter.conversions[converterName];

        Preconditions.shouldBeFunction(fn, 'Converter not found: ' + converterName);

        return fn;
    }
}