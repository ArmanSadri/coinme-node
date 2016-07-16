'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require("./..");

var _Currency2 = require("./Currency");

var _Currency3 = _interopRequireDefault(_Currency2);

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class USD
 */

var USD = function (_Currency) {
    _inherits(USD, _Currency);

    function USD() {
        _classCallCheck(this, USD);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(USD).apply(this, arguments));
    }

    _createClass(USD, null, [{
        key: "toString",


        /**
         *
         * @returns {String}
         */
        value: function toString() {
            return 'USD';
        }

        /**
         * @returns {Class<USD>}
         */

    }, {
        key: "toClass",
        value: function toClass() {
            return USD;
        }

        //region Detection
        /**
         * Detects if
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @return {Boolean}
         */

    }, {
        key: "isUSD",
        value: function isUSD(moneyOrCurrency) {
            var currency = _Currency3.default.optCurrency(moneyOrCurrency) || moneyOrCurrency;

            return USD.isClass(currency) || USD.isInstance(currency);
        }

        /**
         * Determines if {@link USD#isUSD} returns true
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @throws {PreconditionsError} if not the right currency type
         */

    }, {
        key: "shouldBeUSD",
        value: function shouldBeUSD(moneyOrCurrency) {
            if (!this.isUSD(moneyOrCurrency)) {
                _.Preconditions.fail(USD, moneyOrCurrency, 'Must be USD');
            }

            return moneyOrCurrency;
        }

        //endregion

    }]);

    return USD;
}(_Currency3.default);

// Currency.types.register('USD', USD);

exports.default = USD;
module.exports = exports['default'];
//# sourceMappingURL=USD.js.map