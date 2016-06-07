'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractError = require('./AbstractError');

var _AbstractError2 = _interopRequireDefault(_AbstractError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Errors = function () {
    function Errors() {
        _classCallCheck(this, Errors);
    }

    _createClass(Errors, null, [{
        key: 'isErrorClass',


        /**
         * Determines if the given err object is an error class
         *
         * @param {*} clazz
         * @returns {boolean}
         */
        value: function isErrorClass(clazz) {
            if (_AbstractError2.default.isClass(clazz)) {
                return true;
            }

            if ('function' !== typeof clazz) {
                return false;
            }

            while (clazz) {
                if (clazz === Error) {
                    return true;
                }

                clazz = Object.getPrototypeOf(clazz);
            }

            return false;
        }

        /**
         * Determines if the given error is
         *
         * @param object
         * @returns {boolean}
         */

    }, {
        key: 'isErrorInstance',
        value: function isErrorInstance(object) {
            return object instanceof Error || _AbstractError2.default.isInstance(object);
        }
    }]);

    return Errors;
}();

exports.default = Errors;
module.exports = exports['default'];
//# sourceMappingURL=Errors.js.map