'use strict';

import TimeUnit from "./TimeUnit";

/**
 *
 * @type {Ticker}
 */
var SYSTEM_TICKER;

class Ticker {

    /**
     * Constructor for use by subclasses.
     */
    constructor(options) {

    }

    /**
     * Returns the number of nanoseconds elapsed since this ticker's fixed
     * point of reference.
     *
     * @return {Number} nanoseconds
     */
    read() {
        let time = process.hrtime();
        let timeInSeconds = time[0];
        let timeInNanos = time[1];

        return TimeUnit.SECONDS.toNanos(timeInSeconds) + timeInNanos;
    }

    /**
     * A ticker that reads the current time using nanoseconds.
     *
     * @return {Ticker}
     */
    static systemTicker() {
        return SYSTEM_TICKER;
    }
}

SYSTEM_TICKER = new Ticker();

export {Ticker};
export default Ticker;