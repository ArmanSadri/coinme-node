'use strict';

import Lodash from "lodash";
import Preconditions from "~/Preconditions";
import Ember from "~/ember";
import CoreObject from "~/CoreObject";
import {Errors, AbstractError} from "./errors";

/**
 * @class
 * @singleton
 */
class Utility {

    /**
     * @param {*} object
     * @returns {boolean}
     */
    static isObject(object) {
        let type = Utility.typeOf(object);

        return 'object' === type || 'instance' === type;
    }

    /**
     *
     * @param {*} object
     * @returns {Class}
     */
    static toClass(object) {
        if (Utility.isClass(object)) {
            return object;
        } else if (Utility.isObject(object)) {
            return object.toClass();
        }

        Preconditions.fail('object|class', Utility.typeOf(object), 'Must be correct type');
    }

    static isNumber(object) {
        return 'number' === Utility.typeOf(object);
    }

    static isClass(object) {
        return 'class' === Utility.typeOf(object);
    }

    static isInstance(object) {
        return 'instance' === Utility.typeOf(object);
    }

    static isError(object) {
        return 'error' === Utility.typeOf(object);
    }

    /**
     *
     * @param {*} object
     * @param {String} path
     * @param {*} [defaultValue]
     * @returns {*}
     */
    static result(object, path, defaultValue) {
        return Lodash.get.apply(Lodash, arguments);
    }

    static emptyFn() {

    }

    static yes() {
        return true;
    }

    static no() {
        return false;
    }

    static ok() {
        return this;
    }

    static identityFn() {
        return this;
    }

    static passthroughFn(arg) {
        return arg;
    }

    /**
     * Uses Lodash.get, but then removes the key from the parent object.
     *
     * @param {Object} object
     * @param {String|Object|Array} keyAsStringObjectArray
     * @param {Function|Class} [optionalTypeDeclaration] - If you pass a function in, it must return true
     *
     * @returns {*}
     */
    static take(object, keyAsStringObjectArray, optionalTypeDeclaration) {
        if (!object) {
            return undefined;
        }

        Preconditions.shouldBeDefined(keyAsStringObjectArray, 'key must be defined');

        /**
         *
         * @param {Function|undefined} [validatorFn]
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeValidator(validatorFn, key, value) {
            if (validatorFn) {
                Preconditions.shouldNotBeFalsey(validatorFn(value), 'Failed validation: {key:\'' + key + '\' value:\'' + value + '\'');
            }

            return value;
        }

        if (Utility.isString(keyAsStringObjectArray)) {
            /** @type {String} */
            let key = keyAsStringObjectArray;
            let value = Utility.result(object, key);
            let validatorFn = Utility.yes;

            if (Utility.isClass(optionalTypeDeclaration)) {
                validatorFn = Utility.typeMatcher(optionalTypeDeclaration)
            } else if (Utility.isFunction(optionalTypeDeclaration)) {
                validatorFn = optionalTypeDeclaration;
            } else if (Utility.isNullOrUndefined(keyAsStringObjectArray)) {
                validatorFn = Utility.yes;
            }

            if (-1 != key.indexOf('.')) {
                // It's an object path.
                let parentPath = key.substring(0, key.lastIndexOf('.'));
                let itemKey = key.substring(key.lastIndexOf('.') + 1);
                let parent = Utility.result(object, parentPath);

                delete parent[itemKey];
            } else {
                delete object[keyAsStringObjectArray];
            }

            return executeValidator(validatorFn, key, value);
        } else if (Utility.isArray(keyAsStringObjectArray) || Utility.isObject(keyAsStringObjectArray)) {
            let result = {};
            let array_mode = Utility.isArray(keyAsStringObjectArray);

            let defaults = Lodash.defaults(Utility.result(keyAsStringObjectArray, 'defaults') || {}, {
                required: false,
                validator: null
            });

            Lodash.forEach(keyAsStringObjectArray, function(/** @type {String|Object|Function} */rulesetOrObject, /** @type {String} */keyOrIndex) {
                let key = keyOrIndex;
                let ruleset = rulesetOrObject;

                if (array_mode) {
                    if (Utility.isString(rulesetOrObject)) {
                        key = rulesetOrObject;
                        ruleset = Lodash.assign({}, defaults);
                    } else if (Utility.isObject(rulesetOrObject)) {
                        key = Utility.result(rulesetOrObject, 'key');
                        ruleset = rulesetOrObject;
                    }
                } else {
                    key = keyOrIndex;
                    ruleset = rulesetOrObject;
                }

                /** @type {String} */
                let type = Utility.typeOf(ruleset);

                if ('string' === type) {
                    // The ruleset is a data type
                    /** @type {String} */
                    let requiredType = ruleset;

                    ruleset = {
                        key: key,
                        type: requiredType,
                        validator: null
                    };
                } else if ('object' === type) {
                    // this is a ruleset that overrides our ruleset.
                    ruleset = Lodash.defaults({ key: key }, ruleset);
                } else if ('function' === type) {
                    let fn = ruleset;
                    
                    ruleset = {
                        key: key,
                        validator: fn
                    };
                } else {
                    throw new Error('Cannot determine what to do with: ' + type + ': ' + ruleset);
                }

                ruleset = Lodash.defaults(ruleset, defaults);

                // If we don't have a validator yet, check to see if we can get one.
                if (!ruleset.validator && Utility.isNotBlank(ruleset.type)) {
                    if ('string' === ruleset.type) {
                        ruleset.validator = Utility.isString;
                    } else if ('number' === requiredType) {
                        ruleset.validator = Utility.isNumber;
                    } else if ('required' === requiredType) {
                        ruleset.validator = Utility.isExisting;
                    } else {
                        throw new Error('I should add more types');
                    }
                }

                if ('defaults' === key) {
                    return;
                }
                
                let entry = executeValidator(ruleset.validator, key, Utility.take(object, key));

                if (ruleset.required && Utility.isUndefined(entry)) {
                    throw new Error('Required key not present: ' + ruleset.key);
                }

                result[key] = entry;
            });

            return result;
        } else {
            throw new Error('Not sure how to handle this case: ' + Utility.typeOf(keyAsStringObjectArray));
        }
    }

    /**
     * Creates a test method. Uses Utility.typeOf()
     *
     * @param {String|Class} type
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

            if (!('string' === typeOfType || 'class' === typeOfType)) {
                Preconditions.fail('string', type, `The type passed in was not a string|class. It was ${typeOfType}`);
            }
        }

        /**
         * Should be known type.
         */
        {
            // This will cause an infinite loop.
            // Preconditions.shouldNotBeBlank(type, 'type missing');
            // type = Utility.toLowerCase(type);
            if (Utility.isString(type)) {
                type = type.toLowerCase();

                Preconditions.shouldBeTrue(knownTypes[type], 'unknown type: ' + type);

                return (function(/** @type {*} */ object) {
                    let objectType = Utility.typeOf(object);

                    if ('object' === type || 'instance' === type) {
                        return ('object' === objectType) || ('instance' === objectType);
                    }

                    return type === objectType;
                });
            } else if (Utility.isClass(type)) {
                /**
                 * @type {Class<CoreObject>}
                 */
                return function(/** @type {*} */object) {
                    return (type.isInstance(object));
                };
            }
        }


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
        let type = Ember.typeOf(object);

        if ('function' === type) {
            // Let's isClass a bit further.

            if (CoreObject.isClass(object) || Errors.isErrorClass(object)) {
                return 'class';
            } else if (Errors.isErrorInstance(object)) {
                return 'error';
            }

        } else if ('object' === type) {
            if (CoreObject.isInstance(object)) {
                return 'instance';
            }
        }

        return type;
    }

    /**
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isArray(object) {
        return 'array' === Utility.typeOf(object);
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

    /**
     * Determines if the argument is a Number, String, null, undefined
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isPrimitive(object) {
        if (Utility.isNullOrUndefined(object)) {
            return true;
        }
        
        let type = Utility.typeOf(object);
        let primitives = ['number', 'string'];

        return -1 !== primitives.indexOf(type);
    }

    /**
     * Determine if something is a promise
     *
     * @param {*} object
     * @return boolean
     */
    static isPromise(object) {
        return Promise.is(object);
    }
    
    /**
     *
     * @param valueOrFn
     */
    static isTruthy(valueOrFn) {
        let value;

        if (Utility.isFunction(valueOrFn)) {
            value = valueOrFn();
        } else {
            value = valueOrFn;
        }

        return !!value;
    }

    /**
     *
     * @param fn
     * @returns {boolean}
     */
    static isFunction(fn) {
        return 'function' === Utility.typeOf(fn);
    }

    /**
     * @param {*} object
     * @returns {boolean}
     */
    static isNotFunction(object) {
        return 'function' !== Utility.typeOf(object);
    }

    /**
     * @param {*} object
     * @returns {boolean}
     */
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
     *
     * @param object
     */
    static optString(object) {
        if (!object) {
            return undefined;
        } else {
            return object.toString();
        }
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