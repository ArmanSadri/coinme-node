import Preconditions from "./Preconditions";
import TimeUnit from "./TimeUnit";
import Utility from "./Utility";
import CoreObject from "./CoreObject";
import Stopwatch from "./Stopwatch";
import Errors from "./errors/Errors";
import Logger from 'winston';

class RateLimiter extends CoreObject {

    _permitsPerSecond;

    constructor(options) {
        super(options);

        /**
         * @type {Stopwatch}
         * @private
         */
        this._stopwatch = new Stopwatch({ start: true });

        // /**
        //  * @type {String}
        //  * @private
        //  */
        // this._failAction = Utility.take(options, 'failAction', {
        //         type: 'string',
        //         required: false,
        //         defaultValue: 'wait'
        //     });
    }

    //region property: {Stopwatch} stopwatch
    /**
     * @returns {Stopwatch}
     */
    get stopwatch() {
        return this._stopwatch;
    }

    //endregion

    //region property: {Ticker} ticker
    /**
     *
     * @return {Ticker}
     */
    get ticker() {
        return this.stopwatch.ticker;
    }
    //endregion

    //region property: {Number} permitsPerSecond

    /**
     * Updates the stable rate of this {@code RateLimiter}, that is, the
     * {@code permitsPerSecond} argument provided in the factory method that
     * constructed the {@code RateLimiter}. Currently throttled threads will <b>not</b>
     * be awakened as a result of this invocation, thus they do not observe the new rate;
     * only subsequent requests will.
     *
     * <p>Note though that, since each request repays (by waiting, if necessary) the cost
     * of the <i>previous</i> request, this means that the very next request
     * after an invocation to {@code setRate} will not be affected by the new rate;
     * it will pay the cost of the previous request, which is in terms of the previous rate.
     *
     * <p>The behavior of the {@code RateLimiter} is not modified in any other way,
     * e.g. if the {@code RateLimiter} was configured with a warmup period of 20 seconds,
     * it still has a warmup period of 20 seconds after this method invocation.
     *
     * @param {Number} permitsPerSecond the new stable rate of this {@code RateLimiter}
     * @throws IllegalArgumentException if {@code permitsPerSecond} is negative or zero
     */
    set permitsPerSecond(permitsPerSecond) {
        Preconditions.shouldBeExisting(permitsPerSecond);
        Preconditions.shouldBeTrue(permitsPerSecond > 0.0 && !Utility.isNaN(permitsPerSecond), "rate must be positive");

        this._permitsPerSecond = Preconditions.shouldBePositiveNumber(permitsPerSecond, 'Rate must be positive');

        this.doSetRate(permitsPerSecond, this.stopwatch.elapsedMicros());
    }

    /**
     *
     * @returns {Number}
     */
    get permitsPerSecond() {
        return this._permitsPerSecond;
    }

    //endregion

    /**
     * Acquires a single permit from this {@code RateLimiter}. Returns a Promise that will resolve or reject.
     * The default maximum time to wait is 30 seconds.
     *
     * <p>This method is equivalent to {@code acquire(1)}.
     *
     * @param {Number} [permits] defaults to 1
     * @param {Number} [timeout] defaults to 30
     * @param {TimeUnit} [timeUnit] defaults to seconds
     * @return {Promise} time spent sleeping to enforce rate, in seconds; 0.0 if not rate-limited
     * @since 16.0 (present in 13.0 with {@code void} return type})
     */
    acquire(permits, timeout, timeUnit) {
        return this.tryAcquire(permits, timeout, timeUnit);
    }

    /**
     * Reserves the given number of permits from this {@code RateLimiter} for future use, returning
     * the number of microseconds until the reservation can be consumed.
     *
     * @param {Number} [permits]
     * @return {Number} time in microseconds to wait until the resource can be acquired, never negative
     */
    reserve(permits) {
        permits = this.checkPermits(permits);

        return this.reserveAndGetWaitLength(permits, this.stopwatch.elapsedMicros());
    }

    /**
     * Reserves next ticket and returns the wait time that the caller must wait for.
     *
     * @private
     * @param {Number} permits
     * @param {Number} nowMicros
     * @return {Number} the required wait time, never negative
     */
    reserveAndGetWaitLength(permits, nowMicros) {
        let momentAvailable = this.reserveEarliestAvailable(permits, nowMicros);
        let waitLength = Math.max(momentAvailable - nowMicros, 0);

        console.log(`${this}.reserveAndGetWaitLength(${permits}, ${nowMicros}) ==> ${waitLength}`);
        // Logger.debug(`${this}.reserveAndGetWaitLength(${permits}, ${nowMicros}) ==> ${waitLength}`);

        return waitLength;
    }

    /**
     * @private
     * @param {Number} nowMicros
     * @param {Number} timeoutMicros
     * @returns {boolean}
     */
    canAcquire(nowMicros, timeoutMicros) {
        return this.queryEarliestAvailable(nowMicros) - timeoutMicros <= nowMicros;
    }

    /**
     * Acquires the given number of permits from this {@code RateLimiter} if it can be obtained
     * without exceeding the specified {@code timeout}, or returns {@code false}
     * immediately (without waiting) if the permits would not have been granted
     * before the timeout expired.
     *
     * @param {Number} [permits] the number of permits to acquire
     * @param {Number} [timeout] the maximum time to wait for the permits. Negative values are treated as zero.
     * @param {TimeUnit} [unit] the time unit of the timeout argument
     * @return {Promise} if the permits were acquired
     * @throws IllegalArgumentException if the requested number of permits is negative or zero
     */
    tryAcquire(permits, timeout, unit) {
        Preconditions.shouldBeNumber(this.permitsPerSecond, 'Rate must be defined.');

        permits = RateLimiter.checkPermits(permits);
        timeout = Utility.defaultNumber(timeout, 30);
        unit = Utility.defaultObject(unit, TimeUnit.SECONDS);

        let timeoutMicros = Math.max(unit.toMicros(timeout), 0);

        let microsToWait;
        let nowMicros = this.stopwatch.elapsedMicros();
        let goalMicros = this.queryEarliestAvailable(nowMicros);

        if (!this.canAcquire(nowMicros, timeoutMicros)) {
            return Promise.reject(new Error(`RateLimit exceeded: (rate:${this.permitsPerSecond}/sec) (timeoutMicros:${timeoutMicros}) (goalMicros: ${goalMicros}) (differenceMicros:${goalMicros - nowMicros})`));
        } else {
            microsToWait = this.reserveAndGetWaitLength(permits, nowMicros);
        }

        Preconditions.shouldBeExisting(this.ticker, 'ticker');
        return this.ticker.wait(microsToWait, TimeUnit.MICROSECONDS);
    }

    //region abstract
    /**
     * Returns the earliest time that permits are available (with one caveat).
     *
     * @param {Number} nowMicros
     * @return the time that permits are available, or, if permits are available immediately, an
     *     arbitrary past or present time
     */
    queryEarliestAvailable(nowMicros) {
        Errors.throwNotImplemented();
    }

    /**
     * Reserves the requested number of permits and returns the time that those permits can be used
     * (with one caveat).
     *
     * @param {Number} permits
     * @param {Number} nowMicros
     * @return {Number} the time that the permits may be used, or, if the permits may be used immediately, an
     *     arbitrary past or present time
     */
    reserveEarliestAvailable(permits, nowMicros) {
        Errors.throwNotImplemented();
    }

    //endregion

    //region statics
    /**
     * @private
     * @param {Number} [permits]
     * @returns {Number}
     */
    static checkPermits(permits) {
        if (Utility.isNotExisting(permits)) {
            return 1;
        }

        Preconditions.shouldBeNumber(permits, `Requested permits (${permits}) must be positive`);
        Preconditions.shouldBeTrue(permits > 0, `Requested permits (${permits}) must be positive`);

        return permits;
    }

    //endregion
}

class SmoothRateLimiter extends RateLimiter {

    constructor(options) {
        super(options);

        /**
         * The currently stored permits.
         */
        this._storedPermits = 0;

        /**
         * The maximum number of stored permits.
         * @type {Number}
         * @private
         */
        this._maxPermits = 0;

        /**
         * The interval between two unit requests, at our stable rate. E.g., a stable rate of 5 permits
         * per second has a stable interval of 200ms.
         */
        this._stableIntervalMicros = 0;

        /**
         * The time when the next request (no matter its size) will be granted. After granting a
         * request, this is pushed further in the future. Large requests push this further than small
         * requests.
         * @type {Number}
         * @private
         */
        this._nextFreeTicketMicros = 0; // could be either in the past or future
    }

    /**
     * @protected
     * @param permitsPerSecond
     * @param nowMicros
     */
    doSetRate(permitsPerSecond, nowMicros) {
        this.resync(nowMicros);
        let stableIntervalMicros = TimeUnit.SECONDS.toMicros(1) / permitsPerSecond;
        this._stableIntervalMicros = stableIntervalMicros;
        this.doSetRate2(permitsPerSecond, stableIntervalMicros);
    }

    /**
     * @protected
     * @param permitsPerSecond
     * @param stableIntervalMicros
     */
    doSetRate2(permitsPerSecond, stableIntervalMicros) {
        Errors.throwNotImplemented();
    }

    queryEarliestAvailable(nowMicros) {
        return Preconditions.shouldBeNumber(this._nextFreeTicketMicros);
    }

    reserveEarliestAvailable(requiredPermits, nowMicros) {
        this.resync(nowMicros);
        let nextFreeTicketMicros = this._nextFreeTicketMicros;

        let returnValue = nextFreeTicketMicros;
        let storedPermitsToSpend = Math.min(requiredPermits, this._storedPermits);
        let freshPermits = requiredPermits - storedPermitsToSpend;

        let waitMicros = this.storedPermitsToWaitTime(this._storedPermits, storedPermitsToSpend) + (freshPermits * this._stableIntervalMicros);

        this._nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
        this._storedPermits -= storedPermitsToSpend;

        return returnValue;
    }

    /**
     * Translates a specified portion of our currently stored permits which we want to
     * spend/acquire, into a throttling time. Conceptually, this evaluates the integral
     * of the underlying function we use, for the range of
     * [(storedPermits - permitsToTake), storedPermits].
     *
     * <p>This always holds: {@code 0 <= permitsToTake <= storedPermits}
     */
    storedPermitsToWaitTime(storedPermits, permitsToTake) {
        Errors.throwNotImplemented();
    }

    /**
     *
     * @param {Number} nowMicros
     * @return {Number}
     */
    resync(nowMicros) {
        if (Utility.isNullOrUndefined(nowMicros)) {
            nowMicros = this.stopwatch.elapsedMicros();
        }

        // if nextFreeTicket is in the past, resync to now
        let nextFreeTicketMicros = this._nextFreeTicketMicros;

        if (nowMicros > nextFreeTicketMicros) {
            this._storedPermits = Math.min(this._maxPermits, this._storedPermits + (nowMicros - nextFreeTicketMicros) / this._stableIntervalMicros);

            nextFreeTicketMicros = this._nextFreeTicketMicros = nowMicros;
        }

        return nextFreeTicketMicros;
    }
}

/**
 * This implements a "bursty" RateLimiter, where storedPermits are translated to
 * zero throttling. The maximum number of permits that can be saved (when the RateLimiter is
 * unused) is defined in terms of time, in this sense: if a RateLimiter is 2qps, and this
 * time is specified as 10 seconds, we can save up to 2 * 10 = 20 permits.
 */
class SmoothBurstyRateLimiter extends SmoothRateLimiter {

    /** The work (permits) of how many seconds can be saved up if this RateLimiter is unused? */
    maxBurstSeconds;

    /**
     * @param {Object} options
     * @param {Number} options.maxBurstSeconds
     * @param {Stopwatch} [options.stopwatch]
     */
    constructor(options) {
        let maxBurstSeconds = Utility.take(options, 'maxBurstSeconds', 'number', true);

        // SleepingStopwatch stopwatch, double maxBurstSeconds
        super(...arguments);

        this.maxBurstSeconds = maxBurstSeconds;
    }

    /**
     *
     * @param {Number} permitsPerSecond
     * @param {Number} stableIntervalMicros
     */
    doSetRate2(permitsPerSecond, stableIntervalMicros) {
        let oldMaxPermits = Utility.defaultNumber(this._maxPermits);
        let maxBurstSeconds = Utility.defaultNumber(this.maxBurstSeconds);

        this._maxPermits = maxBurstSeconds * permitsPerSecond;

        // if (oldMaxPermits == Double.POSITIVE_INFINITY) {
        //     // if we don't special-case this, we would get storedPermits == NaN, below
        //     this.storedPermits = maxPermits;
        // } else {
        this._storedPermits = (oldMaxPermits == 0.0)
            ? 0.0 // initial state
            : this._storedPermits * this._maxPermits / oldMaxPermits;
        // }

        Preconditions.shouldBeNumber(this._storedPermits, 'storedPermits');
        Preconditions.shouldBeNumber(this._maxPermits, '_maxPermits');
    }

    /**
     *
     * @param {Number} storedPermits
     * @param {Number} permitsToTake
     * @return {number}
     */
    storedPermitsToWaitTime(storedPermits, permitsToTake) {
        return 0;
    }
}

class SmoothWarmingUpRateLimiter extends SmoothRateLimiter {

    warmupPeriodMicros;

    /**
     * The slope of the line from the stable interval (when permits == 0), to the cold interval
     * (when permits == maxPermits)
     */
    slope;
    halfPermits;

    constructor(options) {
        //    SleepingStopwatch stopwatch, long warmupPeriod, TimeUnit timeUnit
        let timeUnit = Utility.take(options, 'timeUnit', TimeUnit, true);
        let warmupPeriod = Utility.take(options, 'warmupPeriod', 'number', true);

        super(...arguments);

        this.warmupPeriodMicros = timeUnit.toMicros(warmupPeriod);
    }

    /**
     * @private
     * @param permitsPerSecond
     * @param stableIntervalMicros
     */
    doSetRate2(permitsPerSecond, stableIntervalMicros) {
        let oldMaxPermits = this._maxPermits;
        this._maxPermits = this.warmupPeriodMicros / stableIntervalMicros;
        this.halfPermits = this._maxPermits / 2.0;

        // Stable interval is x, cold is 3x, so on average it's 2x. Double the time -> halve the rate
        let coldIntervalMicros = stableIntervalMicros * 3.0;
        this.slope = (coldIntervalMicros - stableIntervalMicros) / this.halfPermits;

        // if (oldMaxPermits == Number.POSITIVE_INFINITY) {
        //     // if we don't special-case this, we would get storedPermits == NaN, below
        //     this._storedPermits = 0.0;
        // } else {
            this._storedPermits = (oldMaxPermits == 0.0)
                ? this._maxPermits // initial state is cold
                : this._storedPermits * this._maxPermits / oldMaxPermits;
        // }
    }

    /**
     * @private
     * @param storedPermits
     * @param permitsToTake
     * @return {number}
     */
    storedPermitsToWaitTime(storedPermits, permitsToTake) {
        let availablePermitsAboveHalf = storedPermits - this.halfPermits;
        let micros = 0;
        // measuring the integral on the right part of the function (the climbing line)
        if (availablePermitsAboveHalf > 0.0) {
            let permitsAboveHalfToTake = Math.min(availablePermitsAboveHalf, permitsToTake);
            micros = (permitsAboveHalfToTake * (this.permitsToTime(availablePermitsAboveHalf)
                + this.permitsToTime(availablePermitsAboveHalf - permitsAboveHalfToTake)) / 2.0);
            permitsToTake -= permitsAboveHalfToTake;
        }
        // measuring the integral on the left part of the function (the horizontal line)
        micros += (this._stableIntervalMicros * permitsToTake);
        return micros;
    }

    /**
     * @private
     * @param permits
     * @return {*}
     */
    permitsToTime(permits) {
        return this._stableIntervalMicros + permits * this.slope;
    }
}

export {RateLimiter};
export {SmoothRateLimiter};
export {SmoothBurstyRateLimiter};
export {SmoothWarmingUpRateLimiter};
export default SmoothRateLimiter;
