'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Currency2 = require("./Currency");

var _Currency3 = _interopRequireDefault(_Currency2);

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the Ethereum currency in memory.
 *
 * This class cannot be instantiated. Everything is static and the constructor throws, so treat it like a singleton.
 *
 * @beta
 * @class Ethereum
 */

var Ethereum = function (_Currency) {
    _inherits(Ethereum, _Currency);

    function Ethereum() {
        _classCallCheck(this, Ethereum);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Ethereum).apply(this, arguments));
    }

    _createClass(Ethereum, null, [{
        key: "fromEthereum",


        /**
         *
         * @param {Money|String|Number|null|undefined} valueInEthereum
         * @returns {Money}
         */
        value: function fromEthereum(valueInEthereum) {
            /**
             * @type {Number}
             */
            var value = _Currency3.default.toValueOrFail(valueInEthereum);
            /**
             * @type {Class.<Currency>|undefined}
             */
            var currency = _Currency3.default.optCurrency(valueInEthereum);

            if (currency) {
                Ethereum.shouldBeEthereum(currency);
            }

            return new _Money2.default({
                value: value,
                currency: Ethereum
            });
        }

        //region Detection
        /**
         * Detects if you pass in either Money or Currency of type Ethereum <br>
         * <br>
         * Ethereum -> true <br>
         * money<Ethereum> -> true <br>
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @return {Boolean}
         */

    }, {
        key: "isEthereum",
        value: function isEthereum(moneyOrCurrency) {
            if (!moneyOrCurrency) {
                return false;
            }

            var currency = _Currency3.default.optCurrency(moneyOrCurrency);

            return Ethereum.isClass(currency) || Ethereum.isInstance(currency);
        }

        /**
         * If {@link Ethereum#isEthereum} returns false, will throw.
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @return {Class<Currency>}
         * @throws {PreconditionsError} if not an instance of Money (for Ethereum) or the Ethereum class itself.
         */

    }, {
        key: "shouldBeEthereum",
        value: function shouldBeEthereum(moneyOrCurrency) {
            if (!Ethereum.isEthereum(moneyOrCurrency)) {
                _Preconditions2.default.fail(Ethereum, _Currency3.default.optCurrency(moneyOrCurrency) || moneyOrCurrency);
            }

            return moneyOrCurrency;
        }

        //endregion

    }, {
        key: "toString",
        value: function toString() {
            return 'Ethereum';
        }
    }]);

    return Ethereum;
}(_Currency3.default);

// Currency.types.register('Ethereum', Ethereum);
// Currency.types.register('ETH', Ethereum);

exports.default = Ethereum;
//# sourceMappingURL=Ethereum.js.map