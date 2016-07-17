'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Ember from "~/Ember";
import CoreObject from "~/CoreObject";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import "source-map-support/register";

describe('Ember', () => {

    it('computed properties', () => {

        var Record = CoreObject.extend({
            thong: Ember.computed('thingy', function () {
                return this.get('thingy') + 'thong';
            })
        });

        var record = new Record({
            thingy: false,
            believesInHumanity: false
        });

        assert.equal(record.get('believesInHumanity'), false);
        assert.equal(record.get('thingy'), false);
        assert.equal(record.get('thong'), 'falsethong');

        record.set('thingy', true);

        assert.equal(record.get('thingy'), true);
        assert.equal(record.get('thong'), 'truethong');
    });
});
