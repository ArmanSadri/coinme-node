'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _index = require("lodash/index");

var _index2 = _interopRequireDefault(_index);

var _CoreObject = require("./CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

var _AbstractError = require("./errors/AbstractError");

var _AbstractError2 = _interopRequireDefault(_AbstractError);

var _errors = require("./errors");

var _jsJoda = require("js-joda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// /**
//  *
//  * @param {*} expectedValue
//  * @param {*} actualValue
//  * @param {String} [message]
//  * @param {Error} [optionalCause]
//  * @constructor
//  */
// function PreconditionsError(expectedValue, actualValue, message, optionalCause) {
//     var error = Error.call(this, message);
//
//     this.name = 'PreconditionsError';
//     this.stack = error.stack;
//     this.cause = optionalCause;
//
//     this.expectedValue = expectedValue;
//     this.actualValue = actualValue;
//     this.message = `failure (expected: '${this.expectedValue}' [${Utility.typeOf(this.expectedValue)}]) (actual: '${this.actualValue}' [${Utility.typeOf(this.actualValue)}]) (message: ${this.message})`;
// }
//
// PreconditionsError.prototype = Object.create(Error.prototype);
// PreconditionsError.prototype.constructor = PreconditionsError;
//
// export { PreconditionsError }

/**
 * @singleton
 * @class Preconditions
 */
var Preconditions = function () {
    function Preconditions() {
        _classCallCheck(this, Preconditions);
    }

    _createClass(Preconditions, null, [{
        key: "fail",


        /**
         *
         * @param {*} expectedValue
         * @param {*} actualValue
         * @param {String} [message]
         */
        value: function fail(expectedValue, actualValue, message) {
            throw new _errors.PreconditionsError({
                expectedValue: expectedValue,
                actualValue: actualValue,
                message: message || 'Preconditions failure'
            });
        }

        /**
         *
         * @param {*} object
         * @param {String} [message]
         * return {*} object
         */

    }, {
        key: "shouldBeUndefined",
        value: function shouldBeUndefined(object, message) {
            return Preconditions.shouldBe(_Utility2.default.isUndefined, undefined, object, message || 'must be undefined');
        }

        /**
         *
         * @param {*} object
         * @param {String} [message]
         * @returns {*}
         */

    }, {
        key: "shouldNotBeFalsey",
        value: function shouldNotBeFalsey(object, message) {
            return Preconditions.shouldBe(_Utility2.default.isNotFalsey, true, object, message || 'must not be falsey');
        }

        /**
         *
         * @param {*} object
         * @param {String} [message]
         * @returns {*}
         */

    }, {
        key: "shouldBeFalsey",
        value: function shouldBeFalsey(object, message) {
            return Preconditions.shouldBe(_Utility2.default.isFalsey, false, object, message || 'must be falsey');
        }

        /**
         * This method checks for UNDEFINED, NAN, and NULL
         *
         * @param {*} object
         * @param {String} [message]
         * @return {*}
         */

    }, {
        key: "shouldBeDefined",
        value: function shouldBeDefined(object, message) {
            if (_Utility2.default.isUndefined(object)) {
                Preconditions.fail('defined', undefined, message || 'must be defined.');
            }

            return object;
        }

        /**
         * Make sure an object is not: undefined, null, NaN
         *
         * @param {*} object
         * @param {String} [message]
         */

    }, {
        key: "shouldBeExisting",
        value: function shouldBeExisting(object, message) {
            return Preconditions.shouldBe(_Utility2.default.isExisting, 'exist', object, message || 'must exist.');
        }

        /**
         *
         * @param {*} string
         * @param {String} [message]
         * @return {String}
         */

    }, {
        key: "shouldNotBeBlank",
        value: function shouldNotBeBlank(string, message) {
            Preconditions.shouldBeString(string, message || 'not blank');

            return Preconditions.shouldBe(_Utility2.default.isNotBlank, 'not blank', string, message || 'must not be blank.');
        }

        /**
         *
         * @param {*} fn
         * @param {String} [message]
         * @return {function}
         */

    }, {
        key: "shouldBeFunction",
        value: function shouldBeFunction(fn, message) {
            return Preconditions.shouldBeType('function', fn, message);
        }

        /**
         *
         * @param {*} number
         * @param {String} [message]
         * @return {Number}
         */

    }, {
        key: "shouldBeNumber",
        value: function shouldBeNumber(number, message) {
            Preconditions.shouldBeType('number', number, message);
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

    }, {
        key: "shouldBe",
        value: function shouldBe(testFn, expectedValue, actualValue, message) {
            if (!_Utility2.default.isFunction(testFn)) {
                Preconditions.fail('function', testFn, "testFn must be function, but was " + _Utility2.default.typeOf(testFn) + ".");
            }

            if (!testFn.call(this, actualValue)) {
                Preconditions.fail(expectedValue, actualValue, message || 'must pass test.');
            }

            return actualValue;
        }

        /**
         * Execute a function. The function should fail with a preconditions error.
         *
         * @param {function} fn
         * @param {*} [scope]
         */

    }, {
        key: "shouldFailWithPreconditionsError",
        value: function shouldFailWithPreconditionsError(fn, scope) {
            try {
                fn.call(scope || this);

                throw new Error('Did not crash');
            } catch (e) {
                Preconditions.shouldBePreconditionsError(e);
            }
        }

        /**
         *
         *
         * @param {Class|Object} actualClass
         * @param {Class|String} [requiredClassOrMessage]
         * @param {String} [message]
         */

    }, {
        key: "shouldBeClass",
        value: function shouldBeClass(actualClass, requiredClassOrMessage, message) {
            Preconditions.shouldBeDefined(actualClass, message || 'object must be defined');

            var requiredClass = void 0;

            if (_Utility2.default.isString(requiredClassOrMessage)) {
                Preconditions.shouldBeUndefined(message);
                message = requiredClassOrMessage;
                requiredClassOrMessage = null;
            } else {
                requiredClass = requiredClassOrMessage;
            }

            if (!requiredClass) {
                requiredClass = _CoreObject2.default;
            }

            if (!_CoreObject2.default.isClass(requiredClass)) {
                Preconditions.fail(_CoreObject2.default, requiredClass, message || 'Class not a CoreObject class');
            }

            if (!requiredClass.isClass(actualClass)) {
                Preconditions.fail(requiredClass, actualClass, message || "Class was of the wrong type.");
            }

            return actualClass;
        }

        /**
         *
         * @param value
         * @param message
         * @return {*}
         */

    }, {
        key: "shouldBeDateTime",
        value: function shouldBeDateTime(value, message) {
            Preconditions.shouldBeType('temporal', value, message);
            Preconditions.shouldBe(function () {
                return value instanceof _jsJoda.ZonedDateTime;
            }, _jsJoda.ZonedDateTime, value, message || 'Must be ZonedDateTime');

            return value;
        }

        /**
         *
         * @param {Temporal|ZonedDateTime|Instant} value
         * @param {String} [message]
         * @return {*}
         */

    }, {
        key: "shouldBeTemporal",
        value: function shouldBeTemporal(value, message) {
            Preconditions.shouldBeType('temporal', value, message || 'must be temporal');

            return value;
        }

        /**
         *
         * @param {*} object
         * @param {Class} [clazz]
         * @param {String} [message]
         * @returns {Object}
         */

    }, {
        key: "shouldBeInstance",
        value: function shouldBeInstance(object, clazz, message) {
            Preconditions.shouldBeDefined(object, message || 'object must be defined');

            if (!_Utility2.default.isInstance(object)) {
                Preconditions.fail(_CoreObject2.default, clazz, message || 'object not an instance');
            }

            if (clazz) {
                if (!_Utility2.default.isClass(clazz)) {
                    Preconditions.fail(_CoreObject2.default, clazz, message || 'clazz not a class');
                }

                if (!clazz.isInstance(object)) {
                    Preconditions.fail(object, clazz, message || 'Class not an instance of ' + clazz);
                }
            }

            return object;
        }

        /**
         * Less strict version of "shouldBeInstance"
         *
         * @param {*} object
         * @param {*} clazz
         * @param {String} [message]
         * @return {*}
         */

    }, {
        key: "shouldBeInstanceOf",
        value: function shouldBeInstanceOf(object, clazz, message) {
            Preconditions.shouldBeDefined(object, message);
            Preconditions.shouldBeDefined(clazz, message);

            if (object instanceof clazz) {
                return object;
            }

            Preconditions.fail(true, false, message);
        }

        /**
         *
         * @param {*} object
         * @param {Class<CoreObject>|String} [classOrString]
         * @param {String} [message]
         * @returns {Object}
         */

    }, {
        key: "shouldNotBeInstance",
        value: function shouldNotBeInstance(object, classOrString, message) {
            if (!object) {
                return object;
            }

            var clazz = void 0;

            if (_Utility2.default.isString(classOrString)) {
                Preconditions.shouldBeUndefined(message);
                message = classOrString;
            }

            if (!clazz) {
                clazz = _CoreObject2.default.toClass();
            }

            clazz = Preconditions.shouldBeClass(clazz);

            if (clazz.isInstance(object)) {
                Preconditions.fail(object, clazz, message || 'Class is an instance of ' + clazz);
            }

            return object;
        }

        /**
         *
         * @param {*} number
         * @param {String} [message]
         * @return {Number}
         */

    }, {
        key: "shouldBeFinite",
        value: function shouldBeFinite(number, message) {
            if (!_index2.default.isFinite(number)) {
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

    }, {
        key: "shouldBeObject",
        value: function shouldBeObject(object, message) {
            Preconditions.shouldBeExisting(object, message);

            var fn = _Utility2.default.typeMatcher('object');

            return Preconditions.shouldBe(fn, 'object', object, message || 'shouldBeObject');
        }

        /**
         *
         * @param {*} string
         * @param {String} [message]
         * @return {String}
         */

    }, {
        key: "shouldBeString",
        value: function shouldBeString(string, message) {
            Preconditions.shouldBeExisting(string);

            var fn = _Utility2.default.typeMatcher('string');

            return Preconditions.shouldBe(fn, 'object', string, message);
        }

        /**
         *
         * @param {String} string
         * @param {RegExp} regexp
         * @param {String} [message]
         */

    }, {
        key: "shouldMatchRegexp",
        value: function shouldMatchRegexp(string, regexp, message) {
            Preconditions.shouldBeString(string, message);
            Preconditions.shouldBeRegExp(regexp, message);

            if (!string.match(regexp)) {
                Preconditions.fail(true, false, message);
            }

            return string;
        }

        /**
         *
         * @param {RegExp} regexp
         * @param {String} [message]
         * @return {RegExp}
         */

    }, {
        key: "shouldBeRegExp",
        value: function shouldBeRegExp(regexp, message) {
            return Preconditions.shouldBeType('regexp', regexp, message);
        }

        /**
         *
         * @param {*} object
         * @param {AbstractError} [clazz]
         * @param {String} [message]
         * @returns Error
         */

    }, {
        key: "shouldBeError",
        value: function shouldBeError(object, clazz, message) {
            Preconditions.shouldBeType('error', object, message || 'Should be error type');

            if (clazz) {
                if (!_errors.Errors.isErrorClass(clazz)) {
                    Preconditions.fail(Error, clazz, message || 'must be error class');
                }

                if (!clazz.isInstance(object)) {
                    Preconditions.fail(clazz, object, message || 'must be error instance.');
                }
            }

            return object;
        }

        /**
         *
         * @param {String} typeName
         * @param {*} value
         * @param {String} [message]
         * @returns {*}
         */

    }, {
        key: "shouldBeType",
        value: function shouldBeType(typeName, value, message) {
            return Preconditions.shouldBe(_Utility2.default.typeMatcher(typeName), typeName, value, message);
        }

        /**
         *
         * @param {*} boolean
         * @param {String} [message]
         * @return {boolean}
         */

    }, {
        key: "shouldBeTrue",
        value: function shouldBeTrue(boolean, message) {
            Preconditions.shouldBeBoolean(boolean, message || 'should be true');

            if (true === boolean) {
                return boolean;
            }

            Preconditions.fail(boolean, true, message || 'was not true');
        }

        /**
         * @param {*} target (pass this in exactly "new.target")
         * @param {Class} clazz
         * @return {*}
         */

    }, {
        key: "shouldBeAbstract",
        value: function shouldBeAbstract(target, clazz) {
            if (target.constructor === clazz) {
                _errors.Errors.throwMustBeAbstract(clazz);
            }

            return target;
        }

        /**
         *
         * @param {*} number
         * @param {String} [message]
         * @returns {Number}
         */

    }, {
        key: "shouldNotBeNegativeNumber",
        value: function shouldNotBeNegativeNumber(number, message) {
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

    }, {
        key: "shouldBeBoolean",
        value: function shouldBeBoolean(boolean, message) {
            Preconditions.shouldBeDefined(boolean, message || 'should be boolean');

            if (!_Utility2.default.isBoolean(boolean)) {
                Preconditions.fail('boolean', boolean, message || 'was not boolean');
            }

            return boolean;
        }

        /**
         *
         * @param {Array} array
         * @param {String} [message]
         */

    }, {
        key: "shouldBeArray",
        value: function shouldBeArray(array, message) {
            Preconditions.shouldBeDefined(array);

            if (!_Utility2.default.isArray(array)) {
                Preconditions.fail('array', array, message || 'was not array');
            }

            return array;
        }

        /**
         *
         * @param {*} number1
         * @param {*} number2
         * @param {String} [message]
         */

    }, {
        key: "shouldBeGreaterThan",
        value: function shouldBeGreaterThan(number1, number2, message) {
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

    }, {
        key: "shouldBePositiveNumber",
        value: function shouldBePositiveNumber(number, message) {
            Preconditions.shouldBeNumber(number, message);

            if (number <= 0) {
                Preconditions.fail('positive', number, message || 'Number should be positive. Was: ' + number);
            }

            return number;
        }

        /**
         * @param {*|PreconditionsError} e
         * @param {String} [message]
         *
         * @return {PreconditionsError}
         */

    }, {
        key: "shouldBePreconditionsError",
        value: function shouldBePreconditionsError(e, message) {
            if (!_errors.PreconditionsError.isInstance(e)) {
                Preconditions.fail(_errors.PreconditionsError, e, message || 'Should be a preconditions error. Was: ' + e);
            }

            return e;
        }
    }]);

    return Preconditions;
}();

exports.default = Preconditions;
//# sourceMappingURL=Preconditions.js.map