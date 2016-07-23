'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import chai from 'chai';
import uuid from 'node-uuid';

const assert = chai.assert;
const expect = chai.expect;
import {Receipt, EndpointType, ReceiptBuilder, ReceiptEndpoint, EndpointTypes, KioskEndpointType, AddressEndpointType} from '../src/js/data/Receipt';

import {Utility, Preconditions} from '../src/js/index';
import {Errors, AbstractError, PreconditionsError, HttpError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import {it, describe} from "mocha";

describe('Receipt', () => {

    it('EndpointTypes', () => {
        EndpointType.shouldBeInstance(EndpointTypes.ADDRESS);
        EndpointType.shouldBeInstance(EndpointTypes.KIOSK);

        KioskEndpointType.shouldBeInstance(EndpointTypes.KIOSK);
        AddressEndpointType.shouldBeInstance(EndpointTypes.ADDRESS);
    });

    it('ReceiptEndpoint', () => {
        let source = new ReceiptEndpoint({
            id: uuid.v1(),
            type: 'kiosk',
            amount: Bitcoin.create(1)
        });

        ReceiptEndpoint.shouldBeInstance(source);
        ReceiptEndpoint.shouldBeClassOrInstance(source);

        assert.isTrue(KioskEndpointType.isInstance(source.type));
        assert.isTrue(Utility.isString(source.id));
        assert.isTrue(Utility.isNotBlank(source.id));
    });

    it('Receipt', () => {
        let source = new ReceiptEndpoint({
            id: 'southcenter',
            type: EndpointTypes.KIOSK,
            amount: Bitcoin.fromSatoshi('10000')
        });

        let receipt = new Receipt({
            source: source,
            destination: source
        });
    });

    it('', () => {

        EndpointTypes.KIOSK;

    })
});