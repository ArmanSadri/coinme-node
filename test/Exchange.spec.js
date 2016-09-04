// 'use strict';
//
// /**
//  * How to use Chai
//  * @see http://chaijs.com/api/assert/
//  */
// import {expect, assert} from "chai";
// import "source-map-support/register";
// import Promise from "bluebird";
// import Ember from "../src/js/Ember";
// import Preconditions from "../src/js/Preconditions";
// import Utility from "../src/js/Utility";
// import Conversion from "../src/js/data/Conversion";
//
// import {Currency, Bitcoin, Money, Satoshi, USD, Exchange} from "../src/js/money";
//
// describe('Exchange', function () {
//
//     it('convert', (done) => {
//         let exchange = new Exchange();
//
//         exchange.register(new Converter({
//             conversions: {
//                 /**
//                  *
//                  * @param {Money} money
//                  * @returns {Money}
//                  */
//                 'Bitcoin->Satoshi': function(money) {
//                     return Satoshi.fromBitcoin(money);
//                 },
//
//                 'Satoshi->Bitcoin': function(money) {
//                     return Bitcoin.fromSatoshi(money);
//                 }
//             }
//         }));
//
//         let bitcoin = Bitcoin.create(1);
//
//         exchange
//             .convert(bitcoin, Satoshi)
//             .then((/** @type {Conversion} */satoshi) => {
//
//                 // satoshi.currency;
//                 // satoshi.value;
//
//                 assert.isTrue(Money.isInstance(satoshi), 'Satoshi should be an instance of Satoshi: ' + satoshi);
//                 assert.isFalse(Bitcoin.isInstance(satoshi), 'Satoshi should not be an instance of Bitcoin');
//
//                 assert.equal(satoshi.value.toFixed(), Bitcoin.SATOSHIS_PER_BITCOIN.toFixed());
//                 assert.equal(bitcoin.value.toFixed(), '1');
//                 assert.equal(Bitcoin.SATOSHIS_PER_BITCOIN.toFixed(), '100000000')
//             })
//             .then(done)
//             .catch(done);
//     });
// });