'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotImplementedError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _AbstractError2 = require('./AbstractError');

var _AbstractError3 = _interopRequireDefault(_AbstractError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotImplementedError = function (_AbstractError) {
    _inherits(NotImplementedError, _AbstractError);

    /**
     *
     * @param {String|Object} [options]
     * @param {String} [options.message]
     * @param {Error} [options.cause]
     * @constructor
     */
    function NotImplementedError(options) {
        _classCallCheck(this, NotImplementedError);

        if (_Utility2.default.isString(options)) {
            options = { message: options };
        }

        options = options || {};
        options.message = options.message || 'This method is not implemented';

        return _possibleConstructorReturn(this, (NotImplementedError.__proto__ || Object.getPrototypeOf(NotImplementedError)).call(this, options));
    }

    /**
     * @return {String}
     */


    _createClass(NotImplementedError, null, [{
        key: 'toString',
        value: function toString() {
            return 'PreconditionsError';
        }
    }]);

    return NotImplementedError;
}(_AbstractError3.default);

exports.NotImplementedError = NotImplementedError;
exports.default = NotImplementedError;
//# sourceMappingURL=NotImplementedError.js.map