'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;

import {Errors, AbstractError, PreconditionsError, HttpError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import {it, describe} from "mocha";

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
