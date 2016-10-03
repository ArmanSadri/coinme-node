import Preconditions from "./Preconditions";
import TimeUnit from "./TimeUnit";
import Utility from "./Utility";
import CoreObject from "./CoreObject";
import Stopwatch from "./Stopwatch";
import Errors from "./errors/Errors";
import Coinme from "./Coinme";
import Lodash from "lodash";
import math from 'mathjs';

//region class: RateLimiter
class RateLimiter extends CoreObject {

    /** @type {Rate} */
    _rate;

    /** @type {Number} */
    _permitsPerSecond;

    /** @type {Stopwatch} */
    _stopwatch;

    /**
     * @param {Object} options
     * @param {Number} [options.stopwatch]
     * @param {Number|TimeUnit|Rate|Object} [options.rate]
     */
    constructor(options) {
        /** @type {Stopwatch} */
        let stopwatch = Utility.take(options, 'stopwatch', {
            defaultValue: new Stopwatch({start: true}),
            type: Stopwatch
        });

        /** @type {Rate} */
        let rate = Utility.take(options, 'rate', {
            defaultValue: Rate.defaultRate,
            adapter: Rate.getRate
        });

        super(options);

        // /**
        //  * @type {String}
        //  * @private
        //  */
        // this._failAction = Utility.take(options, 'failAction', {
        //         type: 'string',
        //         required: false,
        //         defaultValue: 'wait'
        //     });

        this._rate = rate;
        this._stopwatch = stopwatch;
        this._permitsPerSecond = math.divide(1, rate.toSeconds().value);

        this.doSetRate(this._permitsPerSecond, this.stopwatch.elapsedMicros());
    }

    /**
     *
     * @param {Number} [nowMicros]
     */
    debug(nowMicros) {
        nowMicros = nowMicros || this.stopwatch.elapsedMicros();

        console.log(`${this.toClass()}.debug() ${JSON.stringify(this.toState(nowMicros))}`);
    }

    // for debugging
    toState(nowMicros) {
        return {
            nowMicros: nowMicros,
            _permitsPerSecond: this._permitsPerSecond,
        }
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

    //region property: {Rate} rate
    /**
     * @return {Rate}
     */
    get rate() {
        return this._rate;
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
        // GUAVA CODE:
        //
        // final long reserveAndGetWaitLength(int permits, long nowMicros) {
        //     long momentAvailable = reserveEarliestAvailable(permits, nowMicros);
        //     return max(momentAvailable - nowMicros, 0);
        // }
        let momentAvailable = this.reserveEarliestAvailable(permits, nowMicros);
        return Math.max(momentAvailable - nowMicros, 0);
    }

    /**
     * @private
     * @param {Number} nowMicros
     * @param {Number} timeoutMicros
     * @returns {boolean}
     */
    canAcquire(nowMicros, timeoutMicros) {
        // GUAVA CODE:
        //
        // private boolean canAcquire(long nowMicros, long timeoutMicros) {
        //     return queryEarliestAvailable(nowMicros) - timeoutMicros <= nowMicros;
        // }
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
        // GUAVA CODE
        //
        // public boolean tryAcquire(int permits, long timeout, TimeUnit unit) {
        //     long timeoutMicros = max(unit.toMicros(timeout), 0);
        //     checkPermits(permits);
        //     long microsToWait;
        //     synchronized (mutex()) {
        //         long nowMicros = stopwatch.readMicros();
        //         if (!canAcquire(nowMicros, timeoutMicros)) {
        //             return false;
        //         } else {
        //             microsToWait = reserveAndGetWaitLength(permits, nowMicros);
        //         }
        //     }
        //     stopwatch.sleepMicrosUninterruptibly(microsToWait);
        //     return true;
        // }

        permits = RateLimiter.checkPermits(permits);
        timeout = Utility.defaultNumber(timeout, 30);
        unit = Utility.defaultObject(unit, TimeUnit.SECONDS);

        let microsToWait;
        let timeoutMicros = Math.max(unit.toMicros(timeout), 0);
        let permitsPerSecond = Preconditions.shouldBeNumber(this._permitsPerSecond, 'Rate must be defined.');
        let nowMicros = this.stopwatch.elapsedMicros();
        let goalMicros = this.queryEarliestAvailable(nowMicros);
        let ticker = Preconditions.shouldBeExisting(this.ticker, 'ticker');

        // console.log(`(timeout:${timeout})(timeoutMicros:${timeoutMicros})(goalMicros:${goalMicros})(nowMicros:${nowMicros})(diff:${goalMicros - nowMicros}`);

        if (!this.canAcquire(nowMicros, timeoutMicros)) {
            console.log(`!this.canAcquire(${nowMicros}, ${timeoutMicros})`);
            return Promise.reject(new Error(`RateLimit exceeded: (rate:${permitsPerSecond}/sec) (timeoutMicros:${timeoutMicros}) (goalMicros: ${goalMicros}) (differenceMicros:${goalMicros - nowMicros})`));
        } else {
            microsToWait = this.reserveAndGetWaitLength(permits, nowMicros);
            console.log(`${microsToWait} = this.reserveAndGetWaitLength(${permits}, ${nowMicros});`);
        }

        return ticker.wait(microsToWait, TimeUnit.MICROSECONDS);
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
//endregion RateLimiter

//region abstract class: SmoothRateLimiter
class SmoothRateLimiter extends RateLimiter {

    /**
     *
     * @param options
     */
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
     * @param {Number} nowMicros
     */
    toState(nowMicros) {
        return Lodash.assign({}, super.toState(nowMicros), {
            _nextFreeTicketMicros: this._nextFreeTicketMicros,
            _stableIntervalMicros: this._stableIntervalMicros,
            _maxPermits: this._maxPermits,
            _storedPermits: this._storedPermits
        });
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
        // GUAVA CODE:

        // @Override
        // final long queryEarliestAvailable(long nowMicros) {
        //     return nextFreeTicketMicros;
        // }
        // console.log(`_nextFreeTicketMicros=${this._nextFreeTicketMicros}`);
        return Preconditions.shouldBeNumber(this._nextFreeTicketMicros);
    }

    reserveEarliestAvailable(requiredPermits, nowMicros) {
        // GUAVA CODE
        //
        // @Override
        // final long reserveEarliestAvailable(int requiredPermits, long nowMicros) {
        //     resync(nowMicros);
        //     long returnValue = nextFreeTicketMicros;
        //     double storedPermitsToSpend = min(requiredPermits, this.storedPermits);
        //     double freshPermits = requiredPermits - storedPermitsToSpend;
        //
        //     long waitMicros = storedPermitsToWaitTime(this.storedPermits, storedPermitsToSpend)
        //         + (long) (freshPermits * stableIntervalMicros);
        //
        //     this.nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
        //     this.storedPermits -= storedPermitsToSpend;
        //     return returnValue;
        // }
        this.resync(nowMicros);
        let nextFreeTicketMicros = this._nextFreeTicketMicros;

        let returnValue = nextFreeTicketMicros;
        let storedPermitsToSpend = Math.min(requiredPermits, this._storedPermits);
        let freshPermits = requiredPermits - storedPermitsToSpend;

        let waitMicros = this.storedPermitsToWaitTime(this._storedPermits, storedPermitsToSpend) + (freshPermits * this._stableIntervalMicros);

        this._nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
        this._storedPermits -= storedPermitsToSpend;

        this.debug(nowMicros);
        console.log(`(returnValue:${returnValue}) = reserveEarliestAvailable(requiredPermits=${requiredPermits}, nowMicros=${nowMicros})  ---- (storedPermits:${this._storedPermits})(nextFreeTicketMicros:${this._nextFreeTicketMicros})(waitMicros:${waitMicros})`);

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
     */
    resync(nowMicros) {
        // GUAVA CODE
        //
        // private void resync(long nowMicros) {
        //     // if nextFreeTicket is in the past, resync to now
        //     if (nowMicros > nextFreeTicketMicros) {
        //         storedPermits = min(maxPermits,
        //             storedPermits + (nowMicros - nextFreeTicketMicros) / stableIntervalMicros);
        //         nextFreeTicketMicros = nowMicros;
        //     }
        // }
        Preconditions.shouldBeNumber(nowMicros, `nowMicros: ${nowMicros}`);

        // if nextFreeTicket is in the past, resync to now
        let nextFreeTicketMicros = this._nextFreeTicketMicros;

        if (nowMicros > nextFreeTicketMicros) {
            this._storedPermits = Math.min(this._maxPermits, this._storedPermits + (nowMicros - nextFreeTicketMicros) / this._stableIntervalMicros);
            this._nextFreeTicketMicros = nowMicros;
        }

        console.log(`resync(nowMicros=${nowMicros}) -> (storedPermits:${this._storedPermits})(nextFreeTicketMicros:${this._nextFreeTicketMicros})(maxPermits:${this._maxPermits})`);
    }
}
//endregion SmoothRateLimiter

//region class: SmoothBurstyRateLimiter
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

    toState(nowMicros) {
        return Lodash.assign({}, super.toState(nowMicros), {
            maxBurstSeconds: this.maxBurstSeconds
        });
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
//endregion SmoothBursty

//region class: SmoothWarmingUpRateLimiter
class SmoothWarmingUpRateLimiter extends SmoothRateLimiter {

    /**
     * @type {Rate}
     */
    _warmupRate = 0;
    _warmupPeriodMicros = 0;

    /**
     * The slope of the line from the stable interval (when permits == 0), to the cold interval
     * (when permits == maxPermits)
     *
     * @type {Number}
     */
    _slope = 0;

    /** @type {Number} */
    _halfPermits = 0;

    /**
     *
     * @param {Object} options
     * @param {Rate} [options.warmupRate] defaults to 1 second
     */
    constructor(options) {
        /** @type {Rate} */
        let warmupRate = Utility.take(options, 'warmupRate', {
            required: true,
            adapter: Rate.getRate
        });

        super(...arguments);

        this._warmupRate = warmupRate;
        // we need to cache it (cpu performance)
        this._warmupPeriodMicros = warmupRate.toMicros().value;
    }

    toState(nowMicros) {
        return Lodash.assign({}, super.toState(nowMicros), {
            _slope: this._slope,
            _warmupRate: this._warmupRate,
            _warmupPeriodMicros: this._warmupPeriodMicros,
            _halfPermits: this._halfPermits
        });
    }

    //region property: warmupRate
    /**
     * @property
     * @return {Rate}
     */
    get warmupRate() {
        return this._warmupRate;
    }
    //endregion

    /**
     * @protected
     * @param permitsPerSecond
     * @param stableIntervalMicros
     */
    doSetRate2(permitsPerSecond, stableIntervalMicros) {
        let oldMaxPermits = this._maxPermits;
        this._maxPermits = this._warmupPeriodMicros / stableIntervalMicros;
        this._halfPermits = this._maxPermits / 2.0;

        // Stable interval is x, cold is 3x, so on average it's 2x. Double the time -> halve the rate
        let coldIntervalMicros = stableIntervalMicros * 3.0;
        this._slope = (coldIntervalMicros - stableIntervalMicros) / this._halfPermits;

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
        let availablePermitsAboveHalf = storedPermits - this._halfPermits;
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
//endregion

//region class: Rate
class Rate extends CoreObject {

    /** @type {TimeUnit} */
    static DEFAULT_RATE_TIME_UNIT = TimeUnit.SECONDS;

    /** @type {Number} */
    static DEFAULT_RATE_VALUE = 1;

    /** @type {Rate} */
    static DEFAULT_RATE_INSTANCE = new Rate({value: 1, timeUnit: TimeUnit.SECONDS});

    /** @type {Number} */
    _value = Rate.DEFAULT_RATE_VALUE;

    /** @type {TimeUnit} */
    _timeUnit = Rate.DEFAULT_RATE_TIME_UNIT;

    /**
     *
     * @param {Object} options
     * @param {Number} options.value
     * @param {TimeUnit} options.timeUnit
     */
    constructor(options) {
        let value = Utility.take(options, 'value', 'number');
        let timeUnit = Utility.take(options, 'timeUnit', TimeUnit);

        super(options);

        this._value = value;
        this._timeUnit = timeUnit;
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return `${this.value} ${this.timeUnit}`;
    }

    toJson(options) {
        return super.toJson({
            value: this._value,
            timeUnit: this._timeUnit
        })
    }

    //region property: {Number} value
    /**
     * @return {Number}
     */
    get value() {
        return this._value;
    }

    //endregion

    //region property: {TimeUnit} timeUnit
    /**
     * @return {TimeUnit}
     */
    get timeUnit() {
        return this._timeUnit;
    }

    //endregion

    //region methods: toSeconds,toTimeUnit,...
    /**
     * @return {Rate}
     */
    toSeconds() {
        return this.toTimeUnit(TimeUnit.SECONDS);
    }

    /**
     * @return {Rate}
     */
    toMillis() {
        return this.toTimeUnit(TimeUnit.MILLISECONDS);
    }

    /**
     * @return {Rate}
     */
    toMicros() {
        return this.toTimeUnit(TimeUnit.MICROSECONDS);
    }

    /**
     * @return {Rate}
     */
    toNanos() {
        return this.toTimeUnit(TimeUnit.NANOSECONDS);
    }

    /**
     * @return {Rate}
     */
    toMinutes() {
        return this.toTimeUnit(TimeUnit.MINUTES);
    }

    /**
     * @return {Rate}
     */
    toHours() {
        return this.toTimeUnit(TimeUnit.HOURS);
    }

    /**
     * @return {Rate}
     */
    toDays() {
        return this.toTimeUnit(TimeUnit.DAYS);
    }

    /**
     * Convert into the given timeUnit
     *
     * @param {TimeUnit} timeUnit
     * @return {Rate}
     */
    toTimeUnit(timeUnit) {
        TimeUnit.shouldBeInstance(timeUnit, "Must be timeUnit instance");

        if (this.timeUnit.equals(timeUnit)) {
            return this;
        }

        return Rate.getRate({
            value: timeUnit.convert(this.value, this.timeUnit),
            timeUnit
        });
    }

    //endregion

    //region statics

    /**
     * @return {Rate}
     */
    static get defaultRate() {
        return Rate.getRate();
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perSeconds(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.SECONDS);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perNanos(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.NANOSECONDS);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perMicros(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.MICROSECONDS);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perMillis(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.MILLISECONDS);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perHours(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.HOURS);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perMinutes(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.MINUTES);
    }

    /**
     * @param {Number} value
     * @return {Rate}
     */
    static perDays(value) {
        Preconditions.shouldBeNumber(value, 'value must be number');

        return Rate.getRate(value, TimeUnit.DAYS);
    }

    /**
     * Rate.getRate();  - timeUnit is defaulted to {@see Rate.DEFAULT_RATE_TIME_UNIT}, value is defaulted to {@see Rate.DEFAULT_RATE_VALUE}
     * Rate.getRate(1); - timeUnit is defaulted to {@see Rate.DEFAULT_RATE_TIME_UNIT}
     * Rate.getRate(1, TimeUnit.SECONDS);
     * Rate.getRate({ value: 1 }); - timeUnit is defaulted to {@see Rate.DEFAULT_RATE_TIME_UNIT}
     * Rate.getRate({ value: 1, timeUnit: TimeUnit.SECONDS });
     * Rate.getRate(undefined, TimeUnit.SECONDS);
     * Rate.getRate(new Rate(...)); -- just returns the same value, unmodified.
     *
     * @param {{value:Number,timeUnit:TimeUnit}|Number|Rate|TimeUnit} [objectOrRateOrNumberOrTimeUnit]
     * @param {TimeUnit} [optionalDefaultTimeUnit]
     */
    static getRate(objectOrRateOrNumberOrTimeUnit, optionalDefaultTimeUnit) {
        Preconditions.shouldBeTrue(TimeUnit.isInstance(TimeUnit.SECONDS)); // double check assumption.

        if (Rate.isInstance(objectOrRateOrNumberOrTimeUnit)) {
            return objectOrRateOrNumberOrTimeUnit;
        } else if (Utility.isUndefined(objectOrRateOrNumberOrTimeUnit)) {
            return Rate.DEFAULT_RATE_INSTANCE;
        }

        /** @type {Number} */
        let defaultValue = Rate.DEFAULT_RATE_VALUE || 0;
        /** @type {TimeUnit} */
        let defaultTimeUnit = Utility.defaultValue(optionalDefaultTimeUnit, Rate.DEFAULT_RATE_TIME_UNIT, TimeUnit.SECONDS);

        /** @type {Number} */
        let value = defaultValue;
        /** @type {TimeUnit} */
        let timeUnit = defaultTimeUnit;

        if (TimeUnit.isInstance(objectOrRateOrNumberOrTimeUnit)) {
            timeUnit = objectOrRateOrNumberOrTimeUnit;
        } else if (Utility.isNumber(objectOrRateOrNumberOrTimeUnit) || Utility.isNumeric(objectOrRateOrNumberOrTimeUnit)) {
            value = Utility.toNumberOrFail(objectOrRateOrNumberOrTimeUnit);
        } else if (Utility.isInstance(objectOrRateOrNumberOrTimeUnit) || Utility.isObject(objectOrRateOrNumberOrTimeUnit)) {
            value = Coinme.get(objectOrRateOrNumberOrTimeUnit, 'value'); // optional
            timeUnit = Coinme.get(objectOrRateOrNumberOrTimeUnit, 'timeUnit'); // optional
        } else {
            return Errors.throwNotSure(objectOrRateOrNumberOrTimeUnit);
        }

        value = Utility.defaultNumber(value, defaultValue);
        timeUnit = Utility.defaultValue(timeUnit, defaultTimeUnit);

        return new Rate({
            value,
            timeUnit
        });
    }

    //endregion

}
//endregion

export {Rate}
export {RateLimiter};
export {SmoothRateLimiter};
export {SmoothBurstyRateLimiter};
export {SmoothWarmingUpRateLimiter};
export default SmoothRateLimiter;
