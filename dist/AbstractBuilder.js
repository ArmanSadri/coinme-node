'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preconditions = require('preconditions');

var _preconditions2 = _interopRequireDefault(_preconditions);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = _preconditions2.default.singleton();

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

var AbstractBuilder = function () {
    function AbstractBuilder(options) {
        _classCallCheck(this, AbstractBuilder);

        _lodash2.default.assign(this, options);

        if (!this.payload) {
            this.payload = {};
        }

        if (!this.Logger) {
            this.Logger = _winston2.default;
        }

        this.$ = $;
    }

    /**
     *
     * @param path
     * @returns {*}
     * @protected
     */


    _createClass(AbstractBuilder, [{
        key: 'get',
        value: function get(path) {
            if (_lodash2.default.isUndefined(path)) {
                return this.payload;
            } else {
                return _Utility2.default.Object.get(this.payload, path);
            }
        }

        /**
         *
         * @param {String} path
         * @param {*} value
         * @return
         * @protected
         */

    }, {
        key: 'set',
        value: function set(path, value) {
            _Utility2.default.Object.set(this.payload, path, value);

            return this;
        }

        /**
         *
         * @param {String} path
         * @param {String} string
         * @protected
         */

    }, {
        key: 'setString',
        value: function setString(path, string) {
            this.$.shouldBeString(path, 'path');
            this.$.shouldBeString(string, 'string');

            return this.set(path, string);
        }

        /**
         * @public
         * @param object
         * @return {AbstractBuilder}
         */

    }, {
        key: 'mergeIntoPayload',
        value: function mergeIntoPayload(object) {
            this.$.shouldBeDefined(object, 'Cannot merge null');
            this.$.shouldBeObject(object, 'should be object');

            _lodash2.default.assign(this.payload, object);

            return this;
        }

        /**
         *
         * @param {String} path
         * @param {*} defaultValue
         * @returns {*}
         * @public
         */

    }, {
        key: 'getWithDefaultValue',
        value: function getWithDefaultValue(path, defaultValue) {
            return _Utility2.default.Object.getWithDefaultValue(this.payload, path, defaultValue);
        }
    }]);

    return AbstractBuilder;
}();

exports.default = AbstractBuilder;