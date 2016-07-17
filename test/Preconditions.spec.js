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
import CoreObject from "../src/js/CoreObject";

describe('Preconditions', () => {

    it('Should be undefined', () => {
        Preconditions.shouldBeUndefined(undefined);
    });

    it('Should be preconditions error', () => {
        Preconditions.shouldBePreconditionsError(new PreconditionsError());
    });

    it('shouldNotBeInstance', ()=>{
        Preconditions.shouldNotBeInstance(function() {}, 'the 3rd parameter cannot be an instance of a CoreObject field.');
    });

    it('shouldBeClass', ()=>{
        Preconditions.shouldBeClass(CoreObject, 'the 3rd parameter cannot be an instance of a CoreObject field.');
        Preconditions.shouldBeClass(CoreObject, CoreObject, 'the 3rd parameter cannot be an instance of a CoreObject field.');

        Preconditions.shouldFailWithPreconditionsError(() => {
            Preconditions.shouldBeClass(Object, 'the 3rd parameter cannot be an instance of a CoreObject field.');
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            Preconditions.shouldBeClass(CoreObject, Bitcoin, 'the 3rd parameter cannot be an instance of a CoreObject field.');
        });
    });

    it('Should be preconditions error', () => {
        try {
            Preconditions.shouldBePreconditionsError(new Error());

            throw new TypeError("Must throw");
        } catch (e) {
            if (!(e instanceof PreconditionsError)) {
                throw new TypeError("Was not correct type: " + e);
            }
        }
    });
});

