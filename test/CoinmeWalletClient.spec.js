'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import {Converter} from "../src/js/money";
import {CoinmeWalletClient, CoinmeWalletClientConfiguration} from "../src/js/net/CoinmeWalletClient";

describe('CoinmeWalletClient', () => {

    it('CoinmeWalletClient.myself', (done) => {
        let client = new CoinmeWalletClient({
            configuration: new CoinmeWalletClientConfiguration()
        });

        client
            .peek('SMYERMA170QE')
            .then((user) => {
                done(null, user);
            })
            .catch(done);
    });
});
