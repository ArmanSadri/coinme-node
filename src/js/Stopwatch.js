'use strict';

import Utility from "./Utility";
import TimeUnit from "./TimeUnit";
import CoreObject from './CoreObject';

const MICROSECONDS = TimeUnit.MICROSECONDS;
const NANOSECONDS = TimeUnit.NANOSECONDS;

/**
 *
 * @type {Ticker}
 */
var SYSTEM_TICKER = null;

class Ticker {

    /**
     * Constructor for use by subclasses.
     */
    constructor(options) {

    }

    /**
     * Returns the number of nanoseconds elapsed since this ticker's fixed
     * point of reference.
     */
    read() {
        let time = process.hrtime();
        let timeInSeconds = time[0];
        let timeInNanos = time[1];

        return TimeUnit.SECONDS.toNanos(timeInSeconds) + timeInNanos;
    }

    /**
     * A ticker that reads the current time using {@link System#nanoTime}.
     *
     * @return {Ticker}
     */
    static systemTicker() {
        return SYSTEM_TICKER;
    }
}

SYSTEM_TICKER = new Ticker();

class Stopwatch extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {Ticker} [options.ticker]
     * @param {boolean} [options.start]
     */
    constructor(options) {
        super();

        this._ticker = Utility.take(options, 'ticker') || SYSTEM_TICKER;
        this._isRunning = Utility.take(options, 'start');
        this._elapsedNanos;
        this._startTick;

        if (this.isRunning) {
            this.start();
        }
    }

    /**
     *
     * @returns {Number}
     */
    get startTick() {
        return this._startTick;
    }

    /**
     * @returns {Ticker}
     */
    get ticker() {
        return this._ticker;
    }

    /**
     * Returns {@code true} if {@link #start()} has been called on this stopwatch,
     * and {@link #stop()} has not been called since the last call to {@code
     * start()}.
     */
    get isRunning() {
        return this._isRunning;
    }

    /**
     * Starts the stopwatch.
     *
     * @return {Stopwatch}
     */
    start() {
        Utility.shouldBeFalsey(this.isRunning, "This stopwatch is already running.");

        this._isRunning = true;
        this._startTick = this.ticker.read();

        return this;
    }

    /**
     * Stops the stopwatch. Future reads will return the fixed duration that had
     * elapsed up to this point.
     *
     * @return {Stopwatch} instance
     * @throws IllegalStateException if the stopwatch is already stopped.
     */
    stop() {
        Utility.shouldBeTrue(this.isRunning, "This stopwatch is already stopped.");

        this._isRunning = false;
        this._elapsedNanos += this.ticker.read() - this._startTick;

        return this;
    }

    /**
     * Sets the elapsed time for this stopwatch to zero,
     * and places it in a stopped state.
     *
     * @return {Stopwatch} instance
     */
    reset() {
        this._elapsedNanos = 0;
        this._isRunning = false;

        return this;
    }

    /**
     * @returns {Number}
     */
    elapsedNanos() {
        return this.isRunning ? this.ticker.read() - this._startTick + this.elapsedNanos : this.elapsedNanos;
    }

    /**
     * @returns {Number}
     */
    elapsedMicros() {
        return this.elapsed(MICROSECONDS);
    }

    /**
     * Returns the current elapsed time shown on this stopwatch, expressed
     * in the desired time unit, with any fraction rounded down.
     *
     * <p>Note that the overhead of measurement can be more than a microsecond, so
     * it is generally not useful to specify {@link TimeUnit#NANOSECONDS}
     * precision here.
     *
     * @param {TimeUnit} [timeUnit]
     * @return {Number}
     */
    elapsed(timeUnit) {
        if (!timeUnit) {
            timeUnit = NANOSECONDS;
        }

        return timeUnit.convert(this.elapsedNanos(), TimeUnit.NANOSECONDS);
    }

    /**
     * Returns a string representation of the current elapsed time.
     */
    toString() {
        let nanos = this.elapsedNanos();
        let unit = this.chooseUnit(nanos);

        let value = nanos / TimeUnit.NANOSECONDS.convert(1, unit);

        // Too bad this functionality is not exposed as a regular method call
        return `${value} ${unit.shortName}`;
    }

    /**
     * @private
     * @param {Number} nanos
     * @return {TimeUnit}
     */
    static chooseUnit(nanos) {
        if (TimeUnit.DAYS.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.DAYS;
        }

        if (TimeUnit.HOURS.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.HOURS;
        }

        if (TimeUnit.MINUTES.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.MINUTES;
        }

        if (TimeUnit.SECONDS.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.SECONDS;
        }

        if (TimeUnit.MILLISECONDS.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.MILLISECONDS;
        }

        if (TimeUnit.MICROSECONDS.convert(nanos, TimeUnit.NANOSECONDS) > 0) {
            return TimeUnit.MICROSECONDS;
        }

        return TimeUnit.NANOSECONDS;
    }
}

export {Ticker};
export {Stopwatch};
export default Stopwatch;