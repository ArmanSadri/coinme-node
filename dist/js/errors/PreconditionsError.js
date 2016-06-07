'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _AbstractError2 = require('./AbstractError');

var _AbstractError3 = _interopRequireDefault(_AbstractError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreconditionsError = function (_AbstractError) {
    _inherits(PreconditionsError, _AbstractError);

    /**
     *
     * @param {*} options.expectedValue
     * @param {*} options.actualValue
     * @param {String} [options.message]
     * @param {Error} [options.cause]
     * @param {Error} [options.optionalCause]
     * @constructor
     */

    function PreconditionsError(options) {
        _classCallCheck(this, PreconditionsError);

        options = options || {};

        var cause = options.optionalCause || options.cause;
        var expectedValue = options.expectedValue;
        var actualValue = options.actualValue;
        var message = options.message;

        var inner_message = 'failure (expected: \'' + expectedValue + '\' [' + _Utility2.default.typeOf(expectedValue) + ']) (actual: \'' + actualValue + '\' [' + _Utility2.default.typeOf(actualValue) + ']) (message: ' + message + ')';

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PreconditionsError).call(this, inner_message));

        _this._cause = cause;
        _this._expectedValue = expectedValue;
        _this._actualValue = actualValue;
        return _this;
    }

    _createClass(PreconditionsError, [{
        key: 'actualValue',
        get: function get() {
            return this._actualValue;
        }
    }, {
        key: 'expectedValue',
        get: function get() {
            return this._expectedValue;
        }
    }, {
        key: 'cause',
        get: function get() {
            return this._cause;
        }
    }], [{
        key: 'toString',
        value: function toString() {
            return 'PreconditionsError';
        }
    }]);

    return PreconditionsError;
}(_AbstractError3.default);

// /**
//  *
//
//  */
// function PreconditionsError(expectedValue, actualValue, message, optionalCause) {
//
// }
//
// PreconditionsError.prototype = Object.create(Error.prototype);
// PreconditionsError.prototype.constructor = PreconditionsError;

exports.default = PreconditionsError;
module.exports = exports['default'];
//# sourceMappingURL=PreconditionsError.js.map