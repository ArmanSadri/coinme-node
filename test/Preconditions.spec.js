'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Functions from "~/Functions";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import "source-map-support/register";
import Preconditions from "../src/js/Preconditions";

describe('Preconditions', () => {

    it('Should be undefined', () => {
        Preconditions.shouldBeUndefined(undefined);
    });

});

