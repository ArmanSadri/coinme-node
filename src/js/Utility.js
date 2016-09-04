'use strict';

import Lodash from "lodash";
/** @type {Preconditions} */
import Preconditions from "~/Preconditions";
/** @type {Ember} **/
import Ember from "~/Ember";
import CoreObject from "~/CoreObject";
import {Errors} from "./errors";
import Big from "big.js/big";
import {
    Instant,
    LocalDate,
    ZonedDateTime,
    LocalDateTime,
    DateTimeFormatter,
    ZoneOffset,
    nativeJs,
    convert,
    TemporalQueries,
    LocalTime
} from "js-joda";

let TEMPORALS = {
    'Instant': Instant,
    'LocalTime': LocalTime,
    'LocalDate': LocalDate,
    'LocalDateTime': LocalDateTime,
    'ZonedDateTime': ZonedDateTime
};

let EMAIL_PATTERN = /(?:\w)+(?:\w|-|\.|\+)*@(?:\w)+(?:\w|\.|-)*\.(?:\w|\.|-)+$/;

/**
 * @class
 * @singleton
 */
class Utility {

    static isTemporal(value) {
        // Direct Subclass:
        //     ChronoLocalDate, ChronoLocalDateTime, ChronoZonedDateTime, DateTimeBuilder, DayOfWeek, Instant, LocalTime, Month, MonthDay, src/format/DateTimeParseContext.js~Parsed, Year, YearMonth
        // Indirect Subclass:
        //     LocalDate, LocalDateTime, ZonedDateTime

        // console.log(value.toString());
        // console.log(value.prototype);
        // console.log(value.__proto__);
        // console.log(value.constructor);
        return !!TEMPORALS[value.constructor.name];
    }

    /**
     *
     * @param {*} one
     * @param {*} two
     * @return {boolean}
     */
    static isSameType(one, two) {
        let type1 = Utility.typeOf(one);
        let type2 = Utility.typeOf(two);

        return type1 === type2;
    }

    /**
     *
     * @param {String|null|undefined} string
     * @return {String|undefined}
     */
    static optLowerCase(string) {
        if (Utility.isNullOrUndefined(string)) {
            return undefined;
        }

        return (Utility.optString(string) || '').toLowerCase();
    }

    /**
     *
     * @param {String} string1
     * @param {String} string2
     * @return {Boolean}
     */
    static isStringEqualIgnoreCase(string1, string2) {
        if (Utility.isNotExisting(string1) || Utility.isNotExisting(string2)) {
            return Utility.isSameType(string1, string2);
        }

        return Utility.isStringEqual(
            Utility.optLowerCase(string1),
            Utility.optLowerCase(string2));
    }

    /**
     * (null, null) -> true
     *
     * @param {String|*} string1
     * @param {String|*} string2
     * @return {boolean}
     */
    static isStringEqual(string1, string2) {
        if (Utility.isNotExisting(string1) || Utility.isNotExisting(string2)) {
            return Utility.isSameType(string1, string2);
        }

        string1 = Utility.optString(string1);
        string2 = Utility.optString(string2);

        if (!Utility.isSameType(string1, string2)) {
            return false;
        } else if (!Utility.isExisting(string1)) {
            return false;
        }

        return string1 === string2;
    }

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

    /**
     * @param {CoreObject|Class<CoreObject>} instance - Must be an instance of CoreObject (or subclass)
     */
    static toClassOrFail(instance) {
        if (Utility.isInstance(instance)) {

        } else if (Utility.isClass(instance)) {

        } else {
            Preconditions.fail(CoreObject, instance, 'Was not an instance or class. Cannot continue');
        }

        return instance.toClass();
    }

    /**
     *
     * @param boolean
     * @returns {*}
     */
    static ifBoolean(boolean) {
        if (Utility.isBoolean(boolean)) {
            return boolean;
        }

        return undefined;
    }

    /**
     * Uses Lodash.get, but then removes the key from the parent object.
     *
     * It takes properties off of an object and optionally does validation.
     *
     * var value = Utility.take(object, key, type);
     *
     * var value = Utility.take(object, {
     *                           key: String,
     *                       });
     *
     * var {value1, value2} = Utility.take(object, [keyAsString1, keyAsString2]);
     *
     * var {value1} = Utility.take(object, [keyAsString1]);
     *
     * A ruleset is defined as:
     *
     *  {
     *      // return true to pass. false to fail.
     *      validator: function(value) { return boolean; } throws Error,
     *      type: String,
     *      adapter: function(value) { return new_value; },
     *      required: true|false|undefined
     *   }
     *
     * @param {Object} object
     * @param {String|Object|Array} keyAsStringObjectArray
     * @param {String|Function|Class|Object|{required:Boolean,type:String|Class,validator:Function,adapter:Function, [defaultValue]:*}} [optionalTypeDeclarationOrDefaults] - If you pass a function in, it must return true
     * @param {Boolean} [requiredByDefault] Default value for required.
     * @throws PreconditionsError
     *
     * @returns {*}
     */
    static take(object, keyAsStringObjectArray, optionalTypeDeclarationOrDefaults, requiredByDefault) {
        if (!object) {
            object = {};
        }

        Preconditions.shouldBeDefined(keyAsStringObjectArray, 'key must be defined');

        //region utilities
        /**
         *
         * @param {{[scope]: Object, [adapter]: function, [validator]: function, [adapter]: function}}  ruleset
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeValidator(ruleset, key, value) {
            let fn = Lodash.get(ruleset, 'validator');
            let scope = Lodash.get(ruleset, 'scope') || this;

            if (fn) {
                Preconditions.shouldBeFunction(fn, 'validator must be type of function');
                Preconditions.shouldNotBeFalsey(fn.call(scope, value), 'Failed validation: {key:\'' + key + '\' value:\'' + value + '\'');
            }

            return value;
        }

        /**
         * If the ruleset requires, will throw.
         *
         * @throws PreconditionsError
         * @param {{[scope]: Object, [adapter]: function, [validator]: function, [adapter]: function}}  ruleset
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeAdapter(ruleset, key, value) {
            let fn = Lodash.get(ruleset, 'adapter');
            let scope = Lodash.get(ruleset, 'scope') || this;

            // console.log(`adapter: (key:${key}) (fn:${fn})`);

            if (fn) {
                Preconditions.shouldBeFunction(fn, 'Validator must be a function');

                let source = value;

                value = fn.call(scope, value);

                // console.log(`adapted (value:${source}) (type:${Utility.typeOf(source)}) to (value:${value}) (type: ${Utility.typeOf(value)}`);
            }

            return value;
        }

        /**
         * If the ruleset requires, will throw.
         *
         * @throws PreconditionsError
         * @param {{[scope]: Object, [adapter]: function, [validator]: function, [adapter]: function, [defaultValue]:*}}  ruleset
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeRequired(ruleset, key, value) {
            let required = Lodash.get(ruleset, 'required');

            if (Utility.isDefined(ruleset.defaultValue)) {
                if (!value) {
                    value = ruleset.defaultValue;
                }
            }

            if (true === required) {
                if (Utility.isNullOrUndefined(value)) {
                    Preconditions.shouldBeExisting(value, `Utility.take(). 'key=${key}' is required`);
                }
            }


            return value;
        }

        /**
         * If the ruleset requires, will throw.
         *
         * @throws PreconditionsError
         * @param {{[scope]: Object, [adapter]: function, [validator]: function, [adapter]: function}}  ruleset
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeType(ruleset, key, value) {
            if (!ruleset.required && Utility.isUndefined(value)) {
                return;
            }

            let type = Lodash.get(ruleset, 'type');

            if (type) {
                Preconditions.shouldBeType(type, value, `${key} was wrong type.`);
            }

            return value;
        }

        /**
         * Main entry point for checks.
         *
         * @param {{[adapter]: function, [validator]: function, [adapter]: function}}  ruleset
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        function executeChecks(ruleset, key, value) {
            // console.log(`executeChecks with ruleset: ${JSON.stringify(ruleset)} and (key:${key}) (value:${value})`);

            value = executeAdapter(ruleset, key, value);
            value = executeRequired(ruleset, key, value);
            value = executeType(ruleset, key, value);
            value = executeValidator(ruleset, key, value);

            return value;
        }

        //endregion

        //region ruleset - defaults
        let global_defaults = {};

        Preconditions.shouldNotBeInstance(optionalTypeDeclarationOrDefaults, 'the 3rd parameter cannot be an instance of a CoreObject field.');

        if (Utility.isObject(optionalTypeDeclarationOrDefaults)) {
            if (Utility.isClass(optionalTypeDeclarationOrDefaults)) {
                global_defaults = {
                    type: optionalTypeDeclarationOrDefaults
                };
            } else {
                global_defaults = Lodash.assign(global_defaults, optionalTypeDeclarationOrDefaults);
            }

            optionalTypeDeclarationOrDefaults = null;
        } else if (Utility.isFunction(optionalTypeDeclarationOrDefaults)) {
            global_defaults = {
                validator: optionalTypeDeclarationOrDefaults
            };

            optionalTypeDeclarationOrDefaults = null;
        } else if (Utility.isBoolean(optionalTypeDeclarationOrDefaults)) {
            global_defaults = {
                required: optionalTypeDeclarationOrDefaults
            };

            optionalTypeDeclarationOrDefaults = null;

            Preconditions.shouldBeUndefined(requiredByDefault, 'You provided two booleans. That\'s strange.');
        } else if (Utility.isString(optionalTypeDeclarationOrDefaults)) {
            global_defaults = {
                type: optionalTypeDeclarationOrDefaults
            };
        }

        if (Utility.isBoolean(requiredByDefault)) {
            // global_defaults.required =
            global_defaults = Utility.defaults(global_defaults, {
                required: requiredByDefault
            });
        }

        // if (Utility.isDefined(global_defaults.defaultValue)) {
        //     throw new Error('has default value global');
        // }

        /**
         *
         * @param {Object} [defaults]
         * @returns {{required:Boolean, validator:Function, type:String|Object, adapter:Function}}
         */
        function toRuleset(defaults) {
            let ruleset = {};

            ruleset = Lodash.defaults(ruleset, defaults || {}, global_defaults, {
                required: false,
                validator: null
            });

            return ruleset;
        }

        //endregion

        let mode = Utility.typeOf(keyAsStringObjectArray);

        //region String Mode
        if ('string' === mode) {
            /** @type {String} */
            let key = keyAsStringObjectArray;
            keyAsStringObjectArray = null;

            /** @type {*} */
            let value = Utility.result(object, key);

            /**
             * @type {{validator?:function, required?:boolean, type?: string|object}}
             */
            let ruleset = toRuleset();

            // if (Utility.isClass(optionalTypeDeclarationOrDefaults)) {
            //     ruleset = {
            //         validator: Utility.typeMatcher(optionalTypeDeclarationOrDefaults),
            //         required: false
            //     };
            // } else if (Utility.isFunction(optionalTypeDeclarationOrDefaults)) {
            //     ruleset = {
            //         validator: optionalTypeDeclarationOrDefaults,
            //         required: false
            //     };
            // } else if (Utility.isNullOrUndefined(optionalTypeDeclarationOrDefaults)) {
            //     ruleset = {
            //         validator: Utility.yes,
            //         required: false
            //     };
            // } else if (Utility.isObject(optionalTypeDeclarationOrDefaults) && !Utility.isInstance(optionalTypeDeclarationOrDefaults)) {
            //     // TODO: apply global defaults.
            //     ruleset = optionalTypeDeclarationOrDefaults;
            // } else {
            //     throw new TypeError('Not sure how to interpret the rules.')
            // }

            if (-1 != key.indexOf('.')) {
                // It's an object path.
                let parentPath = key.substring(0, key.lastIndexOf('.'));
                let itemKey = key.substring(key.lastIndexOf('.') + 1);
                let parent = Utility.result(object, parentPath);

                delete parent[itemKey];
            } else {
                delete object[key];
            }

            return executeChecks(ruleset, key, value);
        }
        //endregion

        //region Array/Object mode
        if ('array' === mode || 'object' === mode) {
            let result = {};

            let defaults = toRuleset(Utility.result(keyAsStringObjectArray, 'defaults', {}));

            Lodash.forEach(keyAsStringObjectArray,

                /**
                 *
                 * @param {String|Object|Function} rulesetOrObject
                 * @param {String} [rulesetOrObject.key]
                 * @param {Number|String} keyOrIndex
                 */
                function (rulesetOrObject, keyOrIndex) {
                    /**
                     * @type {String}
                     */
                    let key;

                    /**
                     * @type {Object}
                     */
                    let ruleset;

                    if ('array' === mode) {
                        if (Utility.isString(rulesetOrObject)) {
                            key = rulesetOrObject;
                            ruleset = Lodash.defaults({}, defaults);

                            // if (Utility.isObject(optionalTypeDeclarationOrDefaults)) {
                            //     ruleset = Lodash.defaults(ruleset, optionalTypeDeclarationOrDefaults);
                            // }
                        } else if (Utility.isObject(rulesetOrObject)) {
                            /**
                             * @type {String}
                             */
                            key = Preconditions.shouldBeString(Utility.result(rulesetOrObject, 'key'), 'key not defined');
                            ruleset = rulesetOrObject;
                        } else if (Utility.isFunction(rulesetOrObject)) {
                            ruleset = {
                                validator: rulesetOrObject
                            };
                        } else {
                            throw new Error('Dont know what to do: ' + rulesetOrObject);
                        }
                    } else if ('object' === mode) {
                        key = keyOrIndex;

                        if (Utility.isString(rulesetOrObject)) {
                            ruleset = {
                                type: rulesetOrObject
                            };
                        } else if (Utility.isObject(rulesetOrObject)) {
                            ruleset = rulesetOrObject;
                        } else if (Utility.isFunction(rulesetOrObject)) {
                            ruleset = {
                                validator: rulesetOrObject
                            };
                        } else {
                            throw new Error('Dont know what to do: ' + rulesetOrObject);
                        }

                    } else {
                        Preconditions.fail('array|object', mode, 'Unknown mode');
                    }

                    Preconditions.shouldNotBeBlank(key, 'Key must be defined by here in all situations.');
                    Preconditions.shouldBeObject(ruleset, 'Must have a valid ruleset: ' + ruleset);

                    // if (Utility.isObject(ruleset)) {
                    //     // this is a ruleset that overrides our ruleset.
                    //     ruleset = Lodash.defaults({key: key}, ruleset, defaults);
                    // } else if (Utility.isFunction(ruleset)) {
                    //     let fn = ruleset;
                    //
                    //     ruleset = {
                    //         key: key,
                    //         validator: fn
                    //     };
                    // } else {
                    //     throw new Error('Cannot determine what to do with: ' + typeOfRuleset + ': ' + ruleset);
                    // }

                    ruleset = Lodash.defaults(ruleset, defaults);

                    let requiredType = ruleset.type;

                    // If we don't have a validator yet, check to see if we can get one.
                    if (!ruleset.validator && Utility.isNotBlank(requiredType)) {
                        if ('string' === requiredType) {
                            ruleset.validator = Utility.isString;
                        } else if ('number' === requiredType) {
                            ruleset.validator = Utility.isNumber;
                        } else if ('required' === requiredType) {
                            ruleset.validator = Utility.isExisting;
                        } else {
                            throw new Error('I should add more types: ' + requiredType);
                        }
                    }

                    if ('defaults' === key) {
                        return;
                    }

                    result[key] = executeChecks(ruleset, key, Utility.take(object, key));
                });

            return result;
        } else {
            throw new Error('Not sure how to handle this case: ' + Utility.typeOf(keyAsStringObjectArray));
        }
        //endregion

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

                return (function (/** @type {*} */ object) {
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
                return function (/** @type {*} */object) {
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
            } else if (Utility.isTemporal(object)) {
                return 'temporal';
            }
        }

        return type;
    }

    /**
     * @param {Date|*} value
     * @return {Boolean}
     */
    static isDate(value) {
        return 'date' === Utility.typeOf(value);
    }

    /**
     *
     * @param {String} string
     * @returns {boolean}
     */
    static isEmail(string) {
        Preconditions.shouldBeString(string, 'Should be string');

        var type = Utility.typeOf(string);

        if (type !== 'string' || !string) {
            return false;
        }

        return EMAIL_PATTERN.test(string);
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
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isDefined(object) {
        return !this.isUndefined(object);
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
     *
     * @param {CoreObject|Class} object
     * @returns {Class|*|Class.<CoreObject>}
     */
    static getClass(object) {
        if (Utility.isClass(object)) {
            return object;
        }

        Preconditions.shouldBeInstance(object);

        return object.toClass();
    }

    /**
     * @param {String|Number|Big|null|NaN|undefined} numberOrStringOrBig
     * @returns {Big}
     */
    static toBigNumber(numberOrStringOrBig) {
        if (Utility.isNullOrUndefined(numberOrStringOrBig)) {
            numberOrStringOrBig = 0;
        }

        if (numberOrStringOrBig instanceof Big) {
            return numberOrStringOrBig;
        } else if (Utility.isString(numberOrStringOrBig) || Utility.isNumber(numberOrStringOrBig)) {
            return new Big(numberOrStringOrBig);
        }

        Preconditions.fail('Number|String|Big', numberOrStringOrBig, 'Unsupported type');
    }

    /**
     *
     * @param {Class|CoreObject|null|undefined} object
     * @returns {Class|undefined}
     */
    static optClass(object) {
        if (Utility.isInstance(object)) {
            return Utility.getClass(object);
        } else if (Utility.isClass(object)) {
            return object;
        }

        return undefined;
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
        if (!Utility.isExisting(object)) {
            return undefined;
        } else {
            if (Utility.isFunction(object.toString)) {
                return object.toString();
            } else {
                return '' + object;
            }
        }
    }

    /**
     * optJson(undefined) -> undefined
     * optJson(null) -> undefined
     * optJson(NaN) -> undefined
     * optJson(primitive) -> primitive
     * optJson(object) -> object.toJSON
     * optJson(object) -> object.toJson
     * optJson(object) -> object
     *
     * @param object
     * @return {*}
     */
    static optJson(object) {
        if (!Utility.isExisting(object)) {
            return undefined;
        } else if (Utility.isPrimitive(object)) {
            return object;
        } else if (Utility.isFunction(object.toJson)) {
            return object.toJson();
        } else if (Utility.isFunction(object.toJSON)) {
            return object.toJSON();
        } else {
            return object;
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
     * A value is blank if it is empty or a whitespace string.
     *
     * ```javascript
     * Ember.isBlank();                // true
     * Ember.isBlank(null);            // true
     * Ember.isBlank(undefined);       // true
     * Ember.isBlank('');              // true
     * Ember.isBlank([]);              // true
     * Ember.isBlank('\n\t');          // true
     * Ember.isBlank('  ');            // true
     * Ember.isBlank({});              // false
     * Ember.isBlank('\n\t Hello');    // false
     * Ember.isBlank('Hello world');   // false
     * Ember.isBlank([1,2,3]);         // false
     * ```
     * @param {String|Array|Number} stringOrArrayOrNumber
     * @param {String|Array|Number} [stringOrArrayOrNumber.length]
     * @return {boolean}
     */
    static isBlank(stringOrArrayOrNumber) {
        if (Utility.isNotExisting(stringOrArrayOrNumber)) {
            return true;
        }

        let type = Utility.typeOf(stringOrArrayOrNumber);
        if ('number' === type) {
            return (0 == stringOrArrayOrNumber);
        }

        if (!('array' === type || 'string' === type || 'number' === type)) {
            Preconditions.fail('type|array', type);
        }

        return Ember.isBlank(stringOrArrayOrNumber);
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
     * @returns {Number}
     */
    static defaultNumber() {
        let result = 0;

        Lodash.each(arguments, function (object) {
            if (Utility.isNumber(object)) {
                result = object;
            }
        });

        return result;
    }

    /**
     *
     * @param {String|Number} value
     * @return {boolean}
     */
    static isNumeric(value) {
        if (typeof value === 'number') return true;
        var str = (value || '').toString();
        if (!str) return false;
        return !isNaN(str);
    }

    /**
     *
     * @param {*} value
     * @returns {Number}
     */
    static toNumberOrFail(value) {
        if (Utility.isNullOrUndefined(value)) {
            return 0;
        } else if (Utility.isNumber(value)) {
            return value;
        } else if (Utility.isString(value)) {
            return Number.parseFloat(value);
        } else if (value instanceof Big) {
            // is this a risk?
            return Number.parseFloat(value.toFixed());
        }

        throw new TypeError("unknown type: " + Utility.typeOf(value));
    }

    /**
     * @param {Number|String|Big|BigJsLibrary.BigJS|Instant|null|undefined|ZonedDateTime} numberOrStringOrBig
     * @param {String|DateTimeFormatter} [optionalParserOrFormat]
     *
     * @return {Instant|undefined}
     */
    static optInstant(numberOrStringOrBig, optionalParserOrFormat) {
        /**
         * @type {ZonedDateTime}
         */
        let date = Utility.optDateTime(numberOrStringOrBig, optionalParserOrFormat);

        if (!date) {
            return undefined;
        }

        return date.toInstant();
    }

    /**
     * @param {Number|String|Big|BigJsLibrary.BigJS|Instant|null|undefined} numberOrStringOrBig
     * @param {String|DateTimeFormatter} [optionalParserOrFormat]
     *
     * @return {Date|undefined}
     */
    static optDate(numberOrStringOrBig, optionalParserOrFormat) {
        let date = Utility.optDateTime(numberOrStringOrBig, optionalParserOrFormat);

        if (!date) {
            return undefined;
        }

        return convert(date);
    }

    /**
     *
     * @param {String|ZoneOffset|undefined} value
     * @return {ZoneOffset}
     */
    static toTimeZoneOffset(value) {
        if (Utility.isNotExisting(value)) {
            return ZoneOffset.UTC;
        } else if (Utility.isString(value)) {
            return ZoneOffset.of(value);
        } else if (value instanceof ZoneOffset) {
            return value;
        }

        Errors.throwNotSure(value);
    }

    /**
     * @param {Number|String|Big|BigJsLibrary.BigJS|Instant|null|undefined} numberOrStringOrBig
     * @param {String|DateTimeFormatter|ZoneOffset} [optionalDateFormatStringOrDateFormatter]
     *
     * @return {ZonedDateTime|undefined}
     */
    static optDateTime(numberOrStringOrBig, optionalDateFormatStringOrDateFormatter) {
        if (!numberOrStringOrBig) {
            return Utility
                .now()
                .withZoneSameInstant(Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter));
        }

        if (Utility.isDate(numberOrStringOrBig)) {
            return LocalDateTime
                .from(nativeJs(numberOrStringOrBig))
                .atZone(Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter));
        }

        if (Utility.isString(numberOrStringOrBig)) {
            return ZonedDateTime
                .parse(numberOrStringOrBig, Utility.toDateTimeFormatter(optionalDateFormatStringOrDateFormatter));
        }

        if (Utility.isTemporal(numberOrStringOrBig)) {
            /** @type {ZoneOffset} */
            let zone = numberOrStringOrBig.query(TemporalQueries.zone());

            if (!zone) {
                zone = Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter);
            }

            if (numberOrStringOrBig instanceof ZonedDateTime) {
                return numberOrStringOrBig;
            } else if (numberOrStringOrBig instanceof Instant) {
                return ZonedDateTime.ofInstant(numberOrStringOrBig, zone);
            }

            /** @type {LocalTime} */
            let localTime = numberOrStringOrBig.query(TemporalQueries.localTime());
            /** @type {LocalDate} */
            let localDate = numberOrStringOrBig.query(TemporalQueries.localDate());

            if (!localTime) {
                localTime = LocalTime.now(zone).toLocalTime();
            }

            if (!localDate) {
                localDate = LocalDate.now(zone);
            }

            return localTime
                .atDate(localDate)
                .atZone(zone);
        }
    }


    /**
     *
     * This is copied from https://js-joda.github.io/js-joda/esdoc/class/src/format/DateTimeFormatter.js~DateTimeFormatter.html
     *
     *  |Symbol  |Meaning                     |Presentation      |Examples
     *  |--------|----------------------------|------------------|----------------------------------------------------
     *  | G      | era                        | number/text      | 1; 01; AD; Anno Domini
     *  | y      | year                       | year             | 2004; 04
     *  | D      | day-of-year                | number           | 189
     *  | M      | month-of-year              | number/text      | 7; 07; Jul; July; J
     *  | d      | day-of-month               | number           | 10
     *  |        |                            |                  |
     *  | Q      | quarter-of-year            | number/text      | 3; 03; Q3
     *  | Y      | week-based-year            | year             | 1996; 96
     *  | w      | week-of-year               | number           | 27
     *  | W      | week-of-month              | number           | 27
     *  | e      | localized day-of-week      | number           | 2; Tue; Tuesday; T
     *  | E      | day-of-week                | number/text      | 2; Tue; Tuesday; T
     *  | F      | week-of-month              | number           | 3
     *  |        |                            |                  |
     *  | a      | am-pm-of-day               | text             | PM
     *  | h      | clock-hour-of-am-pm (1-12) | number           | 12
     *  | K      | hour-of-am-pm (0-11)       | number           | 0
     *  | k      | clock-hour-of-am-pm (1-24) | number           | 0
     *  |        |                            |                  |
     *  | H      | hour-of-day (0-23)         | number           | 0
     *  | m      | minute-of-hour             | number           | 30
     *  | s      | second-of-minute           | number           | 55
     *  | S      | fraction-of-second         | fraction         | 978
     *  | A      | milli-of-day               | number           | 1234
     *  | n      | nano-of-second             | number           | 987654321
     *  | N      | nano-of-day                | number           | 1234000000
     *  |        |                            |                  |
     *  | V      | time-zone ID               | zone-id          | America/Los_Angeles; Z; -08:30
     *  | z      | time-zone name             | zone-name        | Pacific Standard Time; PST
     *  | X      | zone-offset 'Z' for zero   | offset-X         | Z; -08; -0830; -08:30; -083015; -08:30:15;
     *  | x      | zone-offset                | offset-x         | +0000; -08; -0830; -08:30; -083015; -08:30:15;
     *  | Z      | zone-offset                | offset-Z         | +0000; -0800; -08:00;
     *  |        |                            |                  |
     *  | p      | pad next                   | pad modifier     | 1
     *  |        |                            |                  |
     *  | '      | escape for text            | delimiter        |
     *  | ''     | single quote               | literal          | '
     *  | [      | optional section start     |                  |
     *  | ]      | optional section end       |                  |
     *  | {}     | reserved for future use    |                  |
     *
     * @param {String|DateTimeFormatter|null} [stringOrFormatter]
     * @throws {TypeError} if not sure what to do.
     * @return {DateTimeFormatter}
     */
    static toDateTimeFormatter(stringOrFormatter) {
        if (Utility.isNotExisting(stringOrFormatter)) {
            return DateTimeFormatter.ISO_ZONED_DATE_TIME;
        } else if (Utility.isString(stringOrFormatter)) {
            Preconditions.shouldNotBeBlank(stringOrFormatter);

            return DateTimeFormatter.ofPattern(stringOrFormatter);
        }

        Errors.throwNotSure(stringOrFormatter);
    }

    /**
     * Proxies to Utility.now() if you pass no arguments.
     *
     * This is copied from https://js-joda.github.io/js-joda/esdoc/class/src/format/DateTimeFormatter.js~DateTimeFormatter.html
     *
     *  |Symbol  |Meaning                     |Presentation      |Examples
     *  |--------|----------------------------|------------------|----------------------------------------------------
     *  | G      | era                        | number/text      | 1; 01; AD; Anno Domini
     *  | y      | year                       | year             | 2004; 04
     *  | D      | day-of-year                | number           | 189
     *  | M      | month-of-year              | number/text      | 7; 07; Jul; July; J
     *  | d      | day-of-month               | number           | 10
     *  |        |                            |                  |
     *  | Q      | quarter-of-year            | number/text      | 3; 03; Q3
     *  | Y      | week-based-year            | year             | 1996; 96
     *  | w      | week-of-year               | number           | 27
     *  | W      | week-of-month              | number           | 27
     *  | e      | localized day-of-week      | number           | 2; Tue; Tuesday; T
     *  | E      | day-of-week                | number/text      | 2; Tue; Tuesday; T
     *  | F      | week-of-month              | number           | 3
     *  |        |                            |                  |
     *  | a      | am-pm-of-day               | text             | PM
     *  | h      | clock-hour-of-am-pm (1-12) | number           | 12
     *  | K      | hour-of-am-pm (0-11)       | number           | 0
     *  | k      | clock-hour-of-am-pm (1-24) | number           | 0
     *  |        |                            |                  |
     *  | H      | hour-of-day (0-23)         | number           | 0
     *  | m      | minute-of-hour             | number           | 30
     *  | s      | second-of-minute           | number           | 55
     *  | S      | fraction-of-second         | fraction         | 978
     *  | A      | milli-of-day               | number           | 1234
     *  | n      | nano-of-second             | number           | 987654321
     *  | N      | nano-of-day                | number           | 1234000000
     *  |        |                            |                  |
     *  | V      | time-zone ID               | zone-id          | America/Los_Angeles; Z; -08:30
     *  | z      | time-zone name             | zone-name        | Pacific Standard Time; PST
     *  | X      | zone-offset 'Z' for zero   | offset-X         | Z; -08; -0830; -08:30; -083015; -08:30:15;
     *  | x      | zone-offset                | offset-x         | +0000; -08; -0830; -08:30; -083015; -08:30:15;
     *  | Z      | zone-offset                | offset-Z         | +0000; -0800; -08:00;
     *  |        |                            |                  |
     *  | p      | pad next                   | pad modifier     | 1
     *  |        |                            |                  |
     *  | '      | escape for text            | delimiter        |
     *  | ''     | single quote               | literal          | '
     *  | [      | optional section start     |                  |
     *  | ]      | optional section end       |                  |
     *  | {}     | reserved for future use    |                  |
     *
     * @param {Temporal|LocalDateTime|ZonedDateTime|Number|String|Big|BigJsLibrary.BigJS|Instant|null|undefined} [value]
     * @param {String|DateTimeFormatter} [optionalDateFormatStringOrDateFormatter]
     * @return {ZonedDateTime}
     */
    static toDateTime(value, optionalDateFormatStringOrDateFormatter) {
        if (Utility.isBlank(arguments.length)) {
            return Utility.now();
        }

        let dateTime = Utility.optDateTime(value, optionalDateFormatStringOrDateFormatter);

        if (dateTime) {
            return dateTime;
        }

        Errors.throwNotSure(value);
    }

    /**
     *
     * @return {ZonedDateTime}
     */
    static now() {
        return ZonedDateTime.now();
    }

    /**
     * @param args
     * @return value
     */
    static defaultValue(...args) {
        let result = null;

        Lodash.each(arguments, function (object) {
            if (Utility.isDefined(object)) {
                result = object;
            }
        });

        return result;
    }

    /**
     * @returns {*|Object}
     */
    static defaultObject() {
        let result = null;

        Lodash.each(arguments, function (object) {
            if (Utility.isObject(object)) {
                result = object;
            }
        });

        return result;
    }

    /**
     *
     * @param {Object} target
     * @param {String|{}} propertyNameOrObject
     * @param {*} [propertyValueOrUndefined]
     * @returns {Object}
     */
    set(target, propertyNameOrObject, propertyValueOrUndefined) {
        Preconditions.shouldBeObject(target);

        if (Utility.isString(propertyNameOrObject)) {
            let propertyName = propertyNameOrObject;
            let propertyValue = propertyValueOrUndefined;

            Preconditions.shouldBeString(propertyName);
            Preconditions.shouldNotBeBlank(propertyName);
            Preconditions.shouldBeDefined(propertyValue);

            return Ember.set(target, propertyName, propertyValue);
        } else if (Utility.isObject(propertyNameOrObject)) {
            Preconditions.shouldBeUndefined(propertyValueOrUndefined);

            Lodash.each(propertyNameOrObject, function (value, key) {
                Utility.set(target, key, value);
            });
        }
    }

    /**
     * Applies all of the defaults onto the first object.
     *
     * @param {Object} object
     * @param {Object} defaults
     * @returns {Object} The original object.
     */
    static defaults(object, defaults) {
        Preconditions.shouldBeObject(object, 'target object must be object.');
        Preconditions.shouldBeObject(defaults, 'defaults object must be object.');

        let updates = Object.keys(defaults);

        for (let i = 0, l = updates.length; i < l; i++) {
            let prop = updates[i];
            let value = Ember.get(defaults, prop);

            Ember.set(object, prop, value);
        }

        return object;
    }

    /**
     *
     * @param {Object} object
     * @param {String|Array} stringOrArray
     * @param {String|Object} [defaults]
     */
    static get(object, stringOrArray, defaults) {
        defaults = defaults || {};

        let mode = Utility.isString(stringOrArray) ? 'single' : (Utility.isArray(stringOrArray) ? 'multiple' : 'error');

        Preconditions.shouldBeTrue(mode != 'error', `I do not know what to do with ${stringOrArray}`);
        Preconditions.shouldBeObject(object, 'target object must be object.');

        if ('single' === mode) {
            //noinspection UnnecessaryLocalVariableJS
            let path = stringOrArray;

            return Ember.getWithDefault(object, path, defaults);
        } else if ('multiple' === mode) {
            //noinspection UnnecessaryLocalVariableJS
            let array = stringOrArray;
            let result = Ember.getProperties(array);

            if (Utility.isDefined(defaults)) {
                return Utility.defaults(result, defaults);
            } else {
                return result;
            }
        }

        throw new Error(`Not sure what to do here`);
    }

    /**
     *
     * @param {Class} clazz
     * @return {String|undefined}
     */
    static optClassName(clazz) {
        if (!clazz) {
            return undefined;
        }

        if (Utility.isClass(clazz)) {
            return clazz.toString() || clazz.constructor.name;
        } else if (Utility.isInstance(clazz)) {
            return Utility.optClassName(clazz.toClass());
        }

        Errors.throwNotSure(clazz);
    }
}

export default Utility;