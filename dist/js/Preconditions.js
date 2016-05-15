'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PreconditionsError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _index = require("lodash/index");

var _index2 = _interopRequireDefault(_index);

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
    this.message = "failure (expected: '" + this.expectedValue + "' [" + _Utility2.default.typeOf(this.expectedValue) + "]) (actual: '" + this.actualValue + "' [" + _Utility2.default.typeOf(this.actualValue) + "]) (message: " + this.message + ")";
}

PreconditionsError.prototype = Object.create(Error.prototype);
PreconditionsError.prototype.constructor = PreconditionsError;

exports.PreconditionsError = PreconditionsError;

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
            throw new PreconditionsError(expectedValue, actualValue, message || 'Preconditions failure');
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
            return Preconditions.shouldBe(_Utility2.default.isUndefined, object, 'undefined', message || 'must be undefined');
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
            return Preconditions.shouldBe(_Utility2.default.isNotFalsey, object, message, 'must not be falsey');
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
            return Preconditions.shouldBe(_Utility2.default.isFalsey, object, message, 'must be falsey');
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
            Preconditions.shouldBeString(string);

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

            // throw new Error(Utility.typeOf(fn));

            return Preconditions.shouldBe(fn, 'object', object, message);
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

            return Preconditions.shouldBe(fn, 'object', object, message);
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
            Preconditions.shouldBeDefined(boolean);

            if (!_Utility2.default.isBoolean(boolean)) {
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
    }]);

    return Preconditions;
}();

exports.default = Preconditions;
//# sourceMappingURL=Preconditions.js.map