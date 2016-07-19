'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import "source-map-support/register";
import Promise from "bluebird";
import Ember from "~/Ember";
import Preconditions from "../src/js/Preconditions";
import Utility from "../src/js/Utility";
import Conversion from "../src/js/data/Conversion";
import Converter from "../src/js/data/Converter";

import {Currency, Bitcoin, Money, Satoshi } from "../src/js/money";

describe('Converter', function () {

    it('convert', (done) => {

        let converter = new Converter({
            getInputClass: function(money) { return money.currency.toClass(); },
            conversions: {
                /**
                 *
                 * @param {Money} money
                 * @returns {Money}
                 */
                'Bitcoin->Satoshi': function(money) {
                    return Satoshi.fromBitcoin(money);
                },

                'Satoshi->Bitcoin': function(money) {
                    return Bitcoin.fromSatoshi(money);
                }
            }
        });

        let bitcoin = Bitcoin.create(1);

        converter
            .convert(bitcoin, Satoshi)
            .then((/** @type {Conversion} */conversion) => {

                Conversion.shouldBeInstance(conversion);

                let satoshi = conversion.output;
                // satoshi.currency;
                // satoshi.value;

                assert.isTrue(Money.isInstance(satoshi), 'Satoshi should be an instance of Satoshi: ' + satoshi);
                assert.isFalse(Bitcoin.isInstance(satoshi), 'Satoshi should not be an instance of Bitcoin');

                assert.equal(satoshi.value.toFixed(), Bitcoin.SATOSHIS_PER_BITCOIN.toFixed());
                assert.equal(bitcoin.value.toFixed(), '1');
                assert.equal(Bitcoin.SATOSHIS_PER_BITCOIN.toFixed(), '100000000');
                assert.isTrue(conversion.stopwatch.finalized);
            })
            .then(done)
            .catch(done);
    });
});