'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ember = require("./Ember");

var _Ember2 = _interopRequireDefault(_Ember);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logger = _winston2.default.Logger;

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */

var CoreObject = function (_Ember$Object) {
    _inherits(CoreObject, _Ember$Object);

    function CoreObject(options) {
        _classCallCheck(this, CoreObject);

        var logger = void 0;

        if (_Utility2.default.isNotExisting(options) || _Utility2.default.isObject(options)) {
            var _this = _possibleConstructorReturn(this, (CoreObject.__proto__ || Object.getPrototypeOf(CoreObject)).apply(this, arguments));

            logger = _Utility2.default.take(options, 'logger');

            _lodash2.default.merge(_this, options);
        } else {
            var _this = _possibleConstructorReturn(this, (CoreObject.__proto__ || Object.getPrototypeOf(CoreObject)).call(this, {}));
        }

        _this._logger = logger || new Logger();
        return _possibleConstructorReturn(_this);
    }

    /**
     * @return {winston.Logger|Logger}
     */


    _createClass(CoreObject, [{
        key: "get",


        /**
         *
         * @param {string} key
         * @returns {*|Object}
         */
        value: function get(key) {
            return _Ember2.default.get(this, key);
        }

        /**
         *
         * @param {string} key
         * @param {*} value
         * @returns {CoreObject|*}
         */

    }, {
        key: "set",
        value: function set(key, value) {
            _Ember2.default.set(this, key, value);

            return this;
        }

        /**
         * @returns {string}
         */

    }, {
        key: "toString",
        value: function toString() {
            return this.toClass().toString();
        }

        /**
         *
         * @returns {Class<CoreObject>}
         */

    }, {
        key: "toClass",
        value: function toClass() {
            return this.constructor;
        }
    }, {
        key: "toJson",
        value: function toJson(options) {
            return _lodash2.default.assign({
                _class: this.constructor.name
            }, options || {});
        }

        /**
         *
         * @returns {Class<CoreObject>}
         */

    }, {
        key: "logger",
        get: function get() {
            return this._logger;
        }
    }], [{
        key: "toClass",
        value: function toClass() {
            return this;
        }

        /**
         * @returns {String}
         */

    }, {
        key: "toString",
        value: function toString() {
            return this.constructor.name;
        }

        /**
         * Determines if a class definition is a subclass of CoreObject
         *
         * @param {*} clazz
         * @returns {boolean}
         */

    }, {
        key: "isClass",
        value: function isClass(clazz) {
            if ('function' !== typeof clazz) {
                return false;
            }

            while (clazz) {
                if (clazz === this) {
                    return true;
                }

                clazz = Object.getPrototypeOf(clazz);
            }

            return false;
        }
    }, {
        key: "equals",
        value: function equals(foreignClass) {
            return this.isClass(foreignClass);
        }

        /**
         *
         * @param {CoreObject|Class|*} instanceOrClass
         * @param {String} [message]
         * @returns {*}
         */

    }, {
        key: "shouldBeClassOrInstance",
        value: function shouldBeClassOrInstance(instanceOrClass, message) {
            if (!this.isInstance(instanceOrClass) && !this.isClass(instanceOrClass)) {
                _Preconditions2.default.fail(this.toClass(), CoreObject.optClass(instanceOrClass), message || 'Was not the correct class or instance');
            }

            return instanceOrClass;
        }

        /**
         *
         * @param {*|CoreObject} obj
         * @returns {boolean}
         */

    }, {
        key: "isInstance",
        value: function isInstance(obj) {
            return obj instanceof this;
        }

        /**
         *
         * @param {*|CoreObject} obj
         * @param {String} [message]
         * @returns {*|CoreObject}
         */

    }, {
        key: "shouldBeInstance",
        value: function shouldBeInstance(obj, message) {
            if (!this.isInstance(obj)) {
                _Preconditions2.default.fail(this.toClass(), _Utility2.default.optClass(obj), message || 'Was not the correct class');
            }

            return obj;
        }

        /**
         *
         * @param obj
         * @return {boolean}
         */

    }, {
        key: "isInstanceOrClass",
        value: function isInstanceOrClass(obj) {
            return this.isInstance(obj) || this.isClass(obj);
        }
    }]);

    return CoreObject;
}(_Ember2.default.Object);

exports.default = CoreObject;
//# sourceMappingURL=CoreObject.js.map