'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/** @type {Preconditions} */

/** @type {Ember} **/


var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Ember = require("./Ember");

var _Ember2 = _interopRequireDefault(_Ember);

var _CoreObject = require("./CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

var _errors = require("./errors");

var _big = require("big.js/big");

var _big2 = _interopRequireDefault(_big);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _osenv = require("osenv");

var _osenv2 = _interopRequireDefault(_osenv);

var _jsJoda = require("js-joda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TEMPORALS = {
    'Instant': _jsJoda.Instant,
    'LocalTime': _jsJoda.LocalTime,
    'LocalDate': _jsJoda.LocalDate,
    'LocalDateTime': _jsJoda.LocalDateTime,
    'ZonedDateTime': _jsJoda.ZonedDateTime
};

var EMAIL_PATTERN = /(?:\w)+(?:\w|-|\.|\+)*@(?:\w)+(?:\w|\.|-)*\.(?:\w|\.|-)+$/;

/**
 * @class
 * @singleton
 */

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, [{
        key: "set",


        /**
         *
         * @param {Object} target
         * @param {String|{}} propertyNameOrObject
         * @param {*} [propertyValueOrUndefined]
         * @returns {Object}
         */
        value: function set(target, propertyNameOrObject, propertyValueOrUndefined) {
            _Preconditions2.default.shouldBeObject(target);

            if (Utility.isString(propertyNameOrObject)) {
                var propertyName = propertyNameOrObject;
                var propertyValue = propertyValueOrUndefined;

                _Preconditions2.default.shouldBeString(propertyName);
                _Preconditions2.default.shouldNotBeBlank(propertyName);
                _Preconditions2.default.shouldBeDefined(propertyValue);

                return _Ember2.default.set(target, propertyName, propertyValue);
            } else if (Utility.isObject(propertyNameOrObject)) {
                _Preconditions2.default.shouldBeUndefined(propertyValueOrUndefined);

                _lodash2.default.each(propertyNameOrObject, function (value, key) {
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

    }], [{
        key: "getPath",


        /**
         *
         * @param {URI|String|{baseUri:URI|String, uri:URI|String}} path
         * @return {URI}
         */
        value: function getPath(path) {
            var input = path;
            var output = void 0;

            if (Utility.isNotExisting(path)) {
                output = undefined;
            } else if (Utility.isString(path)) {
                path = path.trim();

                if (path.startsWith('~/')) {
                    path = path.substring(2);

                    output = _urijs2.default.joinPaths(_osenv2.default.home(), path);
                } else {
                    output = (0, _urijs2.default)(path);
                }
            } else if (path instanceof _urijs2.default) {
                output = path;
            } else if (path.uri || path.baseUri) {
                var baseUri = Utility.getPath(path.baseUri) || '';
                var uri = Utility.getPath(path.uri) || '';

                if (uri.toString().startsWith('/')) {
                    // absolute uri
                    output = uri;
                } else {
                    output = _urijs2.default.joinPaths(baseUri, uri).toString();
                }
            }

            if (output) {
                return output;
            }

            throw new Error("I don't know what to do here: " + input);
        }
    }, {
        key: "isTemporal",
        value: function isTemporal(value) {
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

    }, {
        key: "isSameType",
        value: function isSameType(one, two) {
            var type1 = Utility.typeOf(one);
            var type2 = Utility.typeOf(two);

            return type1 === type2;
        }

        /**
         *
         * @param {String|null|undefined} string
         * @return {String|undefined}
         */

    }, {
        key: "optLowerCase",
        value: function optLowerCase(string) {
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

    }, {
        key: "isStringEqualIgnoreCase",
        value: function isStringEqualIgnoreCase(string1, string2) {
            if (Utility.isNotExisting(string1) || Utility.isNotExisting(string2)) {
                return Utility.isSameType(string1, string2);
            }

            return Utility.isStringEqual(Utility.optLowerCase(string1), Utility.optLowerCase(string2));
        }

        /**
         * (null, null) -> true
         *
         * @param {String|*} string1
         * @param {String|*} string2
         * @return {boolean}
         */

    }, {
        key: "isStringEqual",
        value: function isStringEqual(string1, string2) {
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

    }, {
        key: "isObject",
        value: function isObject(object) {
            var type = Utility.typeOf(object);

            return 'object' === type || 'instance' === type;
        }

        /**
         *
         * @param {*} object
         * @returns {Class}
         */

    }, {
        key: "toClass",
        value: function toClass(object) {
            if (Utility.isClass(object)) {
                return object;
            } else if (Utility.isObject(object)) {
                return object.toClass();
            }

            _Preconditions2.default.fail('object|class', Utility.typeOf(object), 'Must be correct type');
        }
    }, {
        key: "isNumber",
        value: function isNumber(object) {
            return 'number' === Utility.typeOf(object);
        }
    }, {
        key: "isClass",
        value: function isClass(object) {
            return 'class' === Utility.typeOf(object);
        }
    }, {
        key: "isInstance",
        value: function isInstance(object) {
            return 'instance' === Utility.typeOf(object);
        }
    }, {
        key: "isError",
        value: function isError(object) {
            return 'error' === Utility.typeOf(object);
        }

        /**
         *
         * @param {*} object
         * @param {String} path
         * @param {*} [defaultValue]
         * @returns {*}
         */

    }, {
        key: "result",
        value: function result(object, path, defaultValue) {
            return _lodash2.default.get.apply(_lodash2.default, arguments);
        }

        /**
         * @param {CoreObject|Class<CoreObject>} instance - Must be an instance of CoreObject (or subclass)
         */

    }, {
        key: "toClassOrFail",
        value: function toClassOrFail(instance) {
            if (Utility.isInstance(instance)) {} else if (Utility.isClass(instance)) {} else {
                _Preconditions2.default.fail(_CoreObject2.default, instance, 'Was not an instance or class. Cannot continue');
            }

            return instance.toClass();
        }

        /**
         *
         * @param boolean
         * @returns {*}
         */

    }, {
        key: "ifBoolean",
        value: function ifBoolean(boolean) {
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

    }, {
        key: "take",
        value: function take(object, keyAsStringObjectArray, optionalTypeDeclarationOrDefaults, requiredByDefault) {
            if (!object) {
                object = {};
            }

            _Preconditions2.default.shouldBeDefined(keyAsStringObjectArray, 'key must be defined');

            //region utilities
            /**
             *
             * @param {{[scope]: Object, [adapter]: function, [validator]: function, [adapter]: function}}  ruleset
             * @param {String} key
             * @param {*} value
             * @returns {*}
             */
            function executeValidator(ruleset, key, value) {
                var fn = _lodash2.default.get(ruleset, 'validator');
                var scope = _lodash2.default.get(ruleset, 'scope') || this;

                if (fn) {
                    _Preconditions2.default.shouldBeFunction(fn, 'validator must be type of function');
                    _Preconditions2.default.shouldBeTrue(false !== fn.call(scope, value), 'Failed validation: {key:\'' + key + '\' value:\'' + value + '\'');
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
                var fn = _lodash2.default.get(ruleset, 'adapter');
                var scope = _lodash2.default.get(ruleset, 'scope') || this;

                if (fn) {
                    _Preconditions2.default.shouldBeFunction(fn, 'Validator must be a function');

                    value = fn.call(scope, value);
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
                var required = _lodash2.default.get(ruleset, 'required');

                if (Utility.isDefined(ruleset.defaultValue)) {
                    if (!value) {
                        value = ruleset.defaultValue;
                    }
                }

                if (true === required) {
                    if (Utility.isNullOrUndefined(value)) {
                        _Preconditions2.default.shouldBeExisting(value, "Utility.take(). 'key=" + key + "' is required");
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

                var type = _lodash2.default.get(ruleset, 'type');

                if (type) {
                    _Preconditions2.default.shouldBeType(type, value, key + " was wrong type.");
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
            var global_defaults = {};

            _Preconditions2.default.shouldNotBeInstance(optionalTypeDeclarationOrDefaults, 'the 3rd parameter cannot be an instance of a CoreObject field.');

            if (Utility.isObject(optionalTypeDeclarationOrDefaults)) {
                if (Utility.isClass(optionalTypeDeclarationOrDefaults)) {
                    global_defaults = {
                        type: optionalTypeDeclarationOrDefaults
                    };
                } else {
                    global_defaults = _lodash2.default.assign(global_defaults, optionalTypeDeclarationOrDefaults);
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

                _Preconditions2.default.shouldBeUndefined(requiredByDefault, 'You provided two booleans. That\'s strange.');
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
                var ruleset = {};

                ruleset = _lodash2.default.defaults(ruleset, defaults || {}, global_defaults, {
                    required: false,
                    validator: null
                });

                return ruleset;
            }

            //endregion

            var mode = Utility.typeOf(keyAsStringObjectArray);

            //region String Mode
            if ('string' === mode) {
                /** @type {String} */
                var key = keyAsStringObjectArray;
                keyAsStringObjectArray = null;

                /** @type {*} */
                var value = Utility.result(object, key);

                /**
                 * @type {{validator?:function, required?:boolean, type?: string|object}}
                 */
                var ruleset = toRuleset();

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
                    var parentPath = key.substring(0, key.lastIndexOf('.'));
                    var itemKey = key.substring(key.lastIndexOf('.') + 1);
                    var parent = Utility.result(object, parentPath);

                    delete parent[itemKey];
                } else {
                    delete object[key];
                }

                return executeChecks(ruleset, key, value);
            }
            //endregion

            //region Array/Object mode
            if ('array' === mode || 'object' === mode) {
                var _ret = function () {
                    var result = {};

                    var defaults = toRuleset(Utility.result(keyAsStringObjectArray, 'defaults', {}));

                    _lodash2.default.forEach(keyAsStringObjectArray,

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
                        var key = void 0;

                        /**
                         * @type {Object}
                         */
                        var ruleset = void 0;

                        if ('array' === mode) {
                            if (Utility.isString(rulesetOrObject)) {
                                key = rulesetOrObject;
                                ruleset = _lodash2.default.defaults({}, defaults);

                                // if (Utility.isObject(optionalTypeDeclarationOrDefaults)) {
                                //     ruleset = Lodash.defaults(ruleset, optionalTypeDeclarationOrDefaults);
                                // }
                            } else if (Utility.isObject(rulesetOrObject)) {
                                /**
                                 * @type {String}
                                 */
                                key = _Preconditions2.default.shouldBeString(Utility.result(rulesetOrObject, 'key'), 'key not defined');
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
                            _Preconditions2.default.fail('array|object', mode, 'Unknown mode');
                        }

                        _Preconditions2.default.shouldNotBeBlank(key, 'Key must be defined by here in all situations.');
                        _Preconditions2.default.shouldBeObject(ruleset, 'Must have a valid ruleset: ' + ruleset);

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

                        ruleset = _lodash2.default.defaults(ruleset, defaults);

                        var requiredType = ruleset.type;

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

                    return {
                        v: result
                    };
                }();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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

    }, {
        key: "typeMatcher",
        value: function typeMatcher(type) {
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

            var knownTypes = {
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
                var typeOfType = Utility.typeOf(type);

                if (!('string' === typeOfType || 'class' === typeOfType)) {
                    _Preconditions2.default.fail('string', type, "The type passed in was not a string|class. It was " + typeOfType);
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

                    _Preconditions2.default.shouldBeTrue(knownTypes[type], 'unknown type: ' + type);

                    return function ( /** @type {*} */object) {
                        var objectType = Utility.typeOf(object);

                        if ('object' === type || 'instance' === type) {
                            return 'object' === objectType || 'instance' === objectType;
                        }

                        return type === objectType;
                    };
                } else if (Utility.isClass(type)) {
                    /**
                     * @type {Class<CoreObject>}
                     */
                    return function ( /** @type {*} */object) {
                        return type.isInstance(object);
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

    }, {
        key: "typeOf",
        value: function typeOf(object) {
            var type = _Ember2.default.typeOf(object);

            if ('function' === type) {
                // Let's isClass a bit further.

                if (_CoreObject2.default.isClass(object) || _errors.Errors.isErrorClass(object)) {
                    return 'class';
                } else if (_errors.Errors.isErrorInstance(object)) {
                    return 'error';
                }
            } else if ('object' === type) {
                if (_CoreObject2.default.isInstance(object)) {
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

    }, {
        key: "isDate",
        value: function isDate(value) {
            return 'date' === Utility.typeOf(value);
        }

        /**
         *
         * @param {String} string
         * @returns {boolean}
         */

    }, {
        key: "isEmail",
        value: function isEmail(string) {
            _Preconditions2.default.shouldBeString(string, 'Should be string');

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

    }, {
        key: "isArray",
        value: function isArray(object) {
            return 'array' === Utility.typeOf(object);
        }

        /**
         *
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isBoolean",
        value: function isBoolean(object) {
            return 'boolean' === Utility.typeOf(object);
        }

        /**
         *
         * @param {*} object
         * @return {boolean}
         */

    }, {
        key: "isUndefined",
        value: function isUndefined(object) {
            return 'undefined' === Utility.typeOf(object);
        }

        /**
         *
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isDefined",
        value: function isDefined(object) {
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

    }, {
        key: "isString",
        value: function isString(object) {
            return 'string' === Utility.typeOf(object);
        }

        /**
         * Determines if the argument is a Number, String, null, undefined
         *
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isPrimitive",
        value: function isPrimitive(object) {
            if (Utility.isNullOrUndefined(object)) {
                return true;
            }

            var type = Utility.typeOf(object);
            var primitives = ['number', 'string'];

            return -1 !== primitives.indexOf(type);
        }

        /**
         * Determine if something is a promise
         *
         * @param {*} object
         * @return boolean
         */

    }, {
        key: "isPromise",
        value: function isPromise(object) {
            return _bluebird2.default.is(object);
        }

        /**
         *
         * @param valueOrFn
         */

    }, {
        key: "isTruthy",
        value: function isTruthy(valueOrFn) {
            var value = void 0;

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

    }, {
        key: "isFunction",
        value: function isFunction(fn) {
            return 'function' === Utility.typeOf(fn);
        }

        /**
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isNotFunction",
        value: function isNotFunction(object) {
            return 'function' !== Utility.typeOf(object);
        }

        /**
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isNaN",
        value: function isNaN(object) {
            return _lodash2.default.isNaN(object);
        }

        /**
         *
         * @param {*} anything
         * @returns {boolean}
         */

    }, {
        key: "isNull",
        value: function isNull(anything) {
            return 'null' === Utility.typeOf(anything);
        }

        /**
         *
         * @param {CoreObject|Class} object
         * @returns {Class|*|Class.<CoreObject>}
         */

    }, {
        key: "getClass",
        value: function getClass(object) {
            if (Utility.isClass(object)) {
                return object;
            }

            _Preconditions2.default.shouldBeInstance(object);

            return object.toClass();
        }

        /**
         * @param {String|Number|Big|null|NaN|undefined} numberOrStringOrBig
         * @returns {Big}
         */

    }, {
        key: "toBigNumber",
        value: function toBigNumber(numberOrStringOrBig) {
            if (Utility.isNullOrUndefined(numberOrStringOrBig)) {
                numberOrStringOrBig = 0;
            }

            if (numberOrStringOrBig instanceof _big2.default) {
                return numberOrStringOrBig;
            } else if (Utility.isString(numberOrStringOrBig) || Utility.isNumber(numberOrStringOrBig)) {
                return new _big2.default(numberOrStringOrBig);
            }

            _Preconditions2.default.fail('Number|String|Big', numberOrStringOrBig, 'Unsupported type');
        }

        /**
         *
         * @param {Class|CoreObject|null|undefined} object
         * @returns {Class|undefined}
         */

    }, {
        key: "optClass",
        value: function optClass(object) {
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

    }, {
        key: "toLowerCase",
        value: function toLowerCase(string) {
            if (Utility.isBlank(string)) {
                return string;
            }

            _Preconditions2.default.shouldBeString(string);

            return string.toLowerCase();
        }

        /**
         * Null-safe way to uppercase.
         *
         * @param {String} string
         * @returns {String}
         */

    }, {
        key: "toUpperCase",
        value: function toUpperCase(string) {
            if (Utility.isBlank(string)) {
                return string;
            }

            _Preconditions2.default.shouldBeString(string);

            return string.toUpperCase();
        }

        /**
         *
         * @param object
         */

    }, {
        key: "optString",
        value: function optString(object) {
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

    }, {
        key: "optJson",
        value: function optJson(object) {
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

    }, {
        key: "isExisting",
        value: function isExisting(anything) {
            var u = Utility.isUndefined(anything);
            var n = Utility.isNaN(anything);
            var nu = Utility.isNull(anything);

            return !(u || n || nu);
        }

        /**
         * The opposite of existing.
         *
         * @param {*} anything
         * @returns {boolean}
         */

    }, {
        key: "isNotExisting",
        value: function isNotExisting(anything) {
            return !Utility.isExisting(anything);
        }

        /**
         *
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: "isFalsey",
        value: function isFalsey(object) {
            return !object;
        }

        /**
         *
         * @param object
         */

    }, {
        key: "isNotFalsey",
        value: function isNotFalsey(object) {
            return !Utility.isFalsey(object);
        }

        /**
         * Shorthand for value
         *
         * @param value
         * @returns {boolean}
         */

    }, {
        key: "isNullOrUndefined",
        value: function isNullOrUndefined(value) {
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

    }, {
        key: "isBlank",
        value: function isBlank(stringOrArrayOrNumber) {
            if (!stringOrArrayOrNumber) {
                return true;
            }

            if (Utility.isNotExisting(stringOrArrayOrNumber)) {
                return true;
            }

            var type = Utility.typeOf(stringOrArrayOrNumber);
            if ('number' === type) {
                return 0 == stringOrArrayOrNumber;
            }

            if (!('array' === type || 'string' === type || 'number' === type)) {
                _Preconditions2.default.fail('type|array', type, "isBlank does not support " + type);
            }

            return _Ember2.default.isBlank(stringOrArrayOrNumber);
        }

        /**
         *
         * @param {String} string
         * @return {boolean}
         */

    }, {
        key: "isNotBlank",
        value: function isNotBlank(string) {
            return !Utility.isBlank(string);
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "defaultNumber",
        value: function defaultNumber() {
            var result = 0;

            _lodash2.default.each(arguments, function (object) {
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

    }, {
        key: "isNumeric",
        value: function isNumeric(value) {
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

    }, {
        key: "toNumberOrFail",
        value: function toNumberOrFail(value) {
            if (Utility.isNullOrUndefined(value)) {
                return 0;
            } else if (Utility.isNumber(value)) {
                return value;
            } else if (Utility.isString(value)) {
                return Number.parseFloat(value);
            } else if (value instanceof _big2.default) {
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

    }, {
        key: "optInstant",
        value: function optInstant(numberOrStringOrBig, optionalParserOrFormat) {
            /**
             * @type {ZonedDateTime}
             */
            var date = Utility.optDateTime(numberOrStringOrBig, optionalParserOrFormat);

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

    }, {
        key: "optDate",
        value: function optDate(numberOrStringOrBig, optionalParserOrFormat) {
            var date = Utility.optDateTime(numberOrStringOrBig, optionalParserOrFormat);

            if (!date) {
                return undefined;
            }

            return (0, _jsJoda.convert)(date);
        }

        /**
         *
         * @param {String|ZoneOffset|undefined} value
         * @return {ZoneOffset}
         */

    }, {
        key: "toTimeZoneOffset",
        value: function toTimeZoneOffset(value) {
            if (Utility.isNotExisting(value)) {
                return _jsJoda.ZoneOffset.UTC;
            } else if (Utility.isString(value)) {
                return _jsJoda.ZoneOffset.of(value);
            } else if (value instanceof _jsJoda.ZoneOffset) {
                return value;
            }

            _errors.Errors.throwNotSure(value);
        }

        /**
         * @param {Number|String|Big|BigJsLibrary.BigJS|Instant|null|undefined} numberOrStringOrBig
         * @param {String|DateTimeFormatter|ZoneOffset} [optionalDateFormatStringOrDateFormatter]
         *
         * @return {ZonedDateTime|undefined}
         */

    }, {
        key: "optDateTime",
        value: function optDateTime(numberOrStringOrBig, optionalDateFormatStringOrDateFormatter) {
            if (!numberOrStringOrBig) {
                return Utility.now().withZoneSameInstant(Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter));
            }

            if (Utility.isDate(numberOrStringOrBig)) {
                return _jsJoda.LocalDateTime.from((0, _jsJoda.nativeJs)(numberOrStringOrBig)).atZone(Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter));
            }

            if (Utility.isString(numberOrStringOrBig)) {
                return _jsJoda.ZonedDateTime.parse(numberOrStringOrBig, Utility.toDateTimeFormatter(optionalDateFormatStringOrDateFormatter));
            }

            if (Utility.isTemporal(numberOrStringOrBig)) {
                /** @type {ZoneOffset} */
                var zone = numberOrStringOrBig.query(_jsJoda.TemporalQueries.zone());

                if (!zone) {
                    zone = Utility.toTimeZoneOffset(optionalDateFormatStringOrDateFormatter);
                }

                if (numberOrStringOrBig instanceof _jsJoda.ZonedDateTime) {
                    return numberOrStringOrBig;
                } else if (numberOrStringOrBig instanceof _jsJoda.Instant) {
                    return _jsJoda.ZonedDateTime.ofInstant(numberOrStringOrBig, zone);
                }

                /** @type {LocalTime} */
                var localTime = numberOrStringOrBig.query(_jsJoda.TemporalQueries.localTime());
                /** @type {LocalDate} */
                var localDate = numberOrStringOrBig.query(_jsJoda.TemporalQueries.localDate());

                if (!localTime) {
                    localTime = _jsJoda.LocalTime.now(zone).toLocalTime();
                }

                if (!localDate) {
                    localDate = _jsJoda.LocalDate.now(zone);
                }

                return localTime.atDate(localDate).atZone(zone);
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

    }, {
        key: "toDateTimeFormatter",
        value: function toDateTimeFormatter(stringOrFormatter) {
            if (Utility.isNotExisting(stringOrFormatter)) {
                return _jsJoda.DateTimeFormatter.ISO_ZONED_DATE_TIME;
            } else if (Utility.isString(stringOrFormatter)) {
                _Preconditions2.default.shouldNotBeBlank(stringOrFormatter);

                return _jsJoda.DateTimeFormatter.ofPattern(stringOrFormatter);
            }

            _errors.Errors.throwNotSure(stringOrFormatter);
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

    }, {
        key: "toDateTime",
        value: function toDateTime(value, optionalDateFormatStringOrDateFormatter) {
            if (Utility.isBlank(arguments.length)) {
                return Utility.now();
            }

            var dateTime = Utility.optDateTime(value, optionalDateFormatStringOrDateFormatter);

            if (dateTime) {
                return dateTime;
            }

            _errors.Errors.throwNotSure(value);
        }

        /**
         *
         * @return {ZonedDateTime}
         */

    }, {
        key: "now",
        value: function now() {
            return _jsJoda.ZonedDateTime.now();
        }

        /**
         * @param args
         * @return value
         */

    }, {
        key: "defaultValue",
        value: function defaultValue() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var result = null;

            _lodash2.default.each(arguments, function (object) {
                if (Utility.isDefined(object)) {
                    result = object;
                }
            });

            return result;
        }

        /**
         * @returns {*|Object}
         */

    }, {
        key: "defaultObject",
        value: function defaultObject() {
            var result = null;

            _lodash2.default.each(arguments, function (object) {
                if (Utility.isObject(object)) {
                    result = object;
                }
            });

            return result;
        }
    }, {
        key: "defaults",
        value: function defaults(object, _defaults) {
            _Preconditions2.default.shouldBeObject(object, 'target object must be object.');
            _Preconditions2.default.shouldBeObject(_defaults, 'defaults object must be object.');

            var updates = Object.keys(_defaults);

            for (var i = 0, l = updates.length; i < l; i++) {
                var prop = updates[i];
                var value = _Ember2.default.get(_defaults, prop);

                _Ember2.default.set(object, prop, value);
            }

            return object;
        }

        /**
         *
         * @param {Object} object
         * @param {String|Array} stringOrArray
         * @param {String|Object} [defaults]
         */

    }, {
        key: "get",
        value: function get(object, stringOrArray, defaults) {
            defaults = defaults || {};

            var mode = Utility.isString(stringOrArray) ? 'single' : Utility.isArray(stringOrArray) ? 'multiple' : 'error';

            _Preconditions2.default.shouldBeTrue(mode != 'error', "I do not know what to do with " + stringOrArray);
            _Preconditions2.default.shouldBeObject(object, 'target object must be object.');

            if ('single' === mode) {
                //noinspection UnnecessaryLocalVariableJS
                var path = stringOrArray;

                return _Ember2.default.getWithDefault(object, path, defaults);
            } else if ('multiple' === mode) {
                //noinspection UnnecessaryLocalVariableJS
                var array = stringOrArray;
                var result = _Ember2.default.getProperties(array);

                if (Utility.isDefined(defaults)) {
                    return Utility.defaults(result, defaults);
                } else {
                    return result;
                }
            }

            throw new Error("Not sure what to do here");
        }

        /**
         *
         * @param {Class} clazz
         * @return {String|undefined}
         */

    }, {
        key: "optClassName",
        value: function optClassName(clazz) {
            if (!clazz) {
                return undefined;
            }

            if (Utility.isClass(clazz)) {
                return clazz.toString() || clazz.constructor.name;
            } else if (Utility.isInstance(clazz)) {
                return Utility.optClassName(clazz.toClass());
            }

            _errors.Errors.throwNotSure(clazz);
        }
    }]);

    return Utility;
}();

exports.default = Utility;
//# sourceMappingURL=Utility.js.map