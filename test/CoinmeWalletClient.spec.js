'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
// import {Converter} from "../src/js/money";
import {Identity} from "../src/js/data/Identity";
import {Address} from "../src/js/Address";
import {CoinmeWalletClient, CoinmeWalletClientConfiguration} from "../src/js/net/CoinmeWalletClient";
import Ember from "../src/js/Ember";
import { CertificateBundle, Certificate} from "../src/js/data/CertificateBundle";
import ResourceLoader from "../src/js/data/ResourceLoader";
import {Instant} from "js-joda";
import {Receipt, EndpointTypes, ReceiptEndpoint} from "../src/js/data/Receipt";
import USD from '../src/js/money/USD';

describe('CoinmeWalletClient', () => {

    // it('CertificateBundle', () => {
    //
    //     CertificateBundle.fromHome();
    //
    //     CertificateBundle.fromFolder('~/.coinme-node');
    //
    // });

    // it('CoinmeWalletClientConfiguration.clone', () => {
    //     let configuration = new CoinmeWalletClientConfiguration({
    //         identity: new Identity('library:/coinme-node')
    //     });
    //
    //     let configuration2 = configuration.clone();
    //
    //     assert.equal(configuration.identity.toString(), configuration2.identity.toString())
    // });

    // it('CoinmeWalletClient.notifyReceipt', (done) => {
    //     let source = new ReceiptEndpoint({
    //         timestamp: Instant.now(),
    //         address: EndpointTypes.KIOSK.toAddress('kiosk:/southcenter'),
    //         amount: USD.create('10000')
    //     });
    //
    //     let destination = new ReceiptEndpoint({
    //         timestamp: Instant.now(),
    //         address: 'bitcoin:/1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
    //         amount: EndpointTypes.WALLET.toMoney('10'),
    //         fee: null
    //     });
    //
    //     let receipt = new Receipt({
    //         identity: 'user:/SMYERMA170QE',
    //         timestamp: Instant.now(),
    //         source: source,
    //         destination: destination
    //     });
    //
    //     let client = new CoinmeWalletClient({
    //         configuration: new CoinmeWalletClientConfiguration({
    //             baseUrl: 'http://localhost:1339',
    //             identity: new Identity('library:/coinme-node')
    //         })
    //     });
    //
    //     client.notifyReceipt(receipt)
    //         .then(() => { done(null) })
    //         .catch(done)
    //     ;
    // });
    //
    // it('CoinmeWalletClient.myself', (done) => {
    //     let client = new CoinmeWalletClient({
    //         configuration: new CoinmeWalletClientConfiguration({
    //             certificate: CertificateBundle.fromFolder('~/.coinme-node'),
    //             identity: new Identity('library:/coinme-node')
    //         })
    //     });
    //
    //     client
    //         .peek('SMYERMA170QE')
    //         .then((/** @type {UserExistenceToken} */ user) => {
    //
    //             assert.equal(user.username, 'SMYERMA170QE');
    //             assert.isTrue(user.exists);
    //
    //             return user;
    //         })
    //         .then(() => {
    //             done();
    //         })
    //         .catch((err) => {
    //             done(err);
    //         });
    // });
});
