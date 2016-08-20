'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Currency2 = require("./Currency");

var _Currency3 = _interopRequireDefault(_Currency2);

var _Money = require("./Money");

var _Money2 = _interopRequireDefault(_Money);

var _Bitcoin = require("./Bitcoin");

var _Bitcoin2 = _interopRequireDefault(_Bitcoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Satoshi
 */

var Satoshi = function (_Currency) {
    _inherits(Satoshi, _Currency);

    function Satoshi() {
        _classCallCheck(this, Satoshi);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Satoshi).apply(this, arguments));
    }

    _createClass(Satoshi, null, [{
        key: "create",


        /**
         * @param {Number|String|Big|BigJsLibrary.BigJS} valueInSatoshis
         * @return {Money}
         */
        value: function create(valueInSatoshis) {
            /**
             * @type {Big}
             */
            var value = _Currency3.default.toValueOrFail(valueInSatoshis);

            return new _Money2.default({
                value: value,
                currency: this
            });
        }

        /**
         * @param {Money|Number|String|Big|BigJsLibrary.BigJS} valueInSatoshis
         * @return {Money}
         */

    }, {
        key: "fromSatoshis",
        value: function fromSatoshis(valueInSatoshis) {
            return Satoshi.create(valueInSatoshis);
        }

        /**
         * @param {Number|String|Money|Big|BigJsLibrary.BigJS} valueInBitcoinOrMoney
         * @return {Money}
         */

    }, {
        key: "fromBitcoin",
        value: function fromBitcoin(valueInBitcoinOrMoney) {
            var bitcoin = _Currency3.default.toValueOrFail(valueInBitcoinOrMoney);

            return Satoshi.fromSatoshis(bitcoin.times(_Bitcoin2.default.SATOSHIS_PER_BITCOIN));
        }
    }, {
        key: "toString",
        value: function toString() {
            return 'Satoshi';
        }
    }]);

    return Satoshi;
}(_Currency3.default);

exports.default = Satoshi;
//# sourceMappingURL=Satoshi.js.map