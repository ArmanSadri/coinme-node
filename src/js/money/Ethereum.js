'use strict';

import Preconditions from "../Preconditions";
import Currency from "./Currency";
import Money from "./Money";

/**
 * Represents the Ethereum currency in memory.
 *
 * This class cannot be instantiated. Everything is static and the constructor throws, so treat it like a singleton.
 *
 * @beta
 * @class Ethereum
 */
class Ethereum extends Currency {

    /**
     *
     * @param {Money|String|Number|null|undefined} valueInEthereum
     * @returns {Money}
     */
    static fromEthereum(valueInEthereum) {
        /**
         * @type {Number}
         */
        let value = Currency.toValueOrFail(valueInEthereum);
        /**
         * @type {Class.<Currency>|undefined}
         */
        let currency = Currency.optCurrency(valueInEthereum);

        if (currency) {
            Ethereum.shouldBeEthereum(currency);
        }

        return new Money({
            value: value,
            currency: Ethereum
        });
    }

    //region Detection
    /**
     * Detects if you pass in either Money or Currency of type Ethereum <br>
     * <br>
     * Ethereum -> true <br>
     * money<Ethereum> -> true <br>
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @return {Boolean}
     */
    static isEthereum(moneyOrCurrency) {
        if (!moneyOrCurrency) {
            return false;
        }

        let currency = Currency.optCurrency(moneyOrCurrency);

        return Ethereum.isClass(currency) || Ethereum.isInstance(currency);
    }

    /**
     * If {@link Ethereum#isEthereum} returns false, will throw.
     *
     * @param {Money|Currency|Class<Currency>} moneyOrCurrency
     * @return {Class<Currency>}
     * @throws {PreconditionsError} if not an instance of Money (for Ethereum) or the Ethereum class itself.
     */
    static shouldBeEthereum(moneyOrCurrency) {
        if (!Ethereum.isEthereum(moneyOrCurrency)) {
            Preconditions.fail(Ethereum, Currency.optCurrency(moneyOrCurrency) || moneyOrCurrency);
        }

        return moneyOrCurrency;
    }

    //endregion

    static toString() {
        return 'Ethereum';
    }

}

// Currency.types.register('Ethereum', Ethereum);
// Currency.types.register('ETH', Ethereum);

export default Ethereum;