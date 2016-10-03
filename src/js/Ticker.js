'use strict';

import TimeUnit from "./TimeUnit";
import Promise from 'bluebird';
import NanoTimer from 'nanotimer';

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
        this._timer = new NanoTimer();
    }

    /**
     *
     * @return {NanoTimer}
     */
    get timer() {
        return this._timer;
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
     * Returns a promise that will finish in the given time.
     *
     * @param {Number} value
     * @param {TimeUnit} timeUnit
     * @return {Promise}
     */
    wait(value, timeUnit) {
        let scope = this;

        console.log(`Ticker.wait(${value}, ${timeUnit})`);

        return new Promise((resolve, reject) => {
            let numberOfNanos = TimeUnit.NANOSECONDS.convert(value, timeUnit);

            //.setTimeout(task, args, timeout, [callback])
            scope.timer.setTimeout(function() {
                resolve();
            }, null, numberOfNanos + 'n');
        });
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