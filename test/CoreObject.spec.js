'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import CoreObject from "~/CoreObject";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import "source-map-support/register";

describe('CoreObject', () => {

    it('isClass - self', () => {
        assert.isTrue(CoreObject.isClass(CoreObject));
        assert.isFalse(CoreObject.isClass(function () {
        }));
        assert.isFalse(CoreObject.isClass(new CoreObject()));
        assert.isFalse(CoreObject.isClass(new CoreObject({})));

        assert.isTrue(CoreObject.isClass((new CoreObject({})).toClass()));
    });

    it('isInstance - self', () => {
        assert.isFalse(CoreObject.isInstance(CoreObject));
        assert.isTrue(CoreObject.isInstance(new CoreObject()));
        assert.isFalse(CoreObject.isInstance({}));
    });

    it('isClass - subclass', () => {
        class Subclass extends CoreObject {

        }

        assert.isTrue(CoreObject.isClass(Subclass), 'Subclass should be a CoreObject');
        assert.isFalse(CoreObject.isClass(new Subclass()));
        assert.isTrue(CoreObject.isInstance(new Subclass()), 'subclass is instance of CoreObject');
    });
});