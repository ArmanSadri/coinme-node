'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _ember = require("./ember");

var _ember2 = _interopRequireDefault(_ember);

var _CoreObject = require("./CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

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
            return Utility.typeOf(object) === 'class';
        }
    }, {
        key: "isInstance",
        value: function isInstance(object) {
            return Utility.typeOf(object) === 'instance';
        }
    }, {
        key: "take",
        value: function take(object, key) {
            if (!object) {
                return undefined;
            }

            var value = _lodash2.default.get(object, key);

            if (-1 != key.indexOf('.')) {
                // It's an object path.
                var parentPath = key.substring(0, key.lastIndexOf('.'));
                var itemKey = key.substring(key.lastIndexOf('.') + 1);
                var parent = _lodash2.default.get(object, parentPath);

                delete parent[itemKey];
            } else {
                delete object[key];
            }

            return value;
        }

        /**
         * Creates a test method. Uses Utility.typeOf()
         *
         * @param {String} type
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

                if ('string' !== typeOfType) {
                    _Preconditions2.default.fail('string', type, "The type passed in was not a string. It was " + typeOfType);
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

                _Preconditions2.default.shouldBeTrue(knownTypes[type], 'unknown type: ' + type);
            }

            /**
             * @param {*} object
             */
            return function (object) {
                var existingType = Utility.typeOf(object);

                if ('object' === type || 'instance' === type) {
                    return 'object' === existingType || 'instance' === existingType;
                }

                return type === existingType;
            };
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

                if (_CoreObject2.default.isClass(object)) {
                    return 'class';
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