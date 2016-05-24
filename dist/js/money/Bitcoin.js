'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Currency2 = require("./Currency");

var _Currency3 = _interopRequireDefault(_Currency2);

var _Satoshi = require("./Satoshi");

var _Satoshi2 = _interopRequireDefault(_Satoshi);

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @private
 * @type {Converter}
 */
var conversions = {
    /**
     *
     * @param {Number} valueInBitcoin
     * @returns {Number}
     */
    'Bitcoin->Satoshi': function BitcoinSatoshi(valueInBitcoin) {
        _Preconditions2.default.shouldBeNumber(valueInBitcoin);

        return valueInBitcoin * Bitcoin.SATOSHIS_PER_BITCOIN;
    },

    /**
     *
     * @param {Number} valueInSatoshi
     * @returns {Number}
     */
    'Satoshi->Bitcoin': function SatoshiBitcoin(valueInSatoshi) {
        _Preconditions2.default.shouldBeNumber(valueInSatoshi);

        return valueInSatoshi * Bitcoin.BITCOIN_PER_SATOSHI;
    }
};

// Register our known conversions.
_Currency3.default.converter.register(conversions);

/**
 * Represents the Bitcoin currency in memory.
 *
 * This class cannot be instantiated. Everything is static and the constructor throws, so treat it like a singleton.
 *
 * @class Bitcoin
 */

var Bitcoin = function (_Currency) {
    _inherits(Bitcoin, _Currency);

    function Bitcoin() {
        _classCallCheck(this, Bitcoin);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Bitcoin).apply(this, arguments));
    }

    _createClass(Bitcoin, null, [{
        key: "fromBitcoin",


        // /**
        //  *
        //  * @param {Money} money
        //  * @param {Number} [places]
        //  * @returns {String}
        //  */
        // static serialize(money, places) {
        //     let value = this.toBitcoin();
        //
        //     if (isNaN(value)) {
        //         return 'NaN';
        //     }
        //
        //     if (!places) {
        //         places = 8;
        //     }
        //
        //     let parts = String(value).split('.');
        //
        //     if (parts.length === 1) {
        //         parts.push('0');
        //     }
        //
        //     let needed = places - parts[1].length;
        //
        //     for (let i = 0; i < needed; i++) {
        //         parts[1] += '0';
        //     }
        //
        //     return parts[0] + '.' + parts[1];
        // }

        /**
         *
         * @param {Money|String|Number|null|undefined} valueInBitcoin
         * @returns {Money}
         */
        value: function fromBitcoin(valueInBitcoin) {
            /**
             * @type {Number}
             */
            var value = _Currency3.default.toValueOrFail(valueInBitcoin);
            /**
             * @type {Class.<Currency>|undefined}
             */
            var currency = _Currency3.default.optCurrency(valueInBitcoin);

            if (currency) {
                Bitcoin.shouldBeBitcoin(currency);
            }

            return new _Money2.default({
                value: value,
                currency: Bitcoin
            });
        }

        /**
         *
         * @param {Money|String|Number|null|undefined} valueInSatoshis
         * @returns {Money}
         */

    }, {
        key: "fromSatoshi",
        value: function fromSatoshi(valueInSatoshis) {
            return _Satoshi2.default.fromSatoshis(valueInSatoshis);
        }

        // /**
        //  *
        //  * @param number
        //  * @returns {Number}
        //  */
        // static calculateSatoshisFromBitcoin(number) {
        //     Preconditions.shouldBeDefined(Currency);
        //     number = Currency.toValueOrFail(number);
        //
        //     if (isNaN(number)) {
        //         return NaN;
        //     }
        //
        //     if (number === 0) {
        //         return 0;
        //     }
        //
        //     let str = String(number);
        //     let sign = (str.indexOf('-') === 0) ? '-' : '';
        //
        //     str = str.replace(/^-/, '');
        //
        //     if (str.indexOf('e') >= 0) {
        //         return parseInt(sign + str.replace('.', '').replace(/e-8/, '').replace(/e-7/, '0'), 10);
        //     } else {
        //         if (!(/\./).test(str)) {
        //             str += '.0';
        //         }
        //
        //         let parts = str.split('.');
        //
        //         str = parts[0] + '.' + parts[1].slice(0, 8);
        //
        //         while (!(/\.[0-9]{8}/).test(str)) {
        //             str += '0';
        //         }
        //
        //         return parseInt(sign + str.replace('.', '').replace(/^0+/, ''), 10);
        //     }
        // }

        /**
         * @return {Number}
         * @readonly
         */

    }, {
        key: "toClass",


        /**
         * @returns {Class<Bitcoin>}
         */
        value: function toClass() {
            return Bitcoin;
        }

        /**
         * @returns {String}
         */

    }, {
        key: "toString",
        value: function toString() {
            return 'Bitcoin';
        }

        //region Detection
        /**
         * Detects if you pass in either Money or Currency of type Bitcoin <br>
         * <br>
         * Bitcoin -> true <br>
         * money<Bitcoin> -> true <br>
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @return {Boolean}
         */

    }, {
        key: "isBitcoin",
        value: function isBitcoin(moneyOrCurrency) {
            if (!moneyOrCurrency) {
                return false;
            }

            var currency = _Currency3.default.optCurrency(moneyOrCurrency);

            return Bitcoin.isClass(currency) || Bitcoin.isInstance(currency);
        }

        /**
         * If {@link Bitcoin#isBitcoin} returns false, will throw.
         *
         * @param {Money|Currency|Class<Currency>} moneyOrCurrency
         * @return {Class<Currency>}
         * @throws {PreconditionsError} if not an instance of Money (for Bitcoin) or the Bitcoin class itself.
         */

    }, {
        key: "shouldBeBitcoin",
        value: function shouldBeBitcoin(moneyOrCurrency) {
            if (!Bitcoin.isBitcoin(moneyOrCurrency)) {
                _Preconditions2.default.fail(Bitcoin, _Currency3.default.optCurrency(moneyOrCurrency) || moneyOrCurrency);
            }

            return moneyOrCurrency;
        }

        //endregion

    }, {
        key: "SATOSHIS_PER_BITCOIN",
        get: function get() {
            return 100000000;
        }

        /**
         * @return {Number}
         * @readonly
         */

    }, {
        key: "BITCOIN_PER_SATOSHI",
        get: function get() {
            return 0.00000001;
        }
    }]);

    return Bitcoin;
}(_Currency3.default);

exports.default = Bitcoin;
module.exports = exports['default'];
//# sourceMappingURL=Bitcoin.js.map