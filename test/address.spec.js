'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import URI from "urijs";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import Address from "~/Address";

describe('URI', () => {

    it('URI()', () => {

        /**
         * @type {URI}
         */
        let uri = URI('bitcoin:asdf-asdf');

        console.log(JSON.stringify(uri));

        assert.equal(uri.scheme(), 'bitcoin');
        assert.equal(uri.path(), 'asdf-asdf', 'path');

    });
});

describe('Address', () => {

    it('Fail with incomplete address (with valid scheme)', () => {
        try {
            new Address('bitcoin');
        } catch (e) {
            assert.isTrue(PreconditionsError.isInstance(e));

            console.log(e);
        }
    });

    it('Fail with incomplete address (with invalid scheme)', () => {
        try {
            new Address('asdfasdf:/host');
        } catch (/** @type {PreconditionsError} */e) {
            console.log('error instance=', e);
            console.log('error instance=', e.constructor);
            console.log('error instance=', e.constructor.name);

            assert.isTrue(PreconditionsError.isInstance(e));
            assert.equal(e.innerMessage, 'validator not found for \'asdfasdf\'');
        }
    });
});

