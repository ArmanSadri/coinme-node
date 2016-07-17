'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import Preconditions from "~/Preconditions";
import Big from 'big.js';

describe('Money', () => {
    it('', () => {
        let b = Bitcoin.create(1);

        assert.isTrue(b.value instanceof Big);
    });

    it('shouldBeMoney', () => {
        let money = Bitcoin.create(1);

        assert.equal(Money.shouldBeMoney(money), money);
    });

    it('new Bitcoin() - fails', () => {
        try {
            new Money();

            assert.isTrue(false, 'The Bitcoin constructor should have thrown.');
        } catch (e) {
            Preconditions.shouldBeError(e, PreconditionsError, 'bad type: ' + e);
        }
    });

    // it('Bitcoin.convert', () => {
    //
    //     assert.equal(Bitcoin.create(1).convertTo(Satoshi, Bitcoin.SATOSHIS_PER_BITCOIN), Bitcoin.SATOSHIS_PER_BITCOIN);
    //
    //     assert.equal(Satoshi.create(Bitcoin.SATOSHIS_PER_BITCOIN).convertTo(Bitcoin, Bitcoin.BITCOIN_PER_SATOSHI), 1);
    //
    // });

    it('Bitcoin.add', () => {
        let bitcoin = Bitcoin.create(1);
        let bitcoin2 = bitcoin.plus(bitcoin);

        // assert.equal(bitcoin.value, 1);
        // assert.equal(bitcoin2.value, 2);

        /**
         * @type {Money}
         */
        // let usd = USD.create(1);

        // usd.convertTo(Bitcoin, 1);
        //
        // usd.convertTo(Bitcoin, function (valueInUsd) {
        //     return valueInUsd;
        // });
        //
        // usd.convertTo(Bitcoin, new Converter({
        //
        //     conversionRate: 2,
        //
        //     conversions: {
        //         'Bitcoin->USD': function (valueInBitcoin) {
        //             return valueInBitcoin / this.conversionRate;
        //         },
        //         'USD->Bitcoin': function (valueInUsd) {
        //             return valueInUsd * this.conversionRate;
        //         }
        //     }
        // }));

        // let bitcoin4 = usd.convertTo(Bitcoin);
        //
        // Currency.converter.register({
        //     'Bitcoin->USD': 4,
        //     'USD->Bitcoin': 1/4
        // });
    });

    it('Simple case', () => {
        let bitcoin1 = Bitcoin.create(1);
        /**
         * @type {Money}
         */
        let satoshi = Satoshi.create(Bitcoin.SATOSHIS_PER_BITCOIN);
        let bitcoin2 = Bitcoin.fromSatoshi(satoshi);

        assert.isTrue(bitcoin1.equals(bitcoin1), 'eq0'); // equals does an internal convert
        assert.isTrue(bitcoin1.equals(bitcoin2), 'eq1'); // equals does an internal convert
        assert.isTrue(bitcoin2.equals(bitcoin1), 'eq2');

        assert.equal(bitcoin1.value, 1); // Money.valueOf() returns a number, which can be compared.
        assert.equal(bitcoin2.value, 1); // Money.valueOf() returns a number, which can be compared.

        // The PLUS operator coerces into a number
        // assert.isTrue(bitcoin.plus(satoshi).equals(Bitcoin.create(2)));
        // assert.isTrue(bitcoin.plus(satoshi).equals(2));

        // assert.equal(bitcoin.plus(satoshi) + 0, 2);
        // assert.equal(satoshi.convertTo(Bitcoin) + 1, 2);
    });

    it('fromBitcoin', () => {
        let money = Bitcoin.fromBitcoin(1);

        assert.isFalse(Money.isClass(money), 'money is Money - static');
        assert.isTrue(Money.isInstance(money), 'money is Money - instance');
        assert.isTrue(Bitcoin.isCurrency(money.currency), 'money.currency is Currency');
        assert.isTrue(Bitcoin.isBitcoin(money.currency), 'money.currency is Bitcoin');

        Bitcoin.shouldBeBitcoin(money.currency);
        Bitcoin.shouldBeBitcoin(money);
    });

    it('Example', () => {
        let money = Bitcoin.fromBitcoin(1);
        let money2 = Bitcoin.fromBitcoin(money);

        assert.equal(money.value, money2.value, money.value + ':' + money2.value);
        assert.isTrue(Bitcoin.isBitcoin(money));
        assert.isTrue(Bitcoin.isBitcoin(money2));
    });

    it('Convert: manual ', () => {
        let bitcoin = Bitcoin.fromBitcoin(1);
        let satoshis = Satoshi.fromBitcoin(bitcoin);

        assert.equal(bitcoin.value, 1);
        assert.equal(satoshis.value, Bitcoin.SATOSHIS_PER_BITCOIN * bitcoin.value);
    });

    it('Convert: bitcoin->satoshi', () => {
        let bitcoin = Bitcoin.create(1);
        let satoshis = Satoshi.fromBitcoin(bitcoin);

        assert.equal(bitcoin.value.toFixed(), '1', 'bitcoin.value');
        assert.equal(satoshis.value.toFixed(), '100000000', 'Value should be a number');
        assert.equal(satoshis.value.toFixed(), Bitcoin.SATOSHIS_PER_BITCOIN.times(bitcoin.value).toFixed(), 'conversion problem');

        assert.equal(Satoshi.fromBitcoin(bitcoin).value.toFixed(), satoshis.value.toFixed(), '1');
        assert.equal(Satoshi.fromBitcoin(bitcoin).value.toFixed(), bitcoin.value.times(Bitcoin.SATOSHIS_PER_BITCOIN).toFixed(), '2');
        assert.equal(Satoshi.fromSatoshis(satoshis).value.toFixed(), satoshis.value.toFixed(), '4');

        // assert.equal(bitcoin.plus(satoshis).value, 2, '5');
        // assert.equal(bitcoin.plus(satoshis).convertTo(Satoshi).value, 200000000);

        // assert.equal(
        //     bitcoin
        //         .plus(bitcoin)
        //         .plus(1)
        //         .plus('1')
        //         .plus(bitcoin)
        //         .value,
        //     5);
    });

    it('Currency.equals', () => {
        assert.isTrue(Currency.equals(Currency), 'Currency equals self');
        assert.isTrue(Bitcoin.equals(Bitcoin));
        assert.isTrue(USD.equals(USD));

        assert.isFalse(USD.equals(Bitcoin));
        assert.isFalse(USD.equals(Currency));
    });

    // it('Convert: bitcoin->fiat', () => {
    //     let bitcoin = Bitcoin.create(1);
    //
    //     // Should work for self
    //     {
    //         let usd1 = USD.create(1);
    //         let usd2 = usd1.convertTo(USD);
    //
    //         assert.equal(+usd1, +usd2);
    //         assert.isTrue(usd1.value == usd2.value);
    //         assert.isTrue(usd1.value === usd2.value);
    //         assert.equal(usd1.valueOf(), usd2.valueOf());
    //     }
    //
    //     {
    //         // This only works because we passed in a converting function
    //         let converterFn = function (valueInBitcoin) {
    //             return valueInBitcoin * .5;
    //         };
    //
    //         let usd = bitcoin.convertTo(USD, /* required because not registered */ converterFn);
    //
    //         assert.equal(usd.value, bitcoin.value / 2);
    //     }
    //
    //     {
    //         assert.equal(bitcoin.convertTo(USD, .5).value, bitcoin.value / 2);
    //     }
    //
    //     // Should fail, because no conversions registered.
    //     {
    //         try {
    //             bitcoin.convertTo(USD);
    //
    //             assert.isTrue(false, 'Should have failed earlier');
    //         } catch (e) {
    //         }
    //     }
    //
    //     {
    //         Currency.converter.register({
    //             'Bitcoin->USD': function () {
    //                 return 2;
    //             }
    //         });
    //
    //         assert.equal(bitcoin.convertTo(USD).value, bitcoin.value * 2);
    //     }
    // });

});

