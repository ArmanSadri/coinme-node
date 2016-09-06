'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimeUnit = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require("./CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _jsJoda = require("js-joda/dist/js-joda");

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _mathjs = require("mathjs");

var _mathjs2 = _interopRequireDefault(_mathjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_Preconditions2.default.shouldBeDefined(_jsJoda.ChronoUnit);
_Preconditions2.default.shouldBeDefined(_jsJoda.Duration);

// Handy constants for conversions
var C0 = 1;
var C1 = C0 * 1000;
var C2 = C1 * 1000;
var C3 = C2 * 1000;
var C4 = C3 * 60;
var C5 = C4 * 60;
var C6 = C5 * 24;

var MAX = Number.MAX_SAFE_INTEGER;
var MIN = Number.MIN_SAFE_INTEGER;

/**
 * Scale value by m, checking for overflow.
 * This has a short name to make above covaluee more reavalueable.
 * @param {Number|String} value
 * @param {Number} m
 * @param {Number} over
 * @return {Number}
 */
function x(value, m, over) {
    value = _Utility2.default.toNumberOrFail(value);
    if (value > over) return MAX;
    if (value < -over) return MIN;

    return value * m;
}

//region specs

var SPEC_NANOSECONDS = {

    /**
     * @type {ChronoUnit}
     */
    unit: _jsJoda.ChronoUnit.NANOS,

    shortName: 'ns',

    longName: 'nanos',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    toNanos: function toNanos(valueInNanos) {
        return valueInNanos;
    },
    fromNanos: function fromNanos(valueInNanos) {
        return valueInNanos;
    },
    toMicros: function toMicros(valueInNanos) {
        return _mathjs2.default.chain(valueInNanos).divide(_mathjs2.default.divide(C1, C0)).done();
        // return valueInNanos / (C1 / C0);
    },
    toMillis: function toMillis(valueInNanos) {
        return _mathjs2.default.divide(valueInNanos, _mathjs2.default.divide(C2, C0));
        // return valueInNanos / (C2 / C0);
    },
    toSeconds: function toSeconds(valueInNanos) {
        return _mathjs2.default.divide(valueInNanos, _mathjs2.default.divide(C3, C0));
        // return valueInNanos / (C3 / C0);
    },
    toMinutes: function toMinutes(valueInNanos) {
        return _mathjs2.default.divide(valueInNanos, _mathjs2.default.divide(C4, C0));
        // return valueInNanos / (C4 / C0);
    },
    toHours: function toHours(valueInNanos) {
        return _mathjs2.default.divide(valueInNanos, _mathjs2.default.divide(C5, C0));
        // return valueInNanos / (C5 / C0);
    },
    toDays: function toDays(valueInNanos) {
        return _mathjs2.default.divide(valueInNanos, _mathjs2.default.divide(C6, C0));
        // return valueInNanos / (C6 / C0);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toNanos(value);
    },
    excessNanos: function excessNanos(value, m) {
        return value - m * C2;
    }
};

var SPEC_MICROSECONDS = {

    unit: _jsJoda.ChronoUnit.MICROS,

    shortName: "μs", // μs

    longName: 'micros',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    fromNanos: function fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMicros(valueInNanos);
    },
    toNanos: function toNanos(valueInMicros) {
        return x(valueInMicros, _mathjs2.default.divide(C1, C0), _mathjs2.default.divide(MAX, _mathjs2.default.divide(C1, C0)));
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
    excessNanos: function excessNanos(value, m) {
        return value * C1 - m * C2;
    }
};

var SPEC_MILLISECONDS = {

    unit: _jsJoda.ChronoUnit.MILLIS,

    shortName: "ms", // μs

    longName: 'millis',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    fromNanos: function fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMillis(valueInNanos);
    },
    toNanos: function toNanos(valueInMillis) {
        return x(valueInMillis, _mathjs2.default.divide(C2, C0), _mathjs2.default.divide(MAX, _mathjs2.default.divide(C2, C0)));
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

    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_SECONDS = {

    unit: _jsJoda.ChronoUnit.SECONDS,

    shortName: "s",

    longName: 'seconds',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    fromNanos: function fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toSeconds(valueInNanos);
    },
    toNanos: function toNanos(valueInSeconds) {
        return x(valueInSeconds, _mathjs2.default.divide(C3, C0), _mathjs2.default.divide(MAX, _mathjs2.default.divide(C3 / C0)));
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

    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_MINUTES = {

    unit: _jsJoda.ChronoUnit.MINUTES,

    shortName: 'min',

    longName: 'minutes',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    fromNanos: function fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toMinutes(valueInNanos);
    },
    toNanos: function toNanos(valueInMinutes) {
        return x(valueInMinutes, _mathjs2.default.divide(C4, C0), _mathjs2.default.divide(MAX, _mathjs2.default.divide(C4 / C0)));
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

    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_HOURS = {

    shortName: "h",

    longName: 'hours',

    /**
     * @param {Duration} duration
     * @return {Number|number}
     */
    toNumber: function toNumber(duration) {
        return this.fromNanos(duration.toNanos());
    },
    fromNanos: function fromNanos(valueInNanos) {
        return SPEC_NANOSECONDS.toHours(valueInNanos);
    },
    toNanos: function toNanos(valueInHours) {
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

    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_DAYS = {

    unit: _jsJoda.ChronoUnit.DAYS,

    shortName: 'd',

    longName: 'days',

    toNanos: function toNanos(valueInDays) {
        return x(valueInDays, C6 / C0, MAX / (C6 / C0));
    },
    fromNanos: function fromNanos(valueInNanos) {
        // TimeUnit.NANOS.toDays(valueInNanos)
        return SPEC_NANOSECONDS.toDays(valueInNanos);
    },
    toMicros: function toMicros(valueInDays) {
        return x(valueInDays, C6 / C1, MAX / (C6 / C1));
    },
    toMillis: function toMillis(valueInDays) {
        return x(valueInDays, C6 / C2, MAX / (C6 / C2));
    },
    toSeconds: function toSeconds(valueInDays) {
        return x(valueInDays, C6 / C3, MAX / (C6 / C3));
    },
    toMinutes: function toMinutes(valueInDays) {
        return x(valueInDays, C6 / C4, MAX / (C6 / C4));
    },


    /**
     * @param {Number} valueInDays
     * @return {Number} hours
     */
    toHours: function toHours(valueInDays) {
        return x(valueInDays, C6 / C5, MAX / (C6 / C5));
    },
    toDays: function toDays(valueInDays) {
        return valueInDays;
    },


    /**
     *
     * @param {Number} value
     * @param {TimeUnit} timeUnit
     * @returns {Number|*} days
     */
    convert: function convert(value, timeUnit) {
        return timeUnit.toDays(value);
    },
    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};
//endregion

//region TimeUnit

var TimeUnit = function (_CoreObject) {
    _inherits(TimeUnit, _CoreObject);

    //endregion

    /**
     * @protected
     * @param {Object} spec
     */


    /**
     * @return {TimeUnit}
     */


    /**
     * @return {TimeUnit}
     */


    /**
     * @return {TimeUnit}
     */
    function TimeUnit(spec) {
        _classCallCheck(this, TimeUnit);

        /**
         * @type {{unit: ChronoUnit, toString:function, equals:function, excessNanos:function, shortName:String, longName:String, toNumber:function}}
         * @private
         */
        var _this = _possibleConstructorReturn(this, (TimeUnit.__proto__ || Object.getPrototypeOf(TimeUnit)).call(this));

        _this.spec = spec;
        return _this;
    }

    /**
     * @returns {string}
     */


    /**
     * @return {TimeUnit}
     */


    /**
     * @return {TimeUnit}
     */


    /**
     * @return {TimeUnit}
     */


    //region static TimeUnits
    /**
     * @return {TimeUnit}
     */


    _createClass(TimeUnit, [{
        key: "toString",
        value: function toString() {
            return this.spec.shortName;
        }
    }, {
        key: "valueOf",
        value: function valueOf() {
            return this.toString();
        }

        //region public methods
        /**
         *
         * @returns {String}
         */

    }, {
        key: "toChronoUnit",


        /**
         * @return {ChronoUnit}
         */
        value: function toChronoUnit() {
            return this.spec.unit;
        }

        /**
         *
         * @param {Number} value - (the units of this number are assumed to be 'this.unit')
         * @returns {Duration}
         */

    }, {
        key: "toDuration",
        value: function toDuration(value) {
            value = _Utility2.default.toNumberOrFail(value, 'TimeUnit.toDuration(value) - value required');
            return _jsJoda.Duration.of(value, this.toChronoUnit());
        }

        //conversions

        /**
         * Converts from SOURCE value/units into DESTINATION (this) units.
         *
         * @param {Number} value The SOURCE value
         * @param {TimeUnit} timeUnit  The SOURCE timeUnit
         * @returns {Number} The destination value/units
         */

    }, {
        key: "convert",
        value: function convert(value, timeUnit) {
            _Preconditions2.default.shouldBeNumber(value);
            _Preconditions2.default.shouldBeInstance(timeUnit, TimeUnit);

            var duration = _jsJoda.Duration.of(value, timeUnit.toChronoUnit());

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

    }, {
        key: "toValue",
        value: function toValue(value) {
            return this.spec.fromNanos(this.toDuration(value).toNanos());
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toNanos",
        value: function toNanos(value) {
            return SPEC_NANOSECONDS.toNumber(this.toDuration(value));
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMicros",
        value: function toMicros(value) {
            // This library does not have support for micro
            return SPEC_MICROSECONDS.toNumber(this.toDuration(value));
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMillis",
        value: function toMillis(value) {
            return SPEC_MILLISECONDS.toNumber(this.toDuration(value));
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toSeconds",
        value: function toSeconds(value) {
            return SPEC_SECONDS.toNumber(this.toDuration(value));
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMinutes",
        value: function toMinutes(value) {
            return SPEC_MINUTES.toNumber(this.toDuration(value));
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "toHours",
        value: function toHours(value) {
            return SPEC_HOURS.toNumber(this.toDuration(value));
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toDays",
        value: function toDays(value) {
            return SPEC_DAYS.toNumber(this.toDuration(value));
        }

        /**
         *
         * @param {TimeUnit} timeUnit
         * @returns {boolean}
         */

    }, {
        key: "equals",
        value: function equals(timeUnit) {
            if (!timeUnit) {
                return false;
            }

            return timeUnit.toString() === this.toString();
        }
        //endregion

    }, {
        key: "shortName",
        get: function get() {
            return this.spec.shortName;
        }

        /**
         *
         * @returns {String}
         */

    }, {
        key: "longName",
        get: function get() {
            return this.spec.longName;
        }
    }]);

    return TimeUnit;
}(_CoreObject3.default);
//endregion

TimeUnit.NANOSECONDS = new TimeUnit(SPEC_NANOSECONDS);
TimeUnit.MICROSECONDS = new TimeUnit(SPEC_MICROSECONDS);
TimeUnit.MILLISECONDS = new TimeUnit(SPEC_MILLISECONDS);
TimeUnit.SECONDS = new TimeUnit(SPEC_SECONDS);
TimeUnit.MINUTES = new TimeUnit(SPEC_MINUTES);
TimeUnit.HOURS = new TimeUnit(SPEC_HOURS);
TimeUnit.DAYS = new TimeUnit(SPEC_DAYS);
exports.TimeUnit = TimeUnit;
exports.default = TimeUnit;
//# sourceMappingURL=TimeUnit.js.map