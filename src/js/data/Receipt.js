'use strict';

import CoreObject from "../CoreObject";
import Preconditions from "../Preconditions";
import Utility from "../Utility";
import {NotImplementedError} from "../errors/NotImplementedError";
import {Instant} from "js-joda/dist/js-joda";
import {Currency, USD, Money, Bitcoin} from "../money";
import {Address} from "../Address";
import Identity from "./Identity";

//region class EndpointType
class EndpointType extends CoreObject {

    /**
     *
     * @param {String|Money} stringOrMoney
     * @return {Money}
     */
    toMoney(stringOrMoney) {
        if (!stringOrMoney) {
            stringOrMoney = '0';
        }

        Currency.shouldBeCurrency(this.currency);

        let money = Currency.toMoney(stringOrMoney, this.currency);

        let currencyClass1 = this.currency.toClass();
        let currencyClass2 = money.currency.toClass();

        Preconditions.shouldBeClass(currencyClass2, currencyClass1);

        return money;
    }

    /**
     *
     * @param {String|Address|URI|ReceiptEndpoint} stringOrAddressOrUri
     * @return {Address}
     */
    toAddress(stringOrAddressOrUri) {
        if (stringOrAddressOrUri instanceof ReceiptEndpoint) {
            /**
             * @type {ReceiptEndpoint}
             */
            let endpoint = stringOrAddressOrUri;

            return endpoint.address;
        }

        let address = Address.toAddressWithDefaultScheme(stringOrAddressOrUri, this.name);

        console.log('thing', this.name, address);

        Preconditions.shouldBeInstance(address, Address, 'Wrong type');

        Preconditions.shouldBeTrue(
            Utility.isStringEqualIgnoreCase(address.resource, this.name),
            `Wrong resource type. Actual:${this.name} Expected:${address.resource}`);

        Preconditions.shouldBeDefined(address.valid);
        Preconditions.shouldBeTrue(address.valid, 'Address is not valid: ' + address);

        return address;
    }

    toJson() {
        return super.toJson({
            currency: Utility.optString(this.currency),
            name: this.name
        });
    }

    /**
     * @return {Class<Currency>}
     */
    get currency() {
        throw new NotImplementedError('type');
    }

    /**
     * @return {String}
     */
    get name() {
        throw new NotImplementedError('type');
    }
}

class KioskEndpointType extends EndpointType {

    /**
     * @return {Currency}
     */
    get currency() {
        return USD;
    }

    /**
     * @return {String}
     */
    get name() {
        return 'kiosk'
    }

    static create(options) {
        let fee = Utility.take(options, 'fee', {
            validator: function (value) {
                Preconditions.shouldBeNumber(value, 'Must be number');
                Preconditions.shouldBeTrue(value < 1, 'Fee should be less than 1');

                return value;
            }
        });

        let id = Utility.take(options, 'id', {
            type: 'String',
            required: true
        });

        return new KioskEndpointType({
            fee: fee,
            id: id
        });
    }
}

class WalletEndpointType extends EndpointType {


    /**
     * @return {Class<Currency>|Currency}
     */
    get currency() {
        return Bitcoin;
    }

    /**
     * @return {String}
     */
    get name() {
        return 'bitcoin';
    }
}
//endregion

let ENDPOINT_INSTANCE_KIOSK = new KioskEndpointType();
let ENDPOINT_INSTANCE_WALLET = new WalletEndpointType();
let endpointTypes = {};

endpointTypes[ENDPOINT_INSTANCE_WALLET.name] = ENDPOINT_INSTANCE_WALLET;
endpointTypes[ENDPOINT_INSTANCE_KIOSK.name] = ENDPOINT_INSTANCE_KIOSK;

//region class EndpointTypes
class EndpointTypes {

    static types = endpointTypes;

    /**
     * @return {KioskEndpointType}
     */
    static get KIOSK() {
        return ENDPOINT_INSTANCE_KIOSK;
    }

    /**
     * @return {WalletEndpointType}
     */
    static get WALLET() {
        return ENDPOINT_INSTANCE_WALLET;
    }

    /**
     * @param {Address|String|EndpointType} nameOrInstance
     * @return {EndpointType}
     */
    static getEndpointTypeOrFail(nameOrInstance) {
        if (Address.isInstance(nameOrInstance)) {
            nameOrInstance = Preconditions.shouldNotBeBlank(nameOrInstance.resource, `Name suspiciously blank ${nameOrInstance}`);
        } else if (EndpointType.isInstance(nameOrInstance)) {
            return nameOrInstance;
        } else if (Utility.isString(nameOrInstance)) {

        } else {
            throw new NotImplementedError(`Cannot work with ${nameOrInstance}`);
        }

        let type = EndpointTypes.types[nameOrInstance];

        Preconditions.shouldBeInstance(type, EndpointType, `EndpointType not found with name: '${nameOrInstance}'`);

        return type;
    }
}
//endregion

//region class ReceiptEndpoint
class ReceiptEndpoint extends CoreObject {

    //region fields
    /**
     * @type {Money}
     */
    _amount;

    /**
     * @type {Money}
     */
    _fee;

    /**
     * @type {Address}
     */
    _address;

    /**
     * @type {EndpointType}
     */
    _type;

    /**
     * @type {Instant}
     */
    _timestamp;
    //endregion

    /**
     *
     * @param {Object} options
     * @param {Address|String} options.address
     * @param {Money|String|Number|Big|BigJsLibrary.BigJS} options.amount
     * @param {Money|String|Number|Big|BigJsLibrary.BigJS} [options.fee]
     * @param {Instant|String|Number} options.timestamp If number, is assumed to be millis.
     */
    constructor(options) {
        /**
         * @type {Address}
         */
        let address = Address.toAddress(Utility.take(options, 'address', {
            type: Address,
            required: true,
            adapter: Address.toAddressWithDefaultScheme
        }));

        /**
         * @type {Instant}
         */
        let timestamp = Utility.take(options, 'timestamp', {
            required: true,
            validator: function (value) {
                return value instanceof Instant;
            }
        });

        /**
         * @type {Money}
         */
        let amount = Utility.take(options, 'amount', Money, true);

        let fee = Utility.take(options, 'fee', Money, false);

        super(...arguments);

        this._type = EndpointTypes.getEndpointTypeOrFail(address);
        this._address = address;
        this._amount = this.type.toMoney(amount);
        this._fee = this.type.toMoney(fee);
        this._timestamp = Utility.toDateTime(timestamp);
    }

    /**
     * @type {Address}
     */
    get address() {
        return this._address;
    }

    /**
     * @type {EndpointType}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {Money}
     */
    get amount() {
        return this._amount;
    }

    /**
     * @return {Money}
     */
    get fee() {
        return this._fee;
    }

    toJson() {
        return super.toJson({
            currency: Utility.optString(this.type.currency),
            fee: Utility.optString(Money.optValue(this.fee)),
            amount: Utility.optJson(Money.optValue(this.amount)),
            address: Utility.optString(this.address),
        });
    }
}
//endregion

//region class Receipt
class Receipt extends CoreObject {

    /**
     * @type Instant
     */
    _timestamp;

    /**
     * @type {ReceiptEndpoint}
     */
    _source;

    /**
     * @type {ReceiptEndpoint}
     */
    _destination;

    /**
     * @type {Identity}
     */
    _identity;

    /**
     * @param {Object} options
     * @param {ReceiptEndpoint} options.source
     * @param {ReceiptEndpoint} options.destination
     * @param {Instant} options.timestamp
     */
    constructor(options) {
        let source = Utility.take(options, 'source', ReceiptEndpoint, true);
        let destination = Utility.take(options, 'destination', ReceiptEndpoint, true);
        let identity = Utility.take(options, 'identity', Identity, true);
        let timestamp = Utility.take(options, 'timestamp', {
            required: true,
            adapter: function(value) {
                return Utility.optInstant(Utility.optDateTime(value));
            },
            validator: function (value) {
                return value instanceof Instant;
            }
        });

        super(...arguments);

        this._timestamp = timestamp;
        this._source = source;
        this._destination = destination;
        this._identity = identity;
    }

    /**
     * @return {Instant}
     */
    get timestamp() {
        return this._timestamp;
    }

    /**
     * @type {ReceiptEndpoint}
     */
    get source() {
        return this._source;
    }

    /**
     * @type {ReceiptEndpoint}
     */
    get destination() {
        return this._destination;
    }

    /**
     * @return {Identity}
     */
    get identity() {
        return this._identity;
    }

    toJson() {
        return super.toJson({
            identity: Utility.optString(this.identity),
            timestamp: Utility.optString(this.timestamp),
            source: Utility.optJson(this.source),
            destination: Utility.optJson(this.destination)
        });
    }
}
//endregion

//region class ReceiptBuilder (incomplete)
class ReceiptBuilder extends CoreObject {

    constructor(options) {
        super(...arguments);


    }

    from(kioskName, money) {

    }

    to() {

    }

    at() {

    }

}
//endregion

export {KioskEndpointType};
export {WalletEndpointType};
export {ReceiptBuilder};
export {EndpointTypes};
export {EndpointType};
export {ReceiptEndpoint};
export {Receipt};

export default Receipt;


