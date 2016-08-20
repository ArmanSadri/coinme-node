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
import DelegatedConverter from "../src/js/data/DelegatedConverter";
import Adapter from "../src/js/data/Adapter";

describe('Converter', function () {

    /**
     * @return {Converter}
     */
    function createConverter() {
        return new DelegatedConverter({

            adapter: new Adapter({

                /**
                 *
                 * @param instanceOrClass
                 * @return {boolean}
                 */
                supports(instanceOrClass) {
                    return Money.isInstanceOrClass(instanceOrClass) || Currency.isInstanceOrClass(instanceOrClass);
                },

                /**
                 *
                 * @param {Money} input
                 * @return {*|Class.<Currency>|Ethereum|Bitcoin}
                 */
                adapt(input) {
                    this.shouldSupport(input);

                    return Currency.getCurrency(input);
                }
            }),

            conversions: {

                /**
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
    }

    it('convert', (done) => {
        /**
         * @type {Converter}
         */
        let converter = createConverter();

        function test(bitcoin, satoshi) {
            assert.isTrue(Money.isInstance(satoshi), 'Satoshi should be an instance of Satoshi: ' + satoshi);
            assert.isFalse(Bitcoin.isInstance(satoshi), 'Satoshi should not be an instance of Bitcoin');

            assert.equal(satoshi.value.toFixed(), Bitcoin.SATOSHIS_PER_BITCOIN.toFixed());
            assert.equal(bitcoin.value.toFixed(), '1');
            assert.equal(Bitcoin.SATOSHIS_PER_BITCOIN.toFixed(), '100000000');
        }

        let bitcoin = Bitcoin.create(1);
        let satoshi = converter.convert(bitcoin, Satoshi);

        test(bitcoin, satoshi);

        let adapter = converter.toAdapter({
            inputClass: Money,
            outputClass: Satoshi
        });

        let satoshi2 = adapter.adapt(bitcoin);

        test(bitcoin, satoshi2);

        let fn2 = adapter.toFunction();

        let satoshi3 = fn2(bitcoin, satoshi);

        test(bitcoin, satoshi3);

        let fn3 = converter.toFunction({
            inputClass: Money,
            outputClass: Satoshi
        });

        let satoshi4 = fn3(bitcoin);
        test(bitcoin, satoshi4);

        return done();
    });
});