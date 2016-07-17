'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
import {Utility, Preconditions} from '../src/js/index';
import {Errors, AbstractError, PreconditionsError, HttpError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import {it, describe} from "mocha";

describe('Errors', () => {

    it('Errors.isErrorClass(Error)', () => {
        assert.isTrue(Errors.isErrorClass(Error));
    });

    it('Errors.isErrorClass(AbstractError)', () => {
        assert.isTrue(Errors.isErrorClass(AbstractError));
    });

    it('Errors.isErrorInstance(Error)', () => {
        assert.isTrue(Errors.isErrorInstance(new Error()));
    });

    it('Errors.isErrorInstance(AbstractError)', () => {
        assert.isTrue(Errors.isErrorInstance(new AbstractError('Abstract')));
    });

    it('Utility.isInstance(new PreconditionsError())', () => {
        let e = new PreconditionsError({});

        assert.isTrue(Utility.isError(e));
        assert.isTrue(Errors.isErrorInstance(e));
    });

    it('Preconditions.shouldBeType(error)', () => {
        Preconditions.shouldBeType('error', new PreconditionsError(), 'Should be error type');
        Preconditions.shouldBeType('error', new Error(), 'Should be error type');
    })

    it('PreconditionsError.isInstance(new PreconditionsError())', () => {
        assert.isTrue(PreconditionsError.isInstance(new PreconditionsError()));
    });

    it('AbstractError.isInstance(new AbstractError())', () => {
        assert.isTrue(AbstractError.isInstance(new AbstractError()));
    });

    it('Preconditions.shouldBeError', () => {
        let e = new PreconditionsError({
            message: 'message'
        });

        Preconditions.shouldBeError(e, PreconditionsError, 'bad type: ' + e);
    });
});

describe('HttpError', () => {

    it('HttpError.isClass(true)', () => {
        assert.isTrue(HttpError.isClass(HttpError));
    });

    it('HttpError.isClass(false)', () => {
        assert.isFalse(HttpError.isClass(Error));
    });

    it('HttpError.isClass(null)', () => {
        assert.isFalse(HttpError.isClass(null));
    });

    it('HttpError.isClass(null)', () => {
        assert.isFalse(HttpError.isClass(undefined));
    });

    it('Errors.badRequest(string, properties)', () => {
        let error = Errors.badRequest('blah', {
            propertyName: 'propertyValue'
        });

        assert.isTrue(error instanceof Error);
        assert.isTrue(error instanceof HttpError);
        assert.isTrue(HttpError.isInstance(error));

    });
});
