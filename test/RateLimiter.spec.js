'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import TimeUnit from "../src/js/TimeUnit";
import {Errors, AbstractError, PreconditionsError} from "../src/js/errors";
import {Stopwatch} from "../src/js/Stopwatch";
import {SmoothBurstyRateLimiter, SmoothWarmingUpRateLimiter, Rate, SmoothRateLimiter} from "../src/js/RateLimiter";

describe('RateLimiter', () => {

    it('Rate.perSeconds().toSeconds()', () => {
        assert.equal(Rate.perSeconds(1).toNanos().value,  1000000000, '1');
        assert.equal(Rate.perSeconds(1).toNanos().timeUnit, TimeUnit.NANOSECONDS, '1');

        assert.equal(Rate.perSeconds(1).toMicros().value,  1000000, '2');
        assert.equal(Rate.perSeconds(1).toMicros().timeUnit, TimeUnit.MICROSECONDS, '2');

        assert.equal(Rate.perSeconds(1).toMillis().value, 1000, '3');
        assert.equal(Rate.perSeconds(1).toMillis().timeUnit, TimeUnit.MILLISECONDS, '3');

        assert.equal(Rate.perSeconds(1).toSeconds().value, 1, '4');
        assert.equal(Rate.perSeconds(1).toSeconds().timeUnit, TimeUnit.SECONDS, '4');


    });

    it('SmoothWarmingUpRateLimiter', (cb) => {
        let rateLimiter = new SmoothWarmingUpRateLimiter({
            rate: Rate.perDays(1)
        });

        rateLimiter.acquire(1, 0, TimeUnit.SECONDS)
            .then(() => {
                console.log('>>>> triggered <<<<');
            })
            .catch(cb);
    });
});
