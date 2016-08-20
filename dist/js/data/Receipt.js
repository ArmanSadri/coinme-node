'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Receipt = exports.ReceiptEndpoint = exports.EndpointType = exports.EndpointTypes = exports.ReceiptBuilder = exports.WalletEndpointType = exports.KioskEndpointType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CoreObject5 = require("../CoreObject");

var _CoreObject6 = _interopRequireDefault(_CoreObject5);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _NotImplementedError = require("../errors/NotImplementedError");

var _jsJoda = require("js-joda/dist/js-joda");

var _money = require("../money");

var _Address = require("../Address");

var _Identity = require("./Identity");

var _Identity2 = _interopRequireDefault(_Identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//region EndpointType

var EndpointType = function (_CoreObject) {
    _inherits(EndpointType, _CoreObject);

    function EndpointType() {
        _classCallCheck(this, EndpointType);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EndpointType).apply(this, arguments));
    }

    _createClass(EndpointType, [{
        key: "toMoney",


        /**
         *
         * @param {String|Money} stringOrMoney
         * @return {Money}
         */
        value: function toMoney(stringOrMoney) {
            if (!stringOrMoney) {
                stringOrMoney = '0';
            }

            _money.Currency.shouldBeCurrency(this.currency);

            var money = _money.Currency.toMoney(stringOrMoney, this.currency);

            var currencyClass1 = this.currency.toClass();
            var currencyClass2 = money.currency.toClass();

            _Preconditions2.default.shouldBeClass(currencyClass2, currencyClass1);

            return money;
        }

        /**
         *
         * @param {String|Address|URI|ReceiptEndpoint} stringOrAddressOrUri
         * @return {Address}
         */

    }, {
        key: "toAddress",
        value: function toAddress(stringOrAddressOrUri) {
            if (stringOrAddressOrUri instanceof ReceiptEndpoint) {
                /**
                 * @type {ReceiptEndpoint}
                 */
                var endpoint = stringOrAddressOrUri;

                return endpoint.address;
            }

            var address = _Address.Address.toAddressWithDefaultScheme(stringOrAddressOrUri, this.name);

            console.log('thing', this.name, address);

            _Preconditions2.default.shouldBeInstance(address, _Address.Address, 'Wrong type');

            _Preconditions2.default.shouldBeTrue(_Utility2.default.isStringEqualIgnoreCase(address.resource, this.name), "Wrong resource type. Actual:" + this.name + " Expected:" + address.resource);

            _Preconditions2.default.shouldBeDefined(address.valid);
            _Preconditions2.default.shouldBeTrue(address.valid, 'Address is not valid: ' + address);

            return address;
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return _get(Object.getPrototypeOf(EndpointType.prototype), "toJson", this).call(this, {
                currency: _Utility2.default.optString(this.currency),
                name: this.name
            });
        }

        /**
         * @return {Class<Currency>}
         */

    }, {
        key: "currency",
        get: function get() {
            throw new _NotImplementedError.NotImplementedError('type');
        }

        /**
         * @return {String}
         */

    }, {
        key: "name",
        get: function get() {
            throw new _NotImplementedError.NotImplementedError('type');
        }
    }]);

    return EndpointType;
}(_CoreObject6.default);

var KioskEndpointType = function (_EndpointType) {
    _inherits(KioskEndpointType, _EndpointType);

    function KioskEndpointType() {
        _classCallCheck(this, KioskEndpointType);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(KioskEndpointType).apply(this, arguments));
    }

    _createClass(KioskEndpointType, [{
        key: "currency",


        /**
         * @return {Currency}
         */
        get: function get() {
            return _money.USD;
        }

        /**
         * @return {String}
         */

    }, {
        key: "name",
        get: function get() {
            return 'kiosk';
        }
    }], [{
        key: "create",
        value: function create(options) {
            var fee = _Utility2.default.take(options, 'fee', {
                validator: function validator(value) {
                    _Preconditions2.default.shouldBeNumber(value, 'Must be number');
                    _Preconditions2.default.shouldBeTrue(value < 1, 'Fee should be less than 1');

                    return value;
                }
            });

            var id = _Utility2.default.take(options, 'id', {
                type: 'String',
                required: true
            });

            return new KioskEndpointType({
                fee: fee,
                id: id
            });
        }
    }]);

    return KioskEndpointType;
}(EndpointType);

var WalletEndpointType = function (_EndpointType2) {
    _inherits(WalletEndpointType, _EndpointType2);

    function WalletEndpointType() {
        _classCallCheck(this, WalletEndpointType);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(WalletEndpointType).apply(this, arguments));
    }

    _createClass(WalletEndpointType, [{
        key: "currency",


        /**
         * @return {Class<Currency>|Currency}
         */
        get: function get() {
            return _money.Bitcoin;
        }

        /**
         * @return {String}
         */

    }, {
        key: "name",
        get: function get() {
            return 'bitcoin';
        }
    }]);

    return WalletEndpointType;
}(EndpointType);
//endregion

var ENDPOINT_INSTANCE_KIOSK = new KioskEndpointType();
var ENDPOINT_INSTANCE_WALLET = new WalletEndpointType();
var endpointTypes = {};

endpointTypes[ENDPOINT_INSTANCE_WALLET.name] = ENDPOINT_INSTANCE_WALLET;
endpointTypes[ENDPOINT_INSTANCE_KIOSK.name] = ENDPOINT_INSTANCE_KIOSK;

var EndpointTypes = function () {
    function EndpointTypes() {
        _classCallCheck(this, EndpointTypes);
    }

    _createClass(EndpointTypes, null, [{
        key: "getEndpointTypeOrFail",


        /**
         * @param {Address|String|EndpointType} nameOrInstance
         * @return {EndpointType}
         */
        value: function getEndpointTypeOrFail(nameOrInstance) {
            if (_Address.Address.isInstance(nameOrInstance)) {
                nameOrInstance = _Preconditions2.default.shouldNotBeBlank(nameOrInstance.resource, "Name suspiciously blank " + nameOrInstance);
            } else if (EndpointType.isInstance(nameOrInstance)) {
                return nameOrInstance;
            } else if (_Utility2.default.isString(nameOrInstance)) {} else {
                throw new _NotImplementedError.NotImplementedError("Cannot work with " + nameOrInstance);
            }

            var type = EndpointTypes.types[nameOrInstance];

            _Preconditions2.default.shouldBeInstance(type, EndpointType, "EndpointType not found with name: '" + nameOrInstance + "'");

            return type;
        }
    }, {
        key: "KIOSK",


        /**
         * @return {KioskEndpointType}
         */
        get: function get() {
            return ENDPOINT_INSTANCE_KIOSK;
        }

        /**
         * @return {WalletEndpointType}
         */

    }, {
        key: "WALLET",
        get: function get() {
            return ENDPOINT_INSTANCE_WALLET;
        }
    }]);

    return EndpointTypes;
}();

EndpointTypes.types = endpointTypes;

var ReceiptEndpoint = function (_CoreObject2) {
    _inherits(ReceiptEndpoint, _CoreObject2);

    //endregion

    /**
     *
     * @param {Object} options
     * @param {Address|String} options.address
     * @param {Money|String|Number|Big|BigJsLibrary.BigJS} options.amount
     * @param {Money|String|Number|Big|BigJsLibrary.BigJS} [options.fee]
     * @param {Instant|String|Number} options.timestamp If number, is assumed to be millis.
     */


    /**
     * @type {EndpointType}
     */


    /**
     * @type {Money}
     */

    function ReceiptEndpoint(options) {
        _classCallCheck(this, ReceiptEndpoint);

        /**
         * @type {Address}
         */
        var address = _Address.Address.toAddress(_Utility2.default.take(options, 'address', {
            type: _Address.Address,
            required: true,
            adapter: _Address.Address.toAddressWithDefaultScheme
        }));

        /**
         * @type {Instant}
         */
        var timestamp = _Utility2.default.take(options, 'timestamp', {
            required: true,
            validator: function validator(value) {
                return value instanceof _jsJoda.Instant;
            }
        });

        /**
         * @type {Money}
         */
        var amount = _Utility2.default.take(options, 'amount', _money.Money, true);

        var fee = _Utility2.default.take(options, 'fee', _money.Money, false);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ReceiptEndpoint).apply(this, arguments));

        _this4._type = EndpointTypes.getEndpointTypeOrFail(address);
        _this4._address = address;
        _this4._amount = _this4.type.toMoney(amount);
        _this4._fee = _this4.type.toMoney(fee);
        _this4._timestamp = _Utility2.default.toDateTime(timestamp);
        return _this4;
    }

    /**
     * @type {Address}
     */


    /**
     * @type {Instant}
     */


    /**
     * @type {Address}
     */


    //region fields
    /**
     * @type {Money}
     */


    _createClass(ReceiptEndpoint, [{
        key: "toJson",
        value: function toJson() {
            return _get(Object.getPrototypeOf(ReceiptEndpoint.prototype), "toJson", this).call(this, {
                currency: _Utility2.default.optString(this.type.currency),
                fee: _Utility2.default.optString(_money.Money.optValue(this.fee)),
                amount: _Utility2.default.optJson(_money.Money.optValue(this.amount)),
                address: _Utility2.default.optString(this.address)
            });
        }
    }, {
        key: "address",
        get: function get() {
            return this._address;
        }

        /**
         * @type {EndpointType}
         */

    }, {
        key: "type",
        get: function get() {
            return this._type;
        }

        /**
         * @type {Money}
         */

    }, {
        key: "amount",
        get: function get() {
            return this._amount;
        }

        /**
         * @return {Money}
         */

    }, {
        key: "fee",
        get: function get() {
            return this._fee;
        }
    }]);

    return ReceiptEndpoint;
}(_CoreObject6.default);

var Receipt = function (_CoreObject3) {
    _inherits(Receipt, _CoreObject3);

    /**
     * @param {Object} options
     * @param {ReceiptEndpoint} options.source
     * @param {ReceiptEndpoint} options.destination
     * @param {Instant} options.timestamp
     */


    /**
     * @type {ReceiptEndpoint}
     */


    /**
     * @type Instant
     */

    function Receipt(options) {
        _classCallCheck(this, Receipt);

        var source = _Utility2.default.take(options, 'source', ReceiptEndpoint, true);
        var destination = _Utility2.default.take(options, 'destination', ReceiptEndpoint, true);
        var identity = _Utility2.default.take(options, 'identity', _Identity2.default, true);
        var timestamp = _Utility2.default.take(options, 'timestamp', {
            required: true,
            adapter: function adapter(value) {
                return _Utility2.default.optInstant(_Utility2.default.optDateTime(value));
            },
            validator: function validator(value) {
                return value instanceof _jsJoda.Instant;
            }
        });

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Receipt).apply(this, arguments));

        _this5._timestamp = timestamp;
        _this5._source = source;
        _this5._destination = destination;
        _this5._identity = identity;
        return _this5;
    }

    /**
     * @return {Instant}
     */


    /**
     * @type {Identity}
     */


    /**
     * @type {ReceiptEndpoint}
     */


    _createClass(Receipt, [{
        key: "toJson",
        value: function toJson() {
            return _get(Object.getPrototypeOf(Receipt.prototype), "toJson", this).call(this, {
                identity: _Utility2.default.optString(this.identity),
                timestamp: _Utility2.default.optString(this.timestamp),
                source: _Utility2.default.optJson(this.source),
                destination: _Utility2.default.optJson(this.destination)
            });
        }
    }, {
        key: "timestamp",
        get: function get() {
            return this._timestamp;
        }

        /**
         * @type {ReceiptEndpoint}
         */

    }, {
        key: "source",
        get: function get() {
            return this._source;
        }

        /**
         * @type {ReceiptEndpoint}
         */

    }, {
        key: "destination",
        get: function get() {
            return this._destination;
        }

        /**
         * @return {Identity}
         */

    }, {
        key: "identity",
        get: function get() {
            return this._identity;
        }
    }]);

    return Receipt;
}(_CoreObject6.default);

var ReceiptBuilder = function (_CoreObject4) {
    _inherits(ReceiptBuilder, _CoreObject4);

    function ReceiptBuilder(options) {
        _classCallCheck(this, ReceiptBuilder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ReceiptBuilder).apply(this, arguments));
    }

    _createClass(ReceiptBuilder, [{
        key: "from",
        value: function from(kioskName, money) {}
    }, {
        key: "to",
        value: function to() {}
    }, {
        key: "at",
        value: function at() {}
    }]);

    return ReceiptBuilder;
}(_CoreObject6.default);

exports.KioskEndpointType = KioskEndpointType;
exports.WalletEndpointType = WalletEndpointType;
exports.ReceiptBuilder = ReceiptBuilder;
exports.EndpointTypes = EndpointTypes;
exports.EndpointType = EndpointType;
exports.ReceiptEndpoint = ReceiptEndpoint;
exports.Receipt = Receipt;
exports.default = Receipt;
//# sourceMappingURL=Receipt.js.map