'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrencyAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

var _Money = require('./Money');

var _Money2 = _interopRequireDefault(_Money);

var _Currency = require('./Currency');

var _Currency2 = _interopRequireDefault(_Currency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrencyAdapter = function (_Adapter) {
    _inherits(CurrencyAdapter, _Adapter);

    function CurrencyAdapter() {
        _classCallCheck(this, CurrencyAdapter);

        return _possibleConstructorReturn(this, (CurrencyAdapter.__proto__ || Object.getPrototypeOf(CurrencyAdapter)).apply(this, arguments));
    }

    _createClass(CurrencyAdapter, [{
        key: 'supports',


        /**
         * @param {Money|Class<Money>|Currency|Class<Currency>} instanceOrClass
         * @return {Boolean}
         */
        value: function supports(instanceOrClass) {
            var money = _Money2.default.isInstance(instanceOrClass);
            var currency = _Currency2.default.isInstanceOrClass(instanceOrClass);

            return money || currency;
        }

        /**
         *
         * @param {Money|Currency} instance
         * @return {Currency}
         */

    }, {
        key: 'adapt',
        value: function adapt(instance) {
            return _Currency2.default.optCurrency(instance);
        }
    }]);

    return CurrencyAdapter;
}(_data2.default);

exports.CurrencyAdapter = CurrencyAdapter;
exports.default = CurrencyAdapter;
//# sourceMappingURL=CurrencyAdapter.js.map