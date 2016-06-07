'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _ember = require("./ember");

var _ember2 = _interopRequireDefault(_ember);

var _CoreObject = require("./CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @singleton
 */

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, null, [{
        key: "isObject",


        /**
         * @param {*} object
         * @returns {boolean}
         */
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
    }, {
        key: "emptyFn",
        value: function emptyFn() {}
    }, {
        key: "yes",
        value: function yes() {
            return true;
        }
    }, {
        key: "no",
        value: function no() {
            return false;
        }
    }, {
        key: "ok",
        value: function ok() {
            return this;
        }
    }, {
        key: "identityFn",
        value: function identityFn() {
            return this;
        }
    }, {
        key: "passthroughFn",
        value: function passthroughFn(arg) {
            return arg;
        }

        /**
         * Uses Lodash.get, but then removes the key from the parent object.
         *
         * @param {Object} object
         * @param {String|Object|Array} keyAsStringObjectArray
         * @param {Function|Class} [optionalTypeDeclaration]
         *
         * @returns {*}
         */

    }, {
        key: "take",
        value: function take(object, keyAsStringObjectArray, optionalTypeDeclaration) {
            if (!object) {
                return undefined;
            }

            _Preconditions2.default.shouldBeDefined(keyAsStringObjectArray, 'key must be defined');

            /**
             *
             * @param {Function|undefined} [validatorFn]
             * @param {*} value
             * @returns {*}
             */
            function executeValidator(validatorFn, value) {
                if (validatorFn) {
                    _Preconditions2.default.shouldNotBeFalsey(validatorFn(value), 'Failed validation: ' + value);
                }

                return value;
            }

            if (Utility.isString(keyAsStringObjectArray)) {
                /** @type {String} */
                var key = keyAsStringObjectArray;
                var value = Utility.result(object, key);
                var validatorFn = Utility.yes;

                if (Utility.isClass(optionalTypeDeclaration)) {
                    validatorFn = Utility.typeMatcher(optionalTypeDeclaration);
                } else if (Utility.isFunction(optionalTypeDeclaration)) {
                    validatorFn = optionalTypeDeclaration;
                } else if (Utility.isNullOrUndefined(keyAsStringObjectArray)) {
                    validatorFn = Utility.yes;
                }

                if (-1 != key.indexOf('.')) {
                    // It's an object path.
                    var parentPath = key.substring(0, key.lastIndexOf('.'));
                    var itemKey = key.substring(key.lastIndexOf('.') + 1);
                    var parent = Utility.result(object, parentPath);

                    delete parent[itemKey];
                } else {
                    delete object[keyAsStringObjectArray];
                }

                return executeValidator(validatorFn, value);
            } else if (Utility.isArray(keyAsStringObjectArray) || Utility.isObject(keyAsStringObjectArray)) {
                var _ret = function () {
                    var result = {};
                    var array_mode = Utility.isArray(keyAsStringObjectArray);

                    var defaults = _lodash2.default.defaults(Utility.result(keyAsStringObjectArray, 'defaults') || {}, {
                        required: false,
                        validator: null
                    });

                    _lodash2.default.forEach(keyAsStringObjectArray, function ( /** @type {String|Object|Function} */rulesetOrObject, /** @type {String} */keyOrIndex) {
                        var key = keyOrIndex;
                        var ruleset = rulesetOrObject;

                        if (array_mode) {
                            if (Utility.isString(rulesetOrObject)) {
                                key = rulesetOrObject;
                                ruleset = _lodash2.default.assign({}, defaults);
                            } else if (Utility.isObject(rulesetOrObject)) {
                                key = Utility.result(rulesetOrObject, 'key');
                                ruleset = rulesetOrObject;
                            }
                        } else {
                            key = keyOrIndex;
                            ruleset = rulesetOrObject;
                        }

                        /** @type {String} */
                        var type = Utility.typeOf(ruleset);

                        if ('string' === type) {
                            // The ruleset is a data type
                            /** @type {String} */
                            var _requiredType = ruleset;

                            ruleset = {
                                key: key,
                                type: _requiredType,
                                validator: null
                            };
                        } else if ('object' === type) {
                            // this is a ruleset that overrides our ruleset.
                            ruleset = _lodash2.default.defaults({ key: key }, ruleset);
                        } else if ('function' === type) {
                            var fn = ruleset;

                            ruleset = {
                                key: key,
                                validator: fn
                            };
                        } else {
                            throw new Error('Cannot determine what to do with: ' + type + ': ' + ruleset);
                        }

                        ruleset = _lodash2.default.defaults(ruleset, defaults);

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

                        var entry = executeValidator(ruleset.validator, Utility.take(object, key));

                        if (ruleset.required && Utility.isUndefined(entry)) {
                            throw new Error('Required key not present: ' + ruleset.key);
                        }

                        result[key] = entry;
                    });

                    return {
                        v: result
                    };
                }();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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
            var type = _ember2.default.typeOf(object);

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
                }
            }

            return type;
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
    }, {
        key: "isFunction",
        value: function isFunction(fn) {
            return 'function' === Utility.typeOf(fn);
        }
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
         *
         * @param {String} string
         * @return {boolean}
         */

    }, {
        key: "isBlank",
        value: function isBlank(string) {
            if (Utility.isNullOrUndefined(string)) {
                return true;
            }

            _Preconditions2.default.shouldBeString(string);

            return _ember2.default.isBlank(string);
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
         *
         * @param {Object} object
         * @param {Object} defaults
         * @returns {Object} The original object.
         */

    }, {
        key: "defaults",
        value: function defaults(object, _defaults) {
            _Preconditions2.default.shouldBeObject(object);
            _Preconditions2.default.shouldBeObject(_defaults);

            var updates = Object.keys(_defaults);

            for (var i = 0, l = updates.length; i < l; i++) {
                var prop = updates[i];
                var value = _ember2.default.get(_defaults, prop);

                _ember2.default.set(object, prop, value);
            }

            return object;
        }
    }]);

    return Utility;
}();

exports.default = Utility;
module.exports = exports['default'];
//# sourceMappingURL=Utility.js.map