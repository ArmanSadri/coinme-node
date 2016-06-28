import Utility from "./Utility";
import CoreObject from "./CoreObject";
import URI from "urijs";
import altcoin from "altcoin-address";
import Preconditions from "~/Preconditions";

let VALIDATORS = {

    /**
     * @param {URI|null|String} uri
     */
    'general': function (uri) {
        if (!uri) {
            return false;
        }

        if (Utility.isString(uri)) {
            let index = uri.indexOf(":/");

            if (-1 === index) {
                return false;
            }

            let protocol = uri.substring(0, index);
            let rest = uri.substring(index + 2);

            uri = new URI(protocol + "://" + rest);
        }

        let scheme = uri.scheme();
        let host = uri.host();

        return !(Utility.isBlank(scheme) || Utility.isBlank(host));
    },

    /**
     * @param {URI} uri
     * @returns {*}
     */
    'bitcoin': function (uri) {
        return altcoin.validate(Utility.optString(uri));
    }
};

/**
 * A class for uniquely identifying something.
 */
export default class Address extends CoreObject {

    /**
     *
     * @param {URI|String|Object} options
     * @param {Function} [options.validator]
     * @param {Boolean} [options.strict] Set to false to skip validation.
     */
    constructor(options) {
        if (Utility.isString(options)) {
            options = {value: options};
        } else if (options instanceof URI) {
            options = {value: options};
        }

        /**
         * @type {String|URI}
         */
        let value = Utility.take(options, 'value');
        let validator = Utility.take(options, 'validator');
        let strict = Utility.take(options, 'strict');

        Preconditions.shouldBeDefined(value, 'Cannot construct an empty Address.');

        Preconditions.shouldBeTrue(
            Preconditions.shouldBeFunction(
                VALIDATORS['general'], 'general validator is required')
            (value),
            'general validator failed for: ' + value
        );

        super(options);

        this._uri = URI(value);
        this._validator = validator || VALIDATORS[Utility.toLowerCase(this.resource)];
        this._strict = (false === strict);

        if (this._strict) {
            // Require Validation
            Preconditions.shouldBeFunction(this.validator, 'validator not found for \'' + this.toString() + '\'');
            Preconditions.shouldBeTrue(this.valid, 'not valid');
        }
    }

    get strict() {
        return this._strict;
    }

    get value() {
        return this.uri.host();
    }

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
        if (Utility.isUndefined(this._valid) && this.validator) {
            this._valid = this.validator(this.uri);
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
}