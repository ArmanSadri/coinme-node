'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import URI from "urijs";
import {Errors, AbstractError, PreconditionsError} from "../src/js/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "../src/js/money";
import Address from "../src/js/Address";
import uuid from 'node-uuid';

describe('URI', () => {

    it('URI()', () => {

        /**
         * @type {URI}
         */
        let uri = URI('bitcoin:asdf-asdf');

        assert.equal(uri.scheme(), 'bitcoin');
        assert.equal(uri.path(), 'asdf-asdf', 'path');

    });
});

describe('Address', () => {

    it('Address.toUri', () => {

        assert.equal(Address.toUri('bitcoin://1FfmbHfnpaZjKFvyi1okTjJJusN455paPH').scheme(), 'bitcoin');
        assert.equal(Address.toUri('bitcoin://1FfmbHfnpaZjKFvyi1okTjJJusN455paPH').host(), '1FfmbHfnpaZjKFvyi1okTjJJusN455paPH');

        assert.equal(Address.toUri('bitcoin:/1FfmbHfnpaZjKFvyi1okTjJJusN455paPH').scheme(), 'bitcoin');
        assert.equal(Address.toUri('bitcoin:/1FfmbHfnpaZjKFvyi1okTjJJusN455paPH').host(), '1FfmbHfnpaZjKFvyi1okTjJJusN455paPH');

    });

    it('Address.toAddress', () => {
        let u = uuid.v4();
        let address = Address.toAddress('kiosk:/' + u);

        assert.equal(address.resource, 'kiosk', 'resource mismatch');
        assert.equal(address.value, u, `value mismatch`);

        assert.equal(Address.toAddress('kiosk:/southcenter').resource, 'kiosk');
        assert.equal(Address.toAddress('kiosk:/southcenter').value, 'southcenter');
    });

    it('Works', () => {
        let address = new Address('bitcoin:/1FfmbHfnpaZjKFvyi1okTjJJusN455paPH');

        assert.equal(address.resource, 'bitcoin');

        console.log(address.uri);

        assert.equal(address.value, '1FfmbHfnpaZjKFvyi1okTjJJusN455paPH');
    });

    it('Fail with incomplete address (with valid scheme)', () => {
        try {
            new Address('bitcoin');
        } catch (e) {
            console.log(e);

            assert.isTrue(PreconditionsError.isInstance(e));
        }
    });

    it('Fail with incomplete address (with invalid scheme)', () => {
        try {
            new Address('asdfasdf:/host');
        } catch (/** @type {PreconditionsError} */e) {
            console.log(e);

            assert.isTrue(PreconditionsError.isInstance(e));
            assert.equal(e.innerMessage, 'validator not found for \'asdfasdf\'');
        }
    });
});

