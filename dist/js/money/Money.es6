import Lodash from 'lodash';
import { Utility, Preconditions, CoreObject } from '~/';
import Currency from './Currency';

export default class Money extends CoreObject {

    /**
     * @param {Object} options
     * @param {Number} options.value
     */
    constructor(options) {
        Preconditions.shouldBeDefined(Currency);

        let value = Preconditions.shouldBeNumber(Currency.toValueOrFail(Utility.take(options, 'value')));
        let currency = Preconditions.shouldBeDefined(Currency.getCurrency(Utility.take(options, 'currency')));

        super(...arguments);

        /**
         * @type {Number}
         * @private
         */
        this._value = Preconditions.shouldBeNumber(value);

        /**
         * @type {Class<Currency>}
         * @private
         */
        this._currency = Currency.shouldBeCurrency(currency);
    }

    /**
     *
     * @returns {Class<Currency>}
     */
    get currency() {
        return this._currency;
    }

    /**
     * @returns {Number}
     */
    get value() {
        return this._value;
    }

    toString() {
        return this.currency.toString(this);
    }

    toJson() {
        return this.currency.toJson(this);
    }

    /**
     * Returns a new instance of money, since this is immutable.
     *
     * @param {String|Number|Money} money
     * @return {Money}
     */
    add(money) {
        money = Money.optMoney(money, this.currency);
        let convertedValue = this.currency.convertFrom(money).value;

        return new Money({
            currency: this.currency,
            value: convertedValue + this.value
        });
    }

    /**
     *
     * @param {Currency|Class<Currency>|String} currencyOrString
     */
    convertTo(currencyOrString) {
        let currency = Currency.getCurrency(currencyOrString);

        return currency.convertFrom(this);
    }

    /**
     *
     * @param {Number|String|Money} valueOrMoney
     * @param {Class<Currency>} [defaultCurrency]
     * @returns {Money|undefined}
     */
    static optMoney(valueOrMoney, defaultCurrency) {
        if (Money.isInstance(valueOrMoney)) {
            return valueOrMoney;
        }

        Currency.shouldBeCurrency(defaultCurrency, 'must be currency' + defaultCurrency);
        
        return new Money({
            value: valueOrMoney,
            currency: defaultCurrency
        });
    }
}