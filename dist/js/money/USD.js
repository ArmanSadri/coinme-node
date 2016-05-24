'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('./..');

var _Currency2 = require('./Currency');

var _Currency3 = _interopRequireDefault(_Currency2);

var _Satoshi = require('./Satoshi');

var _Satoshi2 = _interopRequireDefault(_Satoshi);

var _Money = require('./Money');

var _Money2 = _interopRequireDefault(_Money);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Converter = require('./Converter');

var _Converter2 = _interopRequireDefault(_Converter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Bitcoin
 */

var USD = function (_Currency) {
    _inherits(USD, _Currency);

    function USD() {
        _classCallCheck(this, USD);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(USD).apply(this, arguments));
    }

    _createClass(USD, null, [{
        key: 'toString',
        value: function toString() {
            return 'USD';
        }

        //region Detection
        /**
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         */

    }, {
        key: 'isUSD',
        value: function isUSD(moneyOrCurrency) {
            return USD.isClass(_Currency3.default.getCurrency(moneyOrCurrency));
        }

        /**
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         */

    }, {
        key: 'shouldBeUSD',
        value: function shouldBeUSD(moneyOrCurrency) {
            var currency = _Currency3.default.getCurrency(moneyOrCurrency);
            var desiredCurrency = USD;

            if (!desiredCurrency.isClass(currency)) {
                console.log('currency=>', currency);
                _.Preconditions.fail(desiredCurrency, currency);
            }

            return moneyOrCurrency;
        }
        //endregion

    }]);

    return USD;
}(_Currency3.default);

exports.default = USD;
module.exports = exports['default'];
//# sourceMappingURL=USD.js.map