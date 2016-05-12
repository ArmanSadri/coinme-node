'use strict';

import Utility from "~/Utility";
import Lodash from "lodash/index";

// class PreconditionsError extends AbstractError {
//
//     /**
//      *
//      * @param {*} actualValue
//      * @param {*} expectedValue
//      * @param {String} [message]
//      * @param {Error} [optionalCause]
//      * @constructor
//      */
//     constructor(expectedValue, actualValue, message, optionalCause) {
//         super(message);
//
//         console.log('capture stack A');
//
//         this.name = 'PreconditionsError';
//         // this.stack = error.stack;
//         this.cause = optionalCause;
//
//         this.expectedValue = expectedValue || '';
//         this.actualValue = actualValue || '';
//         this.message = `failure (expected: ${this.expectedValue}) (actual: ${this.actualValue}) (message: ${this.message})`;
//     }
// }

/**
 *
 * @param {*} expectedValue
 * @param {*} actualValue
 * @param {String} [message]
 * @param {Error} [optionalCause]
 * @constructor
 */
function PreconditionsError(expectedValue, actualValue, message, optionalCause) {
    var error = Error.call(this, message);

    this.name = 'PreconditionsError';
    this.stack = error.stack;
    this.cause = optionalCause;

    this.expectedValue = expectedValue;
    this.actualValue = actualValue;
    this.message = `failure (expected: '${this.expectedValue}' [${Utility.typeOf(this.expectedValue)}]) (actual: '${this.actualValue}' [${Utility.typeOf(this.actualValue)}]) (message: ${this.message})`;
}

PreconditionsError.prototype = Object.create(Error.prototype);
PreconditionsError.prototype.constructor = PreconditionsError;

export { PreconditionsError }

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
        return Preconditions.shouldBe(Utility.isUndefined, object, 'undefined', message || 'must be undefined');
    }

    /**
     *
     * @param {*} object
     * @param {String} [message]
     * @returns {*}
     */
    static shouldNotBeFalsey(object, message) {
        return Preconditions.shouldBe(Utility.isNotFalsey, object, message, 'must not be falsey')
    }

    /**
     *
     * @param {*} object
     * @param {String} [message]
     * @returns {*}
     */
    static shouldBeFalsey(object, message) {
        return Preconditions.shouldBe(Utility.isFalsey, object, message, 'must be falsey')
    }

    /**
     * This method checks for UNDEFINED, NAN, and NULL
     *
     * @param {*} object
     * @param {String} [message]
     * @return {*}
     */
    static shouldBeDefined(object, message) {
        if (Utility.isUndefined(object)) {
            Preconditions.fail('defined', 'undefined', message || 'must be defined.');
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
        return Preconditions.shouldBe(Utility.isExisting, 'exist', object, message || 'must exist.');
    }

    /**
     *
     * @param {*} string
     * @param {String} [message]
     * @return {String}
     */
    static shouldNotBeBlank(string, message) {
        Preconditions.shouldBeString(string);

        return Preconditions.shouldBe(Utility.isNotBlank, 'not blank', string, message || 'must not be blank.');
    }

    /**
     *
     * @param {*} fn
     * @param {String} [message]
     * @return {function}
     */
    static shouldBeFunction(fn, message) {
        return Preconditions.shouldBeType('function', fn, message);
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @return {Number}
     */
    static shouldBeNumber(number, message) {
        Preconditions.shouldBeType(number, 'number', message);
        Preconditions.shouldBeFinite(number, message);

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
            Preconditions.fail('function', testFn, `testFn must be function, but was ${Utility.typeOf(testFn)}.`);
        }

        if (!testFn.call(this, actualValue)) {
            Preconditions.fail(expectedValue, actualValue, message || 'must pass test.');
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
            Preconditions.fail('finite', number, message || 'must be finite.');
        }

        return number;
    }

    /**
     *
     * @param {Object} object
     * @param {String} [message]
     * @return {Object}
     */
    static shouldBeObject(object, message) {
        Preconditions.shouldBeExisting(object, message);

        let fn = Utility.typeMatcher('object');

        // throw new Error(Utility.typeOf(fn));

        return Preconditions.shouldBe(fn, 'object', object, message);
    }

    /**
     *
     * @param {*} string
     * @param {String} [message]
     * @return {String}
     */
    static shouldBeString(string, message) {
        Preconditions.shouldBeExisting(string);

        let fn = Utility.typeMatcher('string');

        return Preconditions.shouldBe(fn, 'object', object, message);
    }

    /**
     *
     * @param {String} typeName
     * @param {*} value
     * @param {String} [message]
     * @returns {*}
     */
    static shouldBeType(typeName, value, message) {
        return Preconditions.shouldBe(Utility.typeMatcher(typeName), typeName, value, message);
    }

    /**
     *
     * @param {*} boolean
     * @param {String} [message]
     * @return {boolean}
     */
    static shouldBeTrue(boolean, message) {
        Preconditions.shouldBeBoolean(boolean, message);

        if (true === boolean) {
            return boolean;
        }

        Preconditions.fail(boolean, true, message || 'was not true');
    }

    /**
     *
     * @param {*} number
     * @param {String} [message]
     * @returns {Number}
     */
    static shouldNotBeNegativeNumber(number, message) {
        Preconditions.shouldBeDefined(number, message);
        Preconditions.shouldBeNumber(number, message);

        if (number < 0) {
            Preconditions.fail('positive', number, message || 'Number should be positive. Was: ' + number);
        }

        return number;
    }

    /**
     *
     * @param {boolean} boolean
     * @param {String} [message]
     */
    static shouldBeBoolean(boolean, message) {
        Preconditions.shouldBeDefined(boolean);

        if (!Utility.isBoolean(boolean)) {
            Preconditions.fail('boolean', boolean, message || 'was not boolean');
        }

        return boolean;
    }

    /**
     *
     * @param {*} number1
     * @param {*} number2
     * @param {String} [message]
     */
    static shouldBeGreaterThan(number1, number2, message) {
        Preconditions.shouldBeNumber(number1, message);
        Preconditions.shouldBeNumber(number2, message);

        if (number1 <= number2) {
            Preconditions.fail('larger than ' + number2, number1, message);
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
        Preconditions.shouldBeNumber(number, message);

        if (number <= 0) {
            Preconditions.fail('positive', number, message || 'Number should be positive. Was: ' + number);
        }

        return number;
    }
}