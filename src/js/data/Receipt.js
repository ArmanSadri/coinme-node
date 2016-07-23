'use strict';

import CoreObject from "../CoreObject";
import Preconditions from '../Preconditions';
import Utility from '../Utility';
import { Money, Currency } from '../money';
import {NotImplementedError} from "../errors/NotImplementedError";
import JodaTime from 'js-joda/dist/js-joda';

class EndpointType extends CoreObject {

    /**
     * @return {String}
     */
    get name() {
        throw new NotImplementedError('type');
    }

}

class KioskEndpointType extends EndpointType {

    /**
     * @return {String}
     */
    get name() {
        return 'kiosk'
    }
}

class AddressEndpointType extends EndpointType {

    /**
     * @return {String}
     */
    get name() {
        return 'address';
    }
}

let ENDPOINT_INSTANCE_KIOSK = new KioskEndpointType();
let ENDPOINT_INSTANCE_ADDRESS = new AddressEndpointType();
let endpointTypes = {};

endpointTypes[ENDPOINT_INSTANCE_ADDRESS.name] = ENDPOINT_INSTANCE_ADDRESS;
endpointTypes[ENDPOINT_INSTANCE_KIOSK.name] = ENDPOINT_INSTANCE_KIOSK;

class EndpointTypes {

    static types = endpointTypes;

    /**
     * @return {KioskEndpointType}
     */
    static get KIOSK() {
        return ENDPOINT_INSTANCE_KIOSK;
    }

    /**
     * @return {AddressEndpointType}
     */
    static get ADDRESS() {
        return ENDPOINT_INSTANCE_ADDRESS;
    }

    /**
     * @param {String|EndpointType} nameOrInstance
     * @return {EndpointType}
     */
    static getEndpointTypeOrFail(nameOrInstance) {
        if (EndpointType.isInstance(nameOrInstance)) {
            return nameOrInstance;
        }

        return Preconditions.shouldBeInstance(EndpointTypes.types[nameOrInstance], EndpointType, `EndpointType not found with name: '${nameOrInstance}'`);
    }
}

class ReceiptEndpoint extends CoreObject {

    /**
     * @type {Money}
     */
    _amount;

    /**
     * @type {Money}
     */
    _fee;

    /**
     * @type {String}
     */
    _id;

    /**
     * @type {EndpointType}
     */
    _type;

    /**
     * @type {js-time}
     */
    _timestamp;

    /**
     *
     * @param {Object} options
     * @param {String} options.id
     * @param {EndpointType|String} options.type
     * @param {Money} options.amount
     * @param {Money} options.fee
     * @param {Instant} options.timestamp
     */
    constructor(options) {
        /**
         * @type {String}
         */
        let id = Utility.take(options, 'id', {
            type: 'string',
            required: true
        });

        /**
         * @type {String}
         */
        let type = Utility.take(options, 'type', {
            adapter: EndpointTypes.getEndpointTypeOrFail,
            required: true
        });

        /**
         * @type {Money}
         */
        let amount = Utility.take(options, 'amount', Money, true);

        let fee = Utility.take(options, 'fee', Money, false);

        super(...arguments);

        this._id = id;
        this._type = type;
        this._amount = amount;
        this._fee = fee;
    }

    /**
     * @type {String}
     */
    get id() {
        return this._id;
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
}

class Receipt extends CoreObject {

    /**
     *
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
     *
     * @param {Object} options
     * @param {ReceiptEndpoint} options.source
     * @param {ReceiptEndpoint} options.destination
     * @param {ReceiptEndpoint} options.internalFee
     * @param {ReceiptEndpoint} options.externalFee
     */
    constructor(options) {
        let source = Utility.take(options, 'source', ReceiptEndpoint, true);
        let destination = Utility.take(options, 'destination', ReceiptEndpoint, true);

        super(...arguments);

        this._source = source;
        this._destination = destination;
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
     * @type {ReceiptEndpoint}
     */
    get internalFee() {
        return this._internalFee;
    }

    get externalFee() {
        return this._externalFee;
    }

}

class ReceiptBuilder extends CoreObject {




    static receipt() {

        return new ReceiptBuilder();
    }
}

export {KioskEndpointType};
export {AddressEndpointType};
export {ReceiptBuilder};
export {EndpointTypes};
export {EndpointType};
export {ReceiptEndpoint};
export {Receipt};

export default Receipt;


