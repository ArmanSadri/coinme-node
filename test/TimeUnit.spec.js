'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import TimeUnit from "~/TimeUnit";
import {Errors, AbstractError, PreconditionsError} from "~/errors";

describe('TimeUnit', () => {
    it('Seconds -> Nanos', () => {
        assert.equal(TimeUnit.NANOSECONDS.convert(1, TimeUnit.SECONDS), 1000000000);
    });
    it('Seconds -> Micros', () => {
        assert.equal(TimeUnit.MICROSECONDS.convert(1, TimeUnit.SECONDS), 1000000);
    });
    it('Seconds -> Millis', () => {
        assert.equal(TimeUnit.MILLISECONDS.convert(1, TimeUnit.SECONDS), 1000);
    });
    it('Seconds -> Seconds', () => {
        assert.equal(TimeUnit.SECONDS.convert(1, TimeUnit.SECONDS), 1);
    });
    it('Seconds -> Minutes', () => {
        assert.equal(TimeUnit.MINUTES.convert(1, TimeUnit.SECONDS), 0.016666666666666666);
    });
    it('Seconds -> Hours', () => {
        assert.equal(TimeUnit.HOURS.convert(1, TimeUnit.SECONDS), 0.0002777777777777778);
    });
    it('Seconds -> Days', () => {
        assert.equal(TimeUnit.DAYS.convert(1, TimeUnit.SECONDS), 0.000011574074074074073);
    });
});
