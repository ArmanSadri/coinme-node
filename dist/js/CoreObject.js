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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */

var CoreObject = function (_Ember$Object) {
    _inherits(CoreObject, _Ember$Object);

    _createClass(CoreObject, [{
        key: "get",
        value: function get(key) {
            return _Ember2.default.get(this, key);
        }
    }, {
        key: "set",
        value: function set(key, value) {
            return _Ember2.default.set(this, key, value);
        }
    }]);

    function CoreObject(options) {
        _classCallCheck(this, CoreObject);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CoreObject).apply(this, arguments));

        _lodash2.default.merge(_this, options);
        return _this;
    }

    _createClass(CoreObject, [{
        key: "toString",
        value: function toString() {
            return this.toClass().toString();
        }
    }, {
        key: "toClass",
        value: function toClass() {
            return this.constructor;
        }
    }], [{
        key: "toClass",
        value: function toClass() {
            return this;
        }
    }, {
        key: "toString",
        value: function toString() {
            return 'CoreObject';
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

        /**
         * Ensures that your object is an instance of this type.
         *
         * @param {*} object
         * @returns {Object}
         * @throws {PreconditionsError} if the type is incorrect
         */

    }, {
        key: "shouldBeInstance",
        value: function shouldBeInstance(object) {
            if (!this.isInstance(object)) {
                _Preconditions2.default.fail(this, object, 'Should be instance');
            }

            return object;
        }

        /**
         *
         * @param {object} obj
         * @returns {boolean}
         */

    }, {
        key: "isInstance",
        value: function isInstance(obj) {
            return obj instanceof this;
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
module.exports = exports['default'];
//# sourceMappingURL=CoreObject.js.map