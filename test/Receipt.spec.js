'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import chai from 'chai';
import uuid from 'node-uuid';

const assert = chai.assert;
const expect = chai.expect;
import {Receipt, EndpointType, ReceiptBuilder, ReceiptEndpoint, EndpointTypes, KioskEndpointType, WalletEndpointType} from '../src/js/data/Receipt';

import {Utility, Preconditions} from '../src/js/index';
import {Errors, AbstractError, PreconditionsError, HttpError} from "../src/js/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "../src/js/money";
import {it, describe} from "mocha";
import {Address} from "../src/js/Address"
import {Instant} from "js-joda";
import Identity from "../src/js/data/Identity";

describe('Receipt', () => {

    it('EndpointTypes', () => {
        EndpointType.shouldBeInstance(EndpointTypes.WALLET);
        EndpointType.shouldBeInstance(EndpointTypes.KIOSK);

        KioskEndpointType.shouldBeInstance(EndpointTypes.KIOSK);
        WalletEndpointType.shouldBeInstance(EndpointTypes.WALLET);
    });

    it('ReceiptEndpoint', () => {
        let source = new ReceiptEndpoint({
            timestamp: Instant.now(),
            address: EndpointTypes.WALLET.toAddress('1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'),
            amount: Bitcoin.create(1)
        });

        ReceiptEndpoint.shouldBeInstance(source);
        ReceiptEndpoint.shouldBeClassOrInstance(source);

        assert.isTrue(WalletEndpointType.isInstance(source.type), 'isInstance');
        assert.isTrue(Utility.isString(source.address.value), 'isString');
        assert.isTrue(Utility.isNotBlank(source.address.value), 'isNotBlank');
    });

    it('toAddress', () => {
        let address = EndpointTypes.KIOSK.toAddress('kiosk:/southcenter');

        Address.shouldBeInstance(address);

        assert.equal(address.resource, 'kiosk');
        assert.equal(address.value, 'southcenter');

        // TODO:
    });

    it('Receipt', () => {
        let source = new ReceiptEndpoint({
            timestamp: Instant.now(),
            address: EndpointTypes.KIOSK.toAddress('kiosk:/southcenter'),
            amount: USD.create('10000')
        });

        let destination = new ReceiptEndpoint({
            timestamp: Instant.now(),
            address: 'bitcoin:/1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
            amount: EndpointTypes.WALLET.toMoney('10'),
            fee: null
        });

        let receipt = new Receipt({
            identity: 'identity:/asdfasdf',
            timestamp: Instant.now(),
            source: source,
            destination: destination
        });

        let json = receipt.toJson();

        console.log(json);
    });

    it('', () => {
        // EndpointTypes.KIOSK.create();

        // let southcenter = new ReceiptEndpoint({
        //     timestamp: Instant.now(),
        //     address: new Address('kiosk:/southcenter'),
        //     amount: USD.create(100),
        //     fee: 0
        // });
        //
        // let wallet = new ReceiptEndpoint({
        //     timestamp: Instant.now(),
        //     address: new Address('bitcoin:/1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'),
        //     amount: Bitcoin.create(1),
        //     fee: Bitcoin.create(.1)
        // });
        //
        // let receipt = new Receipt({
        //     source: southcenter,
        //     destination: wallet,
        //     timestamp: Instant.now()
        // });

        // let builder = new ReceiptBuilder({
        //     sourceType: EndpointTypes.KIOSK,
        //     destinationType: EndpointTypes.WALLET
        // });

        // builder
        //     .withSource(new KioskAddress('kiosk:/southcenter'))
        //     .withDestination('1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX');
    });


});