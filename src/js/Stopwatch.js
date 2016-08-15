'use strict';

import Utility from "./Utility";
import TimeUnit from "./TimeUnit";
import CoreObject from './CoreObject';
import Logger from "winston";
import Preconditions from "./Preconditions";
import Ticker from './Ticker';
import NanoTimer from 'nanotimer';

const MILLISECONDS = TimeUnit.MILLISECONDS;
const MICROSECONDS = TimeUnit.MICROSECONDS;
const NANOSECONDS = TimeUnit.NANOSECONDS;

/**
 *
 * @type {Ticker}
 */
let SYSTEM_TICKER = Ticker.systemTicker();

class Stopwatch extends CoreObject {

    /**
     *
     * @param {Object} [options]
     * @param {Ticker} [options.ticker]
     * @param {boolean} [options.start]
     */
    constructor(options) {
        let shouldStart = Utility.take(options, 'start', {
            defaultValue: true
        });

        let ticker = Utility.take(options, 'ticker') || SYSTEM_TICKER;

        super(...arguments);

        // options = options || {};

        this._ticker = ticker;

        /**
         * @type {Number} nanoseconds
         * @private
         */
        this._startTick = this.ticker.read();

        if (shouldStart) {
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
    get running() {
        return this._running;
    }

    get finalized() {
        return this._finalized;
    }

    /**
     * Starts the stopwatch.
     *
     * @return {Stopwatch}
     */
    start() {
        Preconditions.shouldBeFalsey(this.running, "This stopwatch is already running.");
        Preconditions.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");

        this.reset();

        this._running = true;
        this._startTick = this.ticker.read();

        return this;
    }

    /**
     * Stops the stopwatch. Future reads will return the fixed duration that had
     * elapsed up to this point.
     *
     * @param {Object} [options]
     * @param {Boolean} [options.finalize]
     * @return {Stopwatch} instance
     * @throws IllegalStateException if the stopwatch is already stopped.
     */
    stop(options) {
        Preconditions.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");
        Preconditions.shouldBeTrue(this.running, "This stopwatch is already stopped.");

        this._running = false;
        this._elapsedNanos += this.ticker.read() - this._startTick;
        this._finalized = Utility.take(options, 'finalized', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });

        return this;
    }

    /**
     * Sets the elapsed time for this stopwatch to zero,
     * and places it in a stopped state.
     *
     * @return {Stopwatch} instance
     */
    reset() {
        Preconditions.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");

        if (this.running) {
            this.stop();
        }

        this._elapsedNanos = 0;
        this._startTick = null;
        this._running = false;

        return this;
    }

    /**
     * @returns {Number}
     */
    elapsedNanos() {
        return this.running ? this.ticker.read() - this._startTick + this._elapsedNanos : this._elapsedNanos;
    }

    elapsedMillis() {
        return this.elapsed(MILLISECONDS);
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
            timeUnit = MILLISECONDS;
        }

        return timeUnit.convert(this.elapsedNanos(), timeUnit);
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