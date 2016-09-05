'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import {ResourceLoader, FileResourceLoader, CachedResourceLoader} from "../src/js/data";
import Utility from "../src/js/Utility";

// import {Converter} from "../src/js/money";

describe('ResourceLoader', () => {

    it('load cert', (done) => {
        let resourceLoader =
            new CachedResourceLoader({
                resourceLoader: new FileResourceLoader({
                    path: '~/.coinme-node'
                })
            });

        resourceLoader.load('coinme-node-key.pem')
            .then((value) => {
                done();
            })
            .catch(done);
    })

});
