'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Functions from "../src/js/Functions";
import {Errors, AbstractError, PreconditionsError} from "../src/js/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "../src/js/money";
import "source-map-support/register";

describe('Functions', () => {

    it('Should return scope', () => {
        var scope = 5;

        assert.equal(Functions.identity.apply(scope), scope);
    });

});

