'use strict';

import Utility from "./Utility";
import CoreObject from "./CoreObject";

import {ChronoUnit} from 'js-joda/dist/js-joda'
import {Duration} from 'js-joda/dist/js-joda'
import Preconditions from "./Preconditions";
import math from 'mathjs';

Preconditions.shouldBeDefined(ChronoUnit);
Preconditions.shouldBeDefined(Duration);

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

    /**
     * @type {ChronoUnit}
     */
    unit: ChronoUnit.NANOS,

    shortName: 'ns',

    longName: 'nanos',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    toNanos(valueInNanos)   {
        return valueInNanos;
    },

    fromNanos(valueInNanos) {
        return valueInNanos;
    },

    toMicros(valueInNanos)  {
        return math.chain(valueInNanos)
            .divide(
                math.divide(C1, C0)
            )
            .done();
        // return valueInNanos / (C1 / C0);
    },

    toMillis(valueInNanos)  {
        return math.divide(valueInNanos, (math.divide(C2, C0)));
        // return valueInNanos / (C2 / C0);
    },

    toSeconds(valueInNanos) {
        return math.divide(valueInNanos, (math.divide(C3, C0)));
        // return valueInNanos / (C3 / C0);
    },

    toMinutes(valueInNanos) {
        return math.divide(valueInNanos, (math.divide(C4, C0)));
        // return valueInNanos / (C4 / C0);
    },

    toHours(valueInNanos)   {
        return math.divide(valueInNanos, (math.divide(C5, C0)));
        // return valueInNanos / (C5 / C0);
    },

    toDays(valueInNanos)    {
        return math.divide(valueInNanos, (math.divide(C6, C0)));
        // return valueInNanos / (C6 / C0);
    },

    convert(value, timeUnit) {
        return timeUnit.toNanos(value);
    },

    excessNanos(value, m) {
        return (value - (m * C2));
    }
};

const SPEC_MICROSECONDS = {

    unit: ChronoUnit.MICROS,

    shortName: "\u03bcs", // μs

    longName: 'micros',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMicros(valueInNanos);
    },

    toNanos(valueInMicros)   {
        return x(valueInMicros, math.divide(C1, C0), math.divide(MAX, math.divide(C1, C0)));
        // return x(valueInMicros, C1 / C0, MAX / (C1 / C0));
    },

    // toMicros(valueInMicros)  {
    //     return valueInMicros;
    // },
    // toMillis(valueInMicros)  {
    //     return valueInMicros / (C2 / C1);
    // },
    // toSeconds(valueInMicros) {
    //     return valueInMicros / (C3 / C1);
    // },
    // toMinutes(valueInMicros) {
    //     return valueInMicros / (C4 / C1);
    // },
    // toHours(valueInMicros)   {
    //     return valueInMicros / (C5 / C1);
    // },
    // toDays(valueInMicros)    {
    //     return valueInMicros / (C6 / C1);
    // },
    // convert(value, timeUnit) {
    //     return timeUnit.toMicros(value);
    // },
    excessNanos(value, m) {
        return ((value * C1) - (m * C2));
    }
};

const SPEC_MILLISECONDS = {

    unit: ChronoUnit.MILLIS,

    shortName: "ms", // μs

    longName: 'millis',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMillis(valueInNanos);
    },

    toNanos(valueInMillis)   {
        return x(valueInMillis, math.divide(C2, C0), math.divide(MAX, math.divide(C2, C0)));
        // return x(valueInMillis, C2 / C0, MAX / (C2 / C0));
    },

    // toMicros(valueInMillis)  {
    //     return x(valueInMillis, C2 / C1, MAX / (C2 / C1));
    // },
    // toMillis(valueInMillis)  {
    //     return valueInMillis;
    // },
    // toSeconds(valueInMillis) {
    //     return valueInMillis / (C3 / C2);
    // },
    // toMinutes(valueInMillis) {
    //     return valueInMillis / (C4 / C2);
    // },
    // toHours(valueInMillis)   {
    //     return valueInMillis / (C5 / C2);
    // },
    // toDays(valueInMillis)    {
    //     return valueInMillis / (C6 / C2);
    // },
    // convert(value, timeUnit) {
    //     return timeUnit.toMillis(value);
    // },

    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_SECONDS = {

    unit: ChronoUnit.SECONDS,

    shortName: "s",

    longName: 'seconds',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toSeconds(valueInNanos);
    },

    toNanos(valueInSeconds)   {
        return x(valueInSeconds, math.divide(C3, C0), math.divide(MAX, math.divide(C3 / C0)));
        // return x(valueInSeconds, C3 / C0, MAX / (C3 / C0));
    },

    // toMicros(valueInSeconds)  {
    //     return x(valueInSeconds, C3 / C1, MAX / (C3 / C1));
    // },
    // toMillis(valueInSeconds)  {
    //     return x(valueInSeconds, C3 / C2, MAX / (C3 / C2));
    // },
    // toSeconds(valueInSeconds) {
    //     return valueInSeconds;
    // },
    // toMinutes(valueInSeconds) {
    //     return valueInSeconds / (C4 / C3);
    // },
    // toHours(valueInSeconds)   {
    //     return valueInSeconds / (C5 / C3);
    // },
    // toDays(valueInSeconds)    {
    //     return valueInSeconds / (C6 / C3);
    // },
    // convert(value, timeUnit) {
    //     return timeUnit.toSeconds(value);
    // },

    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_MINUTES = {

    unit: ChronoUnit.MINUTES,

    shortName: 'min',

    longName: 'minutes',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMinutes(valueInNanos);
    },

    toNanos(valueInMinutes)   {
        return x(valueInMinutes, math.divide(C4, C0), math.divide(MAX, math.divide(C4 / C0)));
        // return x(valueInMinutes, C4 / C0, MAX / (C4 / C0));
    },

    // toMicros(valueInMinutes)  {
    //     return x(valueInMinutes, C4 / C1, MAX / (C4 / C1));
    // },
    // toMillis(valueInMinutes)  {
    //     return x(valueInMinutes, C4 / C2, MAX / (C4 / C2));
    // },
    // toSeconds(valueInMinutes) {
    //     return x(valueInMinutes, C4 / C3, MAX / (C4 / C3));
    // },
    // toMinutes(valueInMinutes) {
    //     return valueInMinutes;
    // },
    // toHours(valueInMinutes)   {
    //     return valueInMinutes / (C5 / C4);
    // },
    // toDays(valueInMinutes)    {
    //     return valueInMinutes / (C6 / C4);
    // },
    // convert(value, timeUnit) {
    //     return timeUnit.toMinutes(value);
    // },

    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_HOURS = {

    shortName: "h",

    longName: 'hours',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },

    fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toHours(valueInNanos);
    },

    toNanos(valueInHours)   {
        return x(valueInHours, C5 / C0, MAX / (C5 / C0));
    },

    // toMicros(valueInHours)  {
    //     return x(valueInHours, C5 / C1, MAX / (C5 / C1));
    // },
    //
    // toMillis(valueInHours)  {
    //     return x(valueInHours, C5 / C2, MAX / (C5 / C2));
    // },
    //
    // toSeconds(valueInHours) {
    //     return x(valueInHours, C5 / C3, MAX / (C5 / C3));
    // },
    //
    // toMinutes(valueInHours) {
    //     return x(valueInHours, C5 / C4, MAX / (C5 / C4));
    // },
    //
    // toHours(valueInHours)   {
    //     return valueInHours;
    // },
    //
    // toDays(valueInHours)    {
    //     return valueInHours / (C6 / C5);
    // },

    // convert(value, timeUnit) {
    //     return timeUnit.toHours(value);
    // },

    excessNanos(value, m) {
        return 0;
    }
};

const SPEC_DAYS = {

    unit: ChronoUnit.DAYS,

    shortName: 'd',

    longName: 'days',

    toNanos(valueInDays)   {
        return x(valueInDays, C6 / C0, MAX / (C6 / C0));
    },

    fromNanos(valueInNanos) {
        // TimeUnit.NANOS.toDays(valueInNanos)
        return SPEC_NANOSECONDS.toDays(valueInNanos);
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

    //region static TimeUnits
    /**
     * @return {TimeUnit}
     */
    static NANOSECONDS = new TimeUnit(SPEC_NANOSECONDS);

    /**
     * @return {TimeUnit}
     */
    static MICROSECONDS = new TimeUnit(SPEC_MICROSECONDS);

    /**
     * @return {TimeUnit}
     */
    static MILLISECONDS = new TimeUnit(SPEC_MILLISECONDS);

    /**
     * @return {TimeUnit}
     */
    static SECONDS = new TimeUnit(SPEC_SECONDS);

    /**
     * @return {TimeUnit}
     */
    static MINUTES = new TimeUnit(SPEC_MINUTES);

    /**
     * @return {TimeUnit}
     */
    static HOURS = new TimeUnit(SPEC_HOURS);

    /**
     * @return {TimeUnit}
     */
    static DAYS = new TimeUnit(SPEC_DAYS);
    //endregion

    /**
     * @protected
     * @param {Object} spec
     */
    constructor(spec) {
        super();

        /**
         * @type {{unit: ChronoUnit, toString:function, equals:function, excessNanos:function, shortName:String, longName:String, toNumber:function}}
         * @private
         */
        this.spec = spec;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.spec.shortName;
    }

    valueOf() {
        return this.toString();
    }

    //region public methods
    /**
     *
     * @returns {String}
     */
    get shortName() {
        return this.spec.shortName;
    }

    /**
     *
     * @returns {String}
     */
    get longName() {
        return this.spec.longName;
    }

    /**
     * @return {ChronoUnit}
     */
    toChronoUnit() {
        return this.spec.unit;
    }

    /**
     *
     * @param {Number} value - (the units of this number are assumed to be 'this.unit')
     * @returns {Duration}
     */
    toDuration(value) {
        value = Utility.toNumberOrFail(value, 'TimeUnit.toDuration(value) - value required');
        return Duration.of(value, this.toChronoUnit());
    }

    //conversions

    /**
     * Converts from SOURCE value/units into DESTINATION (this) units.
     *
     * @param {Number} value The SOURCE value
     * @param {TimeUnit} timeUnit  The SOURCE timeUnit
     * @returns {Number} The destination value/units
     */
    convert(value, timeUnit) {
        Preconditions.shouldBeNumber(value);
        Preconditions.shouldBeInstance(timeUnit, TimeUnit);

        let duration = Duration.of(value, timeUnit.toChronoUnit());

        return this.spec.fromNanos(duration.toNanos());
        // let numberOfNanos = sourceDuration.toNanos();
        // let destinationDuration = this.toDuration(0);
        //
        // return destinationDuration.plusNanos(numberOfNanos);
    }

    /**
     * @param {Number} value The value, in "our" units. If the unit is Millis, then your 'value' should be units.
     *
     * @return {Number}
     */
    toValue(value) {
        return this.spec.fromNanos(
            this.toDuration(value)
                .toNanos());
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toNanos(value) {
        return SPEC_NANOSECONDS.toNumber(this.toDuration(value));
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMicros(value) {
        // This library does not have support for micro
        return SPEC_MICROSECONDS.toNumber(this.toDuration(value));
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMillis(value) {
        return SPEC_MILLISECONDS.toNumber(this.toDuration(value));
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toSeconds(value) {
        return SPEC_SECONDS.toNumber(this.toDuration(value));
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toMinutes(value) {
        return SPEC_MINUTES.toNumber(this.toDuration(value));
    }

    /**
     * @returns {Number}
     */
    toHours(value) {
        return SPEC_HOURS.toNumber(this.toDuration(value));
    }

    /**
     * @param {Number} value
     * @returns {Number}
     */
    toDays(value) {
        return SPEC_DAYS.toNumber(this.toDuration(value));
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