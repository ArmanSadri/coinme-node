import CoreObject from "../CoreObject";
import Utility from "../Utility";
import Preconditions from "../Preconditions";
import Currency from "./Currency";
import Big from 'big.js/big';

export default class Money extends CoreObject {

    /**
     * @param {Object} options
     * @param {BigJsLibrary.BigJS} options.value
     */
    constructor(options) {
        Preconditions.shouldBeDefined(Currency);

        let value = Currency.toValueOrFail(Utility.take(options, 'value'));
        let currency = Preconditions.shouldBeDefined(Currency.getCurrency(Utility.take(options, 'currency')));

        super(...arguments);

        /**
         * @type {BigJsLibrary.BigJS}
         * @private
         */
        Preconditions.shouldBe(function() { return (value instanceof Big); }, Utility.typeOf(Big), Utility.typeOf(value), 'should be Big');
        this._value = value;

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
     * @returns {BigJsLibrary.BigJS}
     */
    get value() {
        return this._value;
    }

    /**
     * @returns {string}
     */
    toString() {
        return `${this.value} ${this.currency}`;
    }

    /**
     *
     * @returns {{value, currency}|{value: BigJsLibrary.BigJS, currency: Class.<Currency>}}
     */
    toJson() {
        return super.toJson({
            value: Utility.optString(this.value),
            currency: this.currency.toString()
        });
    }

    /**
     * @returns {{value, currency}|{value: BigJsLibrary.BigJS, currency: Class.<Currency>}}
     */
    toJSON() {
        return this.toJson();
    }

    /**
     * Returns a new instance of money, since this is immutable.
     *
     * @param {String|Number|Money} money
     * @return {Money}
     */
    plus(money) {
        let big1 = this._toValue(money);
        let big2 = this._toValue(this);

        let big3 = big1.plus(big2);

        return this.withValue(big3);
    }

    /**
     * Returns a new instance of money, since this is immutable.
     *
     * @param {String|Number|Money} money
     * @return {Money}
     */
    minus(money) {
        return this.withValue(this._toValue(money) - this.value);
    }

    /**
     * @param {Money|String|Number} money
     * @returns {boolean}
     */
    equals(money) {
        if (!money) {
            return false;
        }

        /**
         * @type {BigJsLibrary.BigJS}
         */
        let value1 = this._toValue(money);

        /**
         * @type {BigJsLibrary.BigJS}
         */
        let value2 = this._toValue(this);

        return value1.eq(value2);
    }

    /**
     *
     * @param {Money|Currency} currencyOrMoney
     * @returns {boolean}
     */
    isSameCurrency(currencyOrMoney) {
        let c1 = Preconditions.shouldBeExisting(Currency.getCurrency(currencyOrMoney));
        let c2 = Preconditions.shouldBeExisting(Currency.getCurrency(this));

        return c1.equals(c2) && c2.equals(c1);
    }

    valueOf() {
        return this.value;
    }

    /**
     *
     * @param {Number} value
     * @returns {Money}
     * @private
     */
    withValue(value) {
        if (!value) {
            value = 0;
        }

        return new Money({
            currency: this.currency,
            value: value
        });
    }

    /**
     *
     * @param {Money} money
     * @return {BigJsLibrary.BigJS}
     * @private
     */
    _toValue(money) {
        money = Money.shouldBeMoney(Money.optMoney(money, this.currency));

        let that = this;
        Preconditions.shouldBe(function() { return that.isSameCurrency(money); }, this.currency, Currency.optCurrency(money), 'Must be the same currency.');

        return Currency.toValueOrFail(money);
    }

    /**
     * @returns {string}
     */
    static toString() {
        return 'Money';
    }

    /**
     *
     * @param {Money} money
     * @return {Class<Currency>}
     */
    static toCurrency(money) {
        Money.shouldBeInstance(money);

        return money.currency;
    }

    /**
     *
     * @param {Class<Money>|Money|Class<Currency>|Currency} object
     * @param {Class<Currency>|Currency} [currency] Optional. If provided, required.
     * @returns {Money}
     */
    static shouldBeMoney(object, currency) {
        Preconditions.shouldBeDefined(object);

        if (CoreObject.isClass(object)) {
            Preconditions.shouldBeClass(object, Money, 'object should be money: ' + object);

            if (Utility.isDefined(currency)) {
                throw new Error(`Money cannot convert to Currency`);
            }
        } else {
            Preconditions.shouldBeInstance(object, Money, 'object should be money: ' + object);

            if (currency) {
                Money.getCurrency(object);

                Currency.shouldBeClass(currency);
                Preconditions.shouldBeClass(object.currency, currency);
            }
        }

        return object;
    }

    /**
     *
     * @param {Big|Number|String|Money} valueOrMoney
     * @param {Class<Currency>} [defaultCurrency]
     * @returns {Money|undefined}
     */
    static optMoney(valueOrMoney, defaultCurrency) {
        if (Money.isInstance(valueOrMoney)) {
            return valueOrMoney;
        }

        return new Money({
            value: Currency.toValueOrFail(valueOrMoney),
            currency: defaultCurrency
        });
    }

    static optValue(money) {
        return Currency.optValue(money);
    }

    /**
     *
     * @param {Money} money
     * @param {Class<Currency>|Currency|Money|String} [destinationCurrency]
     * @return {Boolean}
     */
    static isInstance(money, destinationCurrency) {
        if (!super.isInstance(money)) {
            return false;
        }

        if (destinationCurrency) {
            /**
             * @type {Class.<Currency>}
             */
            let currency = Currency.getCurrency(destinationCurrency);

            /**
             * @type {Currency}
             */
            return currency.equals(money.currency);
        } else {
            return true;
        }
    }
}