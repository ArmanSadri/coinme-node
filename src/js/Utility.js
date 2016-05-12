'use strict';

import Lodash from "lodash";
import Preconditions from "~/Preconditions";
import Ember from "~/ember";

/**
 * @class
 * @singleton
 */
class Utility {

    /**
     * Creates a test method. Uses Utility.typeOf()
     *
     * @param {String} type
     * @return {function}
     */
    static typeMatcher(type) {
        // Ember.typeOf();                       // 'undefined'
        // Ember.typeOf(null);                   // 'null'
        // Ember.typeOf(undefined);              // 'undefined'
        // Ember.typeOf('michael');              // 'string'
        // Ember.typeOf(new String('michael'));  // 'string'
        // Ember.typeOf(101);                    // 'number'
        // Ember.typeOf(new Number(101));        // 'number'
        // Ember.typeOf(true);                   // 'boolean'
        // Ember.typeOf(new Boolean(true));      // 'boolean'
        // Ember.typeOf(Ember.makeArray);        // 'function'
        // Ember.typeOf([1, 2, 90]);             // 'array'
        // Ember.typeOf(/abc/);                  // 'regexp'
        // Ember.typeOf(new Date());             // 'date'
        // Ember.typeOf(Ember.Object.extend());  // 'class'
        // Ember.typeOf(Ember.Object.create());  // 'instance'
        // Ember.typeOf(new Error('teamocil'));  // 'error'
        // // 'normal' JavaScript object
        // Ember.typeOf({ a: 'b' });             // 'object'

        let knownTypes = {
            'undefined': true,
            'null': true,
            'string': true,
            'number': true,
            'boolean': true,
            'function': true,
            'array': true,
            'instance': true,
            'error': true,
            'object': true,
            'class': true,
            'regexp': true,
            'date': true
        };

        /**
         * Should be string.
         */
        {
            let typeOfType = Utility.typeOf(type);

            if ('string' !== typeOfType) {
                Preconditions.fail('string', type, `The type passed in was not a string. It was ${typeOfType}`);
            }
        }

        /**
         * Should be known type.
         */
        {
            // This will cause an infinite loop.
            // Preconditions.shouldNotBeBlank(type, 'type missing');
            // type = Utility.toLowerCase(type);
            type = type.toLowerCase();

            Preconditions.shouldBeTrue(knownTypes[type], 'unknown type: ' + type);
        }

        /**
         * @param {*} object
         */
        return (function(object) {
            return type === Utility.typeOf(object);
        });
    }

    /**
     * Returns a consistent type for the passed item.
     *
     * Use this instead of the built-in `typeof` to get the type of an item.
     * It will return the same result across all browsers and includes a bit
     * more detail. Here is what will be returned:
     *
     * | Return Value  | Meaning                                              |
     * |---------------|------------------------------------------------------|
     * | 'string'      | String primitive or String object.                   |
     * | 'number'      | Number primitive or Number object.                   |
     * | 'boolean'     | Boolean primitive or Boolean object.                 |
     * | 'null'        | Null value                                           |
     * | 'undefined'   | Undefined value                                      |
     * | 'function'    | A function                                           |
     * | 'array'       | An instance of Array                                 |
     * | 'regexp'      | An instance of RegExp                                |
     * | 'date'        | An instance of Date                                  |
     * | 'class'       | An Ember class (created using Ember.Object.extend()) |
     * | 'instance'    | An Ember object instance                             |
     * | 'error'       | An instance of the Error object                      |
     * | 'object'      | A JavaScript object not inheriting from Ember.Object |
     *
     * Examples:
     *
      ```javascript
     Ember.typeOf();                       // 'undefined'
     Ember.typeOf(null);                   // 'null'
     Ember.typeOf(undefined);              // 'undefined'
     Ember.typeOf('michael');              // 'string'
     Ember.typeOf(new String('michael'));  // 'string'
     Ember.typeOf(101);                    // 'number'
     Ember.typeOf(new Number(101));        // 'number'
     Ember.typeOf(true);                   // 'boolean'
     Ember.typeOf(new Boolean(true));      // 'boolean'
     Ember.typeOf(Ember.makeArray);        // 'function'
     Ember.typeOf([1, 2, 90]);             // 'array'
     Ember.typeOf(/abc/);                  // 'regexp'
     Ember.typeOf(new Date());             // 'date'
     Ember.typeOf(Ember.Object.extend());  // 'class'
     Ember.typeOf(Ember.Object.create());  // 'instance'
     Ember.typeOf(new Error('teamocil'));  // 'error'

     // 'normal' JavaScript object
     Ember.typeOf({ a: 'b' });             // 'object'
     ```
     *
     * @method typeOf
     * @for Ember
     * @param {Object} object the item to check
     * @return {String} the type
     * @public
     */
    static typeOf(object) {
        return Ember.typeOf(object);
    }

    /**
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isBoolean(object) {
        return 'boolean' === Utility.typeOf(object);
    }

    /**
     *
     * @param {*} object
     * @return {boolean}
     */
    static isUndefined(object) {
        return 'undefined' === Utility.typeOf(object);
    }

    /**
     * Shorthand: Utility.typeOf() === string
     *
     * This is for functional programming.
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isString(object) {
        return 'string' === Utility.typeOf(object);
    }

    static isFunction(fn) {
        return 'function' === Utility.typeOf(fn);
    }

    static isNaN(object) {
        return Lodash.isNaN(object);
    }

    /**
     *
     * @param {*} anything
     * @returns {boolean}
     */
    static isNull(anything) {
        return 'null' === Utility.typeOf(anything);
    }

    /**
     * Null-safe way to lowercase
     * @param {String} string
     * @returns {String}
     */
    static toLowerCase(string) {
        if (Utility.isBlank(string)) {
            return string;
        }

        Preconditions.shouldBeString(string);

        return string.toLowerCase();
    }

    /**
     * Null-safe way to uppercase.
     *
     * @param {String} string
     * @returns {String}
     */
    static toUpperCase(string) {
        if (Utility.isBlank(string)) {
            return string;
        }

        Preconditions.shouldBeString(string);

        return string.toUpperCase();
    }

    /**
     * Determines if the input is NotNull, NotNaN, and NotUndefined.
     *
     * @param {*} anything
     * @return {boolean}
     */
    static isExisting(anything) {
        let u = Utility.isUndefined(anything);
        let n = Utility.isNaN(anything);
        let nu = Utility.isNull(anything);

        return !(u || n || nu);
    }

    /**
     * The opposite of existing.
     *
     * @param {*} anything
     * @returns {boolean}
     */
    static isNotExisting(anything) {
        return !Utility.isExisting(anything);
    }

    /**
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isFalsey(object) {
        return !object;
    }

    /**
     *
     * @param object
     */
    static isNotFalsey(object) {
        return !Utility.isFalsey(object);
    }

    /**
     * Shorthand for value
     *
     * @param value
     * @returns {boolean}
     */
    static isNullOrUndefined(value) {
        return Utility.isNull(value) || Utility.isUndefined(value);
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    static isBlank(string) {
        if (Utility.isNullOrUndefined(string)) {
            return true;
        }

        Preconditions.shouldBeString(string);

        return Ember.isBlank(string);
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    static isNotBlank(string) {
        return !Utility.isBlank(string);
    }

    /**
     *
     * @param {Object} object
     * @param {Object} defaults
     * @returns {Object} The original object.
     */
    static defaults(object, defaults) {
        Preconditions.shouldBeObject(object);
        Preconditions.shouldBeObject(defaults);

        let updates = Object.keys(defaults);

        for (let i = 0, l = updates.length; i < l; i++) {
            let prop = updates[i];
            let value = Ember.get(defaults, prop);

            Ember.set(object, prop, value);
        }

        return object;
    }
}

export default Utility;