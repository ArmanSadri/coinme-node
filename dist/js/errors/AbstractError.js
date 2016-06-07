'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ExtendableBuiltin(cls) {

    function ExtendableBuiltin() {
        cls.apply(this, arguments);
    }

    ExtendableBuiltin.prototype = Object.create(cls.prototype);

    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}

/**
 *
 * @class
 */

var AbstractError = function (_ExtendableBuiltin) {
    _inherits(AbstractError, _ExtendableBuiltin);

    function AbstractError(message) {
        _classCallCheck(this, AbstractError);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractError).call(this, message));

        _this.name = _this.constructor.name;
        _this.message = message;

        var error = Error.call(_this, message);
        // if (typeof Error.captureStackTrace === 'function') {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = (new Error(message)).stack;
        // }
        _this.stack = error.stack;
        return _this;
    }

    /**
     * Determines if a class definition is a subclass of CoreObject
     *
     * @param {*} clazz
     * @returns {boolean}
     */


    _createClass(AbstractError, null, [{
        key: 'isClass',
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
         *
         * @param {*} obj
         * @returns {boolean}
         */

    }, {
        key: 'isInstance',
        value: function isInstance(obj) {
            return obj instanceof this;
        }
    }]);

    return AbstractError;
}(ExtendableBuiltin(Error));

exports.default = AbstractError;
module.exports = exports['default'];
//# sourceMappingURL=AbstractError.js.map