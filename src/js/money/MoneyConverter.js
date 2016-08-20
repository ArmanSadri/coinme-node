'use strict';

import Money from "./Money";
import Currency from "./Currency";
import Preconditions from "../Preconditions";
import Utility from "../Utility";
import Lodash from "lodash";
import {Converter, DelegatedConverter} from "../data";
import CurrencyAdapter from './CurrencyAdapter';

/**
 * Supports different conversion directions.
 *
 * The conversion map uses the Currency name for directionality. The internal conversion map is stored like:
 *
 * {<br>
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },<br>
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }<br>
 * }<br>
 *
 * @class
 */
class MoneyConverter extends DelegatedConverter {

    /**
     * @param {Object} options
     * @param {Object} options.conversions
     */
    constructor(options) {
        Utility.defaults(options, {
            adapter: new CurrencyAdapter()
        });

        super(...arguments);
    }

    /**
     * Determines if this Converter instance can convert between the two currencies.
     *
     * NOTE: The direction matters.
     *
     * @param {Class<Currency>|Currency|String} currency1
     * @param {Class<Currency>|Currency|String} currency2
     * @returns {boolean}
     */
    supports(currency1, currency2) {
        currency1 = Currency.optCurrency(currency1);
        currency2 = Currency.optCurrency(currency2);

        let conversion = this.optConversion(currency1, currency2, optionalConversion);

        return Utility.isFunction(conversion);
    }

    /**
     * Executes the conversion.
     *
     * @param {Money} sourceMoney
     * @param {Class<Currency>|Currency} destinationCurrency
     * @returns {Money}
     * @throws {PreconditionsError} if the converter fails to convert into a valid number
     * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
     * @throws {PreconditionsError} if converter cannot support the conversion
     */
    convert(sourceMoney, destinationCurrency) {
        return Money.shouldBeMoney(super.convert(sourceMoney, destinationCurrency), destinationCurrency);
    }

    /**
     * Detects the conversion function, given the inputs.
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
            return function (value) {
                return value;
            }
        } else if (Utility.isFunction(optionalConversion)) {
            return optionalConversion;
        } else if (Utility.isNumber(optionalConversion)) {
            return function (value) {
                return value * optionalConversion;
            }
        } else if (Converter.isInstance(optionalConversion)) {
            return this._getConversion(optionalConversion, sourceCurrency, destinationCurrency);
        } else {
            return this._getConversion(this, sourceCurrency, destinationCurrency);
        }
    }

    /**
     * Register a conversion with this converter. This must be a valid object.
     *
     * Example:
     *
     * {<br>
     *     'USD->Bitcoin': function() ...<br>
     * }<br>
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

export {MoneyConverter};
export default MoneyConverter;