import {Utility, CoreObject, Preconditions} from "~/";
import Money from "./Money";
import Converter from "./Converter";

class Currency extends CoreObject {

    constructor() {
        super();

        if (this.constructor === Currency) {
            throw new TypeError('Cannot construct Currency instances directly');
        }
    }

    static create(value) {
        return Money.optMoney(
            Currency.toValueOrFail(value),
            Currency.optCurrency(value) || this.getChildCurrencyTypeOrFail());
    }

    static toString() {
        return 'Currency';
    }

    /**
     * @returns {Converter}
     */
    static get converter() {
        return this._converter;
    }

    /**
     *
     * @param {Converter} value
     */
    static set converter(value) {
        this._converter = value;
    }

    /**
     * @param {Money} money
     * @returns {*}
     */
    static convertFrom(money) {
        return money.currency.converter.convert(money, this.getChildCurrencyTypeOrFail());
    }

    static getChildCurrencyTypeOrFail() {
        var currency = this;

        Currency.shouldBeCurrency(currency);

        Preconditions.shouldBeFalsey(currency === Currency, 'Cannot be the Currency class directly. Use a subclass, like Bitcoin');

        return currency;
    }

    /**
     *
     * @param {Money|String|Number} valueOrMoney
     * @param {Currency} [defaultCurrency]
     * @returns {Money}
     */
    static toMoney(valueOrMoney, defaultCurrency) {
        let value = Currency.toValueOrFail(valueOrMoney);
        let currency = Currency.optCurrency(valueOrMoney) || Currency.optCurrency(defaultCurrency);

        if (!currency) {
            currency = this;
        }

        Currency.shouldBeCurrency(currency);

        if (Object.getPrototypeOf(currency) === Currency) {
            throw new Error('Cannot have myself as a currency. Must use a subclass, like Bitcoin');
        }

        return new Money({
            value: value,
            currency: this
        });
    }

    /**
     * @param {Class<Currency>|Currency|Object} objectOrCurrency
     * @return {Class<Currency>}
     * @throws error if not a currency type
     */
    static getCurrency(objectOrCurrency) {
        let instance = Currency.optCurrency(objectOrCurrency);

        Currency.shouldBeCurrency(instance);

        return instance;
    }

    /**
     * @param {Class<Currency>|Currency|Object|Money|String} objectOrCurrency
     * @return {Class<Currency>|undefined}
     */
    static optCurrency(objectOrCurrency) {
        if (Currency.isCurrency(objectOrCurrency)) {
            return objectOrCurrency;
        } else if (Currency.isInstance(objectOrCurrency)) {
            console.log('object', objectOrCurrency);
            return objectOrCurrency.toClass();
        } else if (Money.isInstance(objectOrCurrency)) {
            return objectOrCurrency.currency;
        }

        return undefined;
    }

    // static toString(numberOrStringOrMoney, currencyInstanceOrClass) {
    //     Preconditions.shouldBeDefined(Money, 'money should be defined!');
    //
    //     let currency;
    //     let value;
    //
    //     if (numberOrStringOrMoney instanceof Money) {
    //         currency = numberOrStringOrMoney.currency;
    //         value = numberOrStringOrMoney.value;
    //     } else {
    //         currency = Currency.getCurrency(currencyInstanceOrClass);
    //         value = Currency.toValueOrFail(numberOrStringOrMoney);
    //     }
    //
    //     Preconditions.shouldBeDefined(currency);
    //     Currency.shouldBeCurrency(currency);
    //
    //     return currency.toString(value);
    // }

    /**
     *
     * @param {*} clazz
     * @param {String} [message]
     *
     * @returns {Class<Currency>}
     */
    static shouldBeCurrency(clazz, message) {
        Preconditions.shouldBeClass(clazz, Currency, 'Must be currency: ' + message);

        return clazz;
    }

    /**
     *
     * @param {Class<Currency>|Currency|Object|*} object
     * @returns {boolean}
     */
    static isCurrency(object) {
        if (Currency.isClass(object)) {
            return true;
        }

        if (Currency.isInstance(object)) {
            return true;
        }

        return false;
    }

    /**
     * If the type is correct, will unwrap to the value.
     * If the type is not correct, will throw an exception.
     *
     * @type {Money|Number|String|undefined|null}
     * @return {Number}
     * @throws err if not correct type.
     */
    static toValueOrFail(numberOrMoney) {
        if (Utility.isNullOrUndefined(numberOrMoney)) {
            return 0;
        } else if (Money.isInstance(numberOrMoney)) {
            return numberOrMoney.value;
        } else if (Utility.isNumber(numberOrMoney)) {
            return numberOrMoney;
        } else if (Utility.isString(numberOrMoney)) {
            return parseFloat(numberOrMoney);
        } else {
            console.log(numberOrMoney);

            Preconditions.fail('Number|Currency', Utility.typeOf(numberOrMoney), 'This method fails with the wrong type.');
        }
    }

    static toClass() {
        return Currency;
    }

}

export default Currency;
