'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Preconditions = require('/Users/msmyers/projects/coinme/coinme-node/src/js/Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _ember = require('/Users/msmyers/projects/coinme/coinme-node/src/js/ember');

var _ember2 = _interopRequireDefault(_ember);

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
        key: 'typeOf',


        /**
         *
         * @returns {String}
         */
        value: function typeOf(object) {
            return _ember2.default.typeOf(object);
        }

        /**
         *
         * @param {*} object
         * @return boolean
         */

    }, {
        key: 'isUndefined',
        value: function isUndefined(object) {
            return 'undefined' === Utility.typeOf(object);
        }
    }, {
        key: 'isString',
        value: function isString(object) {
            return 'string' === Utility.typeOf(object);
        }

        /**
         * @param {*} object
         * @return {boolean}
         */

    }, {
        key: 'isExisting',
        value: function isExisting(object) {
            var u = Utility.isUndefined(object);
            var n = Utility.isNaN(object);
            var nu = Utility.isNull(object);

            return !(u || n || nu);
        }
    }, {
        key: 'isNaN',
        value: function isNaN(object) {
            return _lodash2.default.isNaN(object);
        }
    }, {
        key: 'isNull',
        value: function isNull(object) {
            return null === object;
        }
    }, {
        key: 'isNotExisting',
        value: function isNotExisting(object) {
            return !this.isExisting(object);
        }

        /**
         *
         * @param {*} object
         * @returns {boolean}
         */

    }, {
        key: 'isFalsey',
        value: function isFalsey(object) {
            return !object;
        }
    }, {
        key: 'isFunction',
        value: function isFunction(fn) {
            return this.typeOf(fn) === 'function';
        }

        /**
         *
         * @param {String} string
         * @return {boolean}
         */

    }, {
        key: 'isNotBlank',
        value: function isNotBlank(string) {
            return !this.isBlank(string);
        }

        /**
         *
         * @param {String} string
         * @return {boolean}
         */

    }, {
        key: 'isBlank',
        value: function isBlank(string) {
            _Preconditions2.default.shouldBeString(string);

            return _ember2.default.isBlank(string);
        }

        /**
         *
         * @param {String} type
         * @return {function}
         */

    }, {
        key: 'typeMatcher',
        value: function typeMatcher(type) {

            /**
             * @param {*} object
             */
            return function (object) {
                return Utility.typeOf(object) === type;
            };
        }

        /**
         *
         * @param {Object} object
         * @param {Object} defaults
         * @returns {Object} The original object.
         */

    }, {
        key: 'defaults',
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
;
module.exports = exports['default'];
//# sourceMappingURL=Utility.js.map