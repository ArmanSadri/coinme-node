'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preconditions = require('preconditions');

var _preconditions2 = _interopRequireDefault(_preconditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utility = {

    $: _preconditions2.default.singleton()

};

_lodash2.default.merge(Utility, {

    Object: {
        /**
         * Set a value
         *
         * @param {Object} object
         * @param {String} path
         * @param {*} value
         */
        set: function set(object, path, value) {
            Utility.$.shouldBeDefined(object);
            Utility.$.shouldBeString(path);

            _lodash2.default.set(object, path, value);

            var sanity = this.get(object, path);

            if (value !== sanity) {
                throw new Error('Does not match');
            }
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @param {String} string
         */
        setString: function setString(object, path, string) {
            Utility.$.shouldBeDefined(object);
            Utility.$.shouldBeString(path);
            Utility.$.shouldBeString(string);

            return _lodash2.default.set(object, path, string);
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @returns {*}
         */
        get: function get(object, path) {
            return _lodash2.default.get(object, path);
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @param {Object} defaultValue
         * @return {*}
         */
        getWithDefaultValue: function getWithDefaultValue(object, path, defaultValue) {
            var result = this.get(object, path);

            if (!result) {
                this.set(object, path, defaultValue);

                result = defaultValue;
            }

            return result;
        }
    }
});

exports.default = Utility;
module.exports = exports['default'];