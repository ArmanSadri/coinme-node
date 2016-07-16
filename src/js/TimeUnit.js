'use strict';

import Utility from "./Utility";
import CoreObject from "./CoreObject";

// Handy constants for conversions
const C0 = 1;
const C1 = C0 * 1000;
const C2 = C1 * 1000;
const C3 = C2 * 1000;
const C4 = C3 * 60;
const C5 = C4 * 60;
const C6 = C5 * 24;

const MAX = Number.MAX_SAFE_INTEGER;
const MIN = Number.MIN_SAFE_INTEGER;

/**
 * Scale value by m, checking for overflow.
 * This has a short name to make above covaluee more reavalueable.
 * @param {Number|String} value
 * @param {Number} m
 * @param {Number} over
 * @return {Number}
 */
function x(value, m, over) {
    value = Utility.toNumberOrFail(value);
    if (value > over) return MAX;
    if (value < -over) return MIN;

    return value * m;
}

//region specs

const SPEC_NANOSECONDS = {

    shortName: 'ns',

    longName: 'nanos',

    toString() {
        return 'NANOSECONDS';
    },
    toNanos(valueInNanos)   {
        return valueInNanos;
    },
    toMicros(valueInNanos)  {
        return valueInNanos / (C1 / C0);
    },
    toMillis(valueInNanos)  {
        return valueInNanos / (C2 / C0);
    },
    toSeconds(valueInNanos) {
        return valueInNanos / (C3 / C0);
    },
    toMinutes(valueInNanos) {
        return valueInNanos / (C4 / C0);
    },
    toHours(valueInNanos)   {
        return valueInNanos / (C5 / C0);
    },
    toDays(valueInNanos)    {
        return valueInNanos / (C6 / C0);
    },
    convert(value, timeUnit) {
        return timeUnit.toNanos(value);
    },
    excessNanos(value, m) {
        return (value - (m * C2));
    }
};

const SPEC_MICROSECONDS = {
    shortName: "\u03bcs", // μs
    longName: 'micros',

    toString() {
        return 'MICROSECONDS';
    },
    toNanos(valueInMicros)   {
        return x(valueInMicros, C1 / C0, MAX / (C1 / C0));
    },
    toMicros(valueInMicros)  {
        return valueInMicros;
    },
    toMillis(valueInMicros)  {
        return valueInMicros / (C2 / C1);
    },
    toSeconds(valueInMicros) {
        return valueInMicros / (C3 / C1);
    },
    toMinutes(valueInMicros) {
        return valueInMicros / (C4 / C1);
    },
    toHours(valueInMicros)   {
        return valueInMicros / (C5 / C1);
    },
    toDays(valueInMicros)    {
        return valueInMicros / (C6 / C1);
    },
    convert(value, timeUnit) {
        return timeUnit.toMicros(value);
    },
    excessNanos(value, m) {
        return ((value * C1) - (m * C2));
    }
};

const SPEC_MILLISECONDS = {
    shortName: "ms", // μs
    longName: 'millis',
    toString() {
        return 'MILLISECONDS';
    },
    toNanos(valueInMillis)   {
        return x(valueInMillis, C2 / C0, MAX / (C2 / C0));
    },
    toMicros(valueInMillis)  {
        return x(valueInMillis, C2 / C1, MAX / (C2 / C1));
    },
    toMillis(valueInMillis)  {
        return valueInMillis;
    },
    toSeconds(valueInMillis) {
        return valueInMillis / (C3 / C2);
    },
    toMinutes(valueInMillis) {
        return valueInMillis / (C4 / C2);
    },
    toHours(valueInMillis)   {
        return valueInMillis / (C5 / C2);
    },
    toDays(valueInMillis)    {
        return valueInMillis / (C6 / C2);
    },
    convert(value, timeUnit) {
        return timeUnit.toMillis(value);
    },
    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_SECONDS = {
    shortName: "s",
    longName: 'seconds',

    toString() {
        return 'SECONDS';
    },

    toNanos(valueInSeconds)   {
        return x(valueInSeconds, C3 / C0, MAX / (C3 / C0));
    },
    toMicros(valueInSeconds)  {
        return x(valueInSeconds, C3 / C1, MAX / (C3 / C1));
    },
    toMillis(valueInSeconds)  {
        return x(valueInSeconds, C3 / C2, MAX / (C3 / C2));
    },
    toSeconds(valueInSeconds) {
        return valueInSeconds;
    },
    toMinutes(valueInSeconds) {
        return valueInSeconds / (C4 / C3);
    },
    toHours(valueInSeconds)   {
        return valueInSeconds / (C5 / C3);
    },
    toDays(valueInSeconds)    {
        return valueInSeconds / (C6 / C3);
    },
    convert(value, timeUnit) {
        return timeUnit.toSeconds(value);
    },
    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_MINUTES = {
    shortName: 'min',
    longName: 'minutes',

    toString() {
        return 'MINUTES';
    },

    toNanos(valueInMinutes)   {
        return x(valueInMinutes, C4 / C0, MAX / (C4 / C0));
    },
    toMicros(valueInMinutes)  {
        return x(valueInMinutes, C4 / C1, MAX / (C4 / C1));
    },
    toMillis(valueInMinutes)  {
        return x(valueInMinutes, C4 / C2, MAX / (C4 / C2));
    },
    toSeconds(valueInMinutes) {
        return x(valueInMinutes, C4 / C3, MAX / (C4 / C3));
    },
    toMinutes(valueInMinutes) {
        return valueInMinutes;
    },
    toHours(valueInMinutes)   {
        return valueInMinutes / (C5 / C4);
    },
    toDays(valueInMinutes)    {
        return valueInMinutes / (C6 / C4);
    },
    convert(value, timeUnit) {
        return timeUnit.toMinutes(value);
    },
    excessNanos(value, m) {
        return 0;
    }
}

const SPEC_HOURS = {
    shortName: "h",
    longName: 'hours',

    toString() {
        return 'HOURS';
    },

    toNanos(valueInHours)   {
        return x(valueInHours, C5 / C0, MAX / (C5 / C0));
    },
    toMicros(valueInHours)  {
        return x(valueInHours, C5 / C1, MAX / (C5 / C1));
    },
    toMillis(valueInHours)  {
        return x(valueInHours, C5 / C2, MAX / (C5 / C2));
    },
    toSeconds(valueInHours) {
        return x(valueInHours, C5 / C3, MAX / (C5 / C3));
    },
    toMinutes(valueInHours) {
        return x(valueInHours, C5 / C4, MAX / (C5 / C4));
    },
    toHours(valueInHours)   {
        return valueInHours;
    },
    toDays(valueInHours)    {
        return valueInHours / (C6 / C5);
    },
    convert(value, timeUnit) {
        return timeUnit.toHours(value);
    },
    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_DAYS = {

    shortName: 'd',

    longName: 'days',

    /**
     *
     * @param {TimeUnit} units
     * @returns {boolean}
     */
    equals: function(units) {
        return units.toString() === this.toString();
    },

    toString() {
        return 'DAYS';
    },

    toNanos(valueInDays)   {
        return x(valueInDays, C6 / C0, MAX / (C6 / C0));
    },

    toMicros(valueInDays)  {
        return x(valueInDays, C6 / C1, MAX / (C6 / C1));
    },

    toMillis(valueInDays)  {
        return x(valueInDays, C6 / C2, MAX / (C6 / C2));
    },

    toSeconds(valueInDays) {
        return x(valueInDays, C6 / C3, MAX / (C6 / C3));
    },

    toMinutes(valueInDays) {
        return x(valueInDays, C6 / C4, MAX / (C6 / C4));
    },

    /**
     * @param {Number} valueInDays
     * @return {Number} hours
     */
    toHours(valueInDays)   {
        return x(valueInDays, C6 / C5, MAX / (C6 / C5));
    },

    toDays(valueInDays)    {
        return valueInDays;
    },
    /**
     *
     * @param {Number} value
     * @param {TimeUnit} timeUnit
     * @returns {Number|*} days
     */
    convert(value, timeUnit) {
        return timeUnit.toDays(value);
    },
    
    excessNanos(value, m) {
        return 0;
    }
};

//endregion

//region TimeUnit
class TimeUnit extends CoreObject {

    //region static TimeUnit enums
    //region NANOSECONDS
    /**
     *
     * @return {TimeUnit}
     */
    static get NANOSECONDS() {
        return new TimeUnit(SPEC_NANOSECONDS);
    }

    //endregion

    //region MICROSECONDS
    /**
     * @return {TimeUnit}
     */
    static get MICROSECONDS() {
        return new TimeUnit(SPEC_MICROSECONDS);
    }

    //endregion

    //region MILLISECONDS
    /**
     * @return {TimeUnit}
     */
    static get MILLISECONDS() {
        return new TimeUnit(SPEC_MILLISECONDS);
    }

    //endregion

    //region SECONDS
    /**
     * @return {TimeUnit}
     */
    static get SECONDS() {
        return new TimeUnit(SPEC_SECONDS);
    }

    //endregion

    //region MINUTES
    /**
     * @return {TimeUnit}
     */
    static get MINUTES() {
        return new TimeUnit(SPEC_MINUTES);
    }

    //endregion

    //region HOURS
    /**
     * @return {TimeUnit}
     */
    static get HOURS() {
        return new TimeUnit(SPEC_HOURS);
    }

    //endregion

    //region DAYS
    /**
     * @return {TimeUnit}
     */
    static get DAYS() {
        return new TimeUnit(SPEC_DAYS);
    }

    //endregion
    //endregion

    /**
     * @protected
     * @param {Object} spec
     */
    constructor(spec) {
        super();

        // if (this.constructor === TimeUnit) {
        //     throw new TypeError('Cannot instantiate TimeUnit directly');
        // }

        this._spec = spec;
    }

    //region public methods

    /**
     *
     * @returns {String}
     */
    get shortName() {
        return this._spec.shortName;
    }

    /**
     *
     * @returns {String}
     */
    get longName() {
        return this._spec.longName;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this._spec.toString();
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toNanos(value) {
        return this._spec.toNanos(value);
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMicros(value) {
        return this._spec.toMicros(value);
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMillis(value) {
        return this._spec.toMillis(value);
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toSeconds(value) {
        return this._spec.toSeconds(value);
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMinutes(value) {
        return this._spec.toMinutes(value);
    }

    /**
     * @returns {Number}
     */
    toHours(value) {
        return this._spec.toHours(value);
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toDays(value) {
        return this._spec.toDays(value);
    }

    /**
     * Converts from SOURCE value/units into DESTINATION (this) units.
     *
     * @param {Number} value The SOURCE value
     * @param {TimeUnit} timeUnit  The SOURCE timeUnit
     * @returns {Number} The destination value/units
     */
    convert(value, timeUnit) {
        return this._spec.convert(value, timeUnit);
    }

    /**
     * 
     * @param {TimeUnit} timeUnit
     * @returns {boolean}
     */
    equals(timeUnit) {
        if (!timeUnit) {
            return false;
        }

        return timeUnit.toString() === this.toString();
    }

    //endregion
}
//endregion

export {TimeUnit};
export default TimeUnit;