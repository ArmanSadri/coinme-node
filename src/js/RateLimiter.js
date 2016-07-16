import Preconditions from "./Preconditions";
import TimeUnit from "./TimeUnit";
import Utility from "./Utility";
import CoreObject from "./CoreObject";
import Stopwatch from "./Stopwatch";

const MICROSECONDS = TimeUnit.MICROSECONDS;
const SECONDS = TimeUnit.SECONDS;

class RateLimiter extends CoreObject {

    constructor(options) {
        super(options);

        /**
         * @type {Stopwatch}
         * @private
         */
        this._stopwatch = new Stopwatch({ start: true });

        /**
         * @type {String}
         * @private
         */
        this._failAction = Utility.take(options, 'failAction', {
                type: 'string',
                required: false,
                defaultValue: 'wait'
            });
    }

    //region property: {String} failAction
    /**
     * @returns {String}
     */
    get failAction() {
        return this._failAction;
    }
    //endregion

    //region property: {Stopwatch} stopwatch
    /**
     * @returns {Stopwatch}
     */
    get stopwatch() {
        return this._stopwatch;
    }
    //endregion

    //region property: {String} rate

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
    set rate(permitsPerSecond) {
        Preconditions.shouldBeTrue(permitsPerSecond > 0.0 && !Utility.isNaN(permitsPerSecond), "rate must be positive");

        this._rate = permitsPerSecond;
    }

    /**
     *
     * @returns {Number}
     */
    get rate() {
        return this._rate;
    }
    //endregion

    /**
     * Acquires a single permit from this {@code RateLimiter}, blocking until the
     * request can be granted. Tells the amount of time slept, if any.
     *
     * <p>This method is equivalent to {@code acquire(1)}.
     *
     * @param {Number} [permits]
     * @return {Number} time spent sleeping to enforce rate, in seconds; 0.0 if not rate-limited
     * @since 16.0 (present in 13.0 with {@code void} return type})
     */
    acquire(permits) {
        return new Promise((resolve, reject) => {
            return self.tryAcquire(permits);
        });
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

        return max(momentAvailable - nowMicros, 0);
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
     * @return {boolean} if the permits were acquired
     * @throws IllegalArgumentException if the requested number of permits is negative or zero
     */
    tryAcquire(permits, timeout, unit) {
        permits = RateLimiter.checkPermits(permits);
        timeout = Utility.defaultNumber(timeout, 0);
        unit = Utility.defaultObject(unit, MICROSECONDS);

        let timeoutMicros = Math.max(unit.toMicros(timeout), 0);

        let microsToWait;
        let nowMicros = this.stopwatch.elapsedMicros();

        if (!this.canAcquire(nowMicros, timeoutMicros)) {
            return false;
        } else {
            microsToWait = this.reserveAndGetWaitLength(permits, nowMicros);
        }

        this.stopwatch.sleepMicrosUninterruptibly(microsToWait);

        return true;
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
        throw new Error('Not implemented');
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
        throw new Error('Not implemented');
    }
    //endregion

    //region statics
    /**
     * @private
     * @param {Number} [permits]
     * @returns {Number}
     */
    static checkPermits(permits) {
        if (Utility.isNullOrUndefined(permits)) {
            return 1;
        }

        Utility.shouldBeTrue(permits > 0, `Requested permits (${permits}) must be positive`);

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
        this._stableIntervalMicros;


        /**
         * The time when the next request (no matter its size) will be granted. After granting a
         * request, this is pushed further in the future. Large requests push this further than small
         * requests.
         * @type {Number}
         * @private
         */
        this._nextFreeTicketMicros = 0; // could be either in the past or future

    }

    // doSetRate(permitsPerSecond, nowMicros) {
    //     this.resync(nowMicros);
    //     this._stableIntervalMicros = SECONDS.toMicros(1) / permitsPerSecond;
    // }

    queryEarliestAvailable(nowMicros) {
        return this.nextFreeTicketMicros;
    }

    reserveEarliestAvailable(requiredPermits, nowMicros) {
        this.resync(nowMicros);
        let nextFreeTicketMicros = this._nextFreeTicketMicros;

        let returnValue = nextFreeTicketMicros;
        let storedPermitsToSpend = min(requiredPermits, this.storedPermits);
        let freshPermits = requiredPermits - storedPermitsToSpend;

        let waitMicros = storedPermitsToWaitTime(this.storedPermits, storedPermitsToSpend) + (freshPermits * stableIntervalMicros);

        this.nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
        this.storedPermits -= storedPermitsToSpend;

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
            this.storedPermits = min(this._maxPermits, this._storedPermits + (nowMicros - nextFreeTicketMicros) / this.stableIntervalMicros);

            nextFreeTicketMicros = this._nextFreeTicketMicros = nowMicros;
        }

        return nextFreeTicketMicros;
    }

}

export default RateLimiter;
