import Utility from "./Utility";
import CoreObject from "./CoreObject";
import URI from "urijs";
import altcoin from "altcoin-address";
import Preconditions from "~/Preconditions";
import {NotImplementedError} from "./errors";

let VALIDATORS = {

    /**
     * @param {Address} address
     */
    'general': function (address) {
        Preconditions.shouldBeInstance(address, Address);

        return !(Utility.isBlank(address.resource) || Utility.isBlank(address.value));
    },

    /**
     * @param {Address} address
     * @returns {boolean}
     */
    'bitcoin': function (address) {
        Preconditions.shouldBeInstance(address, Address);

        if (address.resource !== 'bitcoin') {
            return false;
        }

        return altcoin.validate(address.value, 'bitcoin');
    }
};

/**
 * A class for uniquely identifying something.
 */
class Address extends CoreObject {

    /**
     *
     * @param {URI|String|Object} options
     * @param {String} [options.value]
     * @param {Function} [options.validator]
     * @param {Boolean} [options.strict] Set to false to skip validation.
     */
    constructor(options) {
        if (Utility.isString(options)) {
            options = {value: options};
        } else if (options instanceof URI) {
            options = {value: options};
        } else if (options instanceof Address) {
            /**
             * @type {Address}
             */
            let address = options;

            options = {
                value: address.value,
                validator: address.validator,
                strict: address.strict
            }
        }

        /**
         * @type {String|URI}
         */
        let value = Utility.take(options, 'value');
        let validator = Utility.take(options, 'validator');
        let strict = Utility.take(options, 'strict');

        Preconditions.shouldBeDefined(value, 'Cannot construct an empty Address.');

        super(options);

        this._uri = Address.toUri(value);
        this._validator = validator || VALIDATORS[Utility.toLowerCase(this.resource)];
        this._strict = (false === strict);

        {
            let generalValidator = Preconditions.shouldBeFunction(VALIDATORS['general'], 'general validator is required');

            Preconditions.shouldBeTrue(generalValidator(this), 'general validator failed for: ' + value);
        }

        if (this.strict) {
            // Require Validation
            Preconditions.shouldBeFunction(this.validator, 'validator not found for \'' + this.toString() + '\'');
            Preconditions.shouldBeTrue(this.valid, 'not valid');
        }
    }

    /**
     * @return {boolean}
     */
    get strict() {
        return this._strict;
    }

    /**
     * [resource]:/[value]
     *
     * @return {String}
     */
    get value() {
        return this.uri.host();
    }

    /**
     * [resource]:/[value]
     *
     * @return {String}
     */
    get resource() {
        return this.uri.scheme();
    }

    /**
     * @returns {URI}
     */
    get uri() {
        return this._uri;
    }

    /**
     *
     * @returns {Boolean}
     */
    get valid() {
        if (Utility.isUndefined(this._valid)) {
            if (this.validator) {
                this._valid = this.validator(this);
            } else {
                this._valid = true; // because it passed general.
            }
        }

        return this._valid;
    }

    /**
     * @returns {Function}
     */
    get validator() {
        return this._validator;
    }

    /**
     *
     * @returns {String}
     */
    toString() {
        return this.valueOf();
    }

    /**
     * @returns {String}
     */
    valueOf() {
        return this._uri.toString();
    }

    toJson() {
        return super.toJson({
            value: Utility.optString(this)
        })
    }

    /**
     * @returns {String}
     */
    static toString() {
        return 'Address';
    }

    /**
     * @param {String} scheme
     * @param {Function} validatorFn
     */
    static registerValidator(scheme, validatorFn) {
        scheme = Preconditions.shouldNotBeBlank(Utility.toLowerCase(Preconditions.shouldBeString(scheme)));
        validatorFn = Preconditions.shouldBeFunction(validatorFn);

        VALIDATORS[Utility.toLowerCase(scheme)] = validatorFn;

        return validatorFn;
    }

    /**
     *
     * @param {String|Address|URI} stringOrAddressOrUri
     * @return {Address|null}
     */
    static toAddress(stringOrAddressOrUri) {
        if (Utility.isString(stringOrAddressOrUri) || (stringOrAddressOrUri instanceof URI)) {
            return new Address(stringOrAddressOrUri);
        } else if (Address.isInstance(stringOrAddressOrUri)) {
            return stringOrAddressOrUri;
        } else {
            throw new NotImplementedError(`Cannot handle ${stringOrAddressOrUri}`);
        }
    }

    /**
     *
     * @param {String|Address|URI} stringOrAddressOrUri
     * @param {String} [defaultScheme]
     * @return {Address}
     */
    static toAddressWithDefaultScheme(stringOrAddressOrUri, defaultScheme) {
        if (Utility.isString(stringOrAddressOrUri)) {
            return new Address(Address.toUriWithDefaultScheme(stringOrAddressOrUri, defaultScheme));
        } else {
            return Address.toAddress(stringOrAddressOrUri);
        }
    }

    /**
     *
     * @param {String|Address|URI} stringOrAddressOrUri
     * @param {String} [defaultScheme]
     * @return {URI}
     */
    static toUriWithDefaultScheme(stringOrAddressOrUri, defaultScheme) {
        if (Utility.isNullOrUndefined(stringOrAddressOrUri)) {
            return null;
        } else if (stringOrAddressOrUri instanceof URI) {
            return stringOrAddressOrUri;
        } else if (Utility.isString(stringOrAddressOrUri)) {
            if (~stringOrAddressOrUri.indexOf('://')) {
                let u = new URI(stringOrAddressOrUri);

                return new URI(u.scheme() + "://" + u.host());
            }

            let index = stringOrAddressOrUri.indexOf(":/");

            if (-1 === index) {
                if (!Utility.isBlank(defaultScheme)) {
                    stringOrAddressOrUri = defaultScheme + ':/' + stringOrAddressOrUri;

                    index = defaultScheme.length;
                } else {
                    return new URI(stringOrAddressOrUri);
                }
            }

            let protocol = stringOrAddressOrUri.substring(0, index);
            let rest = stringOrAddressOrUri.substring(index + 2);

            console.log('test', stringOrAddressOrUri, protocol, rest);

            return new URI(protocol + "://" + rest);
        } else {
            throw new NotImplementedError('Do not know how to handle: ' + stringOrAddressOrUri);
        }
    }

    /**
     *
     * @param {String|URI|null|undefined} uri
     * @return {URI}
     */
    static toUri(uri) {
        return Address.toUriWithDefaultScheme(uri);
    }
}

export {Address};
export default Address;