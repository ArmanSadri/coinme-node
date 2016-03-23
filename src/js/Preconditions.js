'use strict';

import Utility from '~/Utility';
import Lodash from 'lodash/index';
import preconditions from 'preconditions';

/**
 *
 * @param {*} actualValue
 * @param {*} expectedValue
 * @param {String} [message]
 * @param {Error} [optionalCause]
 * @class
 * @constructor
 */
function PreconditionsError(expectedValue, actualValue, message, optionalCause) {
    var error = Error.call(this, message);

    this.name = 'PreconditionsError';
    this.stack = error.stack;
    this.cause = optionalCause;

    this.expectedValue = expectedValue || '';
    this.actualValue = actualValue || '';

    this.message = `failure (expected: ${this.expectedValue}) (actual: ${this.actualValue}) (message: ${this.message})`;
}

PreconditionsError.prototype = Object.create(Error.prototype);
PreconditionsError.prototype.constructor = PreconditionsError;

export { PreconditionsError }

let $ = preconditions.singleton();

/**
 * @singleton
 * @class Preconditions
 */
export default class Preconditions {

    /**
     *
     * @param {*} expectedValue
     * @param {*} actualValue
     * @param {String} [message]
     */
    static fail(expectedValue, actualValue, message) {
        throw new PreconditionsError(expectedValue, actualValue, message || 'Preconditions failure');
    }

    /**
     *
     * @param {*} object
     * @param {String} [message]
     * return {*} object
     */
    static shouldBeUndefined(object, message) {
        return this.shouldBe(object, Utility.isUndefined, 'undefined', message || 'must be undefined');
    }

    /**
     *
     * @param {*} object
     * @param {String} [message]
     * @returns {*}
     */
    static shouldNotBeFalsey(object, message) {
        return this.shouldBe(object, Utility.isFalsey, message, 'must be falsey');
    }

    /**
     * This method checks for UNDEFINED, NAN, and NULL
     *
     * @param {*} object
     * @param {String} [message]
     * @return {*}
     */
    static shouldBeDefined(object, message) {
        if (Lodash.isUndefined(object)) {
            this.fail('defined', 'undefined', message || 'must be defined.');
        }

        return object;
    }

    /**
     * Make sure an object is not: undefined, null, NaN
     *
     * @param {*} object
     * @param {String} [message]
     */
    static shouldBeExisting(object, message) {
        return this.shouldBe(Utility.exists, 'exist', object, message || 'must exist.');
    }

    /**
     *
     * @param {*} string
     * @param {String} [message]
     * @return {String}
     */
    static shouldNotBeBlank(string, message) {
        this.shouldBeString(string);

        return this.shouldBe(Utility.isNotBlank, 'not blank', string, message || 'must not be blank.');
    }

    /**
     *
     * @param {*} fn
     * @param {String} [message]
     * @return {function}
     */
    static shouldBeFunction(fn, message) {
        return this.shouldBeType('function', fn, message);
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @return {Number}
     */
    static shouldBeNumber(number, message) {
        this.shouldBeType(number, 'number', message);
        this.shouldBeFinite(number, message);

        return number;
    }

    /**
     *
     * @param {function} testFn
     * @param {*} [expectedValue]
     * @param {*} actualValue
     * @param {String} [message]
     * @returns {*}
     */
    static shouldBe(testFn, expectedValue, actualValue, message) {
        if (!Utility.isFunction(testFn)) {
            throw new Error(Utility.typeOf(testFn));

            this.fail('function', testFn, 'must be function.');
        }

        if (!testFn.call(this, actualValue)) {
            this.fail(expectedValue, actualValue, message || 'must pass test.');
        }

        return actualValue;
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @return {Number}
     */
    static shouldBeFinite(number, message) {
        if (!Lodash.isFinite(number)) {
            this.fail('finite', number, message || 'must be finite.');
        }

        return number;
    }

    /**
     *
     * @param {Object} object
     * @param {String} [message]
     *
     * @return {Object}
     */
    static shouldBeObject(object, message) {
        this.shouldBeExisting(object);

        let fn = Utility.typeMatcher('object');

        throw new Error(Utility.typeOf(fn));

        return this.shouldBe(fn, 'object', object, message);
    }

    /**
     *
     * @param {*} string
     * @param {String} [message]
     * @return {String}
     */
    static shouldBeString(string, message) {
        this.shouldBeExisting(string);

        return this.shouldBe(Utility.typeMatcher('string'), 'object', object, message);
    }

    /**
     *
     * @param {String} typeName
     * @param {*} value
     * @param {String} [message]
     * @returns {*}
     */
    static shouldBeType(typeName, value, message) {
        return this.shouldBe(Utility.typeMatcher(typeName), typeName, value, message);
    }

    /**
     *
     * @param {*} boolean
     * @param {String} message
     * @return {boolean}
     */
    static shouldBeTrue(boolean, message) {
        this.shouldBeBoolean(boolean);

        if (true === boolean) {
            return boolean;
        }

        this.fail(boolean, true, message || 'was not true');
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @returns {Number}
     */
    static shouldNotBeNegativeNumber(number, message) {
        this.shouldBeDefined(number, message);
        this.shouldBeNumber(number, message);

        if (number < 0) {
            this.fail('positive', number, message || 'Number should be positive. Was: ' + number);
        }

        return number;
    }

    /**
     *
     * @param {boolean} boolean
     * @param {String} [message]
     */
    static shouldBeBoolean(boolean, message) {
        this.shouldBeDefined(boolean);

        if (!Lodash.isBoolean(boolean)) {
            this.fail('boolean', boolean, message || 'was not boolean');
        }

        return boolean;
    }

    /**
     *
     * @param {*} number1
     * @param {*} number2
     *
     * @param {String} [message]
     */
    static shouldBeGreaterThan(number1, number2, message) {
        this.shouldBeNumber(number1, message);
        this.shouldBeNumber(number2, message);

        if (number1 <= number2) {
            this.fail('larger than ' + number2, number1, message);
        }

        return number1;
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @return {Number}
     */
    static shouldBePositiveNumber(number, message) {
        this.shouldBeNumber(number, message);

        if (number <= 0) {
            this.fail('positive', number, message || 'Number should be positive. Was: ' + number);
        }

        return number;
    }
}