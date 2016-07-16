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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    shortName: 'ns',

    longName: 'nanos',

    toString: function toString() {
        return 'NANOSECONDS';
    },
    toNanos: function toNanos(valueInNanos) {
        return valueInNanos;
    },
    toMicros: function toMicros(valueInNanos) {
        return valueInNanos / (C1 / C0);
    },
    toMillis: function toMillis(valueInNanos) {
        return valueInNanos / (C2 / C0);
    },
    toSeconds: function toSeconds(valueInNanos) {
        return valueInNanos / (C3 / C0);
    },
    toMinutes: function toMinutes(valueInNanos) {
        return valueInNanos / (C4 / C0);
    },
    toHours: function toHours(valueInNanos) {
        return valueInNanos / (C5 / C0);
    },
    toDays: function toDays(valueInNanos) {
        return valueInNanos / (C6 / C0);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toNanos(value);
    },
    excessNanos: function excessNanos(value, m) {
        return value - m * C2;
    }
};

var SPEC_MICROSECONDS = {
    shortName: "μs", // μs
    longName: 'micros',

    toString: function toString() {
        return 'MICROSECONDS';
    },
    toNanos: function toNanos(valueInMicros) {
        return x(valueInMicros, C1 / C0, MAX / (C1 / C0));
    },
    toMicros: function toMicros(valueInMicros) {
        return valueInMicros;
    },
    toMillis: function toMillis(valueInMicros) {
        return valueInMicros / (C2 / C1);
    },
    toSeconds: function toSeconds(valueInMicros) {
        return valueInMicros / (C3 / C1);
    },
    toMinutes: function toMinutes(valueInMicros) {
        return valueInMicros / (C4 / C1);
    },
    toHours: function toHours(valueInMicros) {
        return valueInMicros / (C5 / C1);
    },
    toDays: function toDays(valueInMicros) {
        return valueInMicros / (C6 / C1);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toMicros(value);
    },
    excessNanos: function excessNanos(value, m) {
        return value * C1 - m * C2;
    }
};

var SPEC_MILLISECONDS = {
    shortName: "ms", // μs
    longName: 'millis',
    toString: function toString() {
        return 'MILLISECONDS';
    },
    toNanos: function toNanos(valueInMillis) {
        return x(valueInMillis, C2 / C0, MAX / (C2 / C0));
    },
    toMicros: function toMicros(valueInMillis) {
        return x(valueInMillis, C2 / C1, MAX / (C2 / C1));
    },
    toMillis: function toMillis(valueInMillis) {
        return valueInMillis;
    },
    toSeconds: function toSeconds(valueInMillis) {
        return valueInMillis / (C3 / C2);
    },
    toMinutes: function toMinutes(valueInMillis) {
        return valueInMillis / (C4 / C2);
    },
    toHours: function toHours(valueInMillis) {
        return valueInMillis / (C5 / C2);
    },
    toDays: function toDays(valueInMillis) {
        return valueInMillis / (C6 / C2);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toMillis(value);
    },
    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_SECONDS = {
    shortName: "s",
    longName: 'seconds',

    toString: function toString() {
        return 'SECONDS';
    },
    toNanos: function toNanos(valueInSeconds) {
        return x(valueInSeconds, C3 / C0, MAX / (C3 / C0));
    },
    toMicros: function toMicros(valueInSeconds) {
        return x(valueInSeconds, C3 / C1, MAX / (C3 / C1));
    },
    toMillis: function toMillis(valueInSeconds) {
        return x(valueInSeconds, C3 / C2, MAX / (C3 / C2));
    },
    toSeconds: function toSeconds(valueInSeconds) {
        return valueInSeconds;
    },
    toMinutes: function toMinutes(valueInSeconds) {
        return valueInSeconds / (C4 / C3);
    },
    toHours: function toHours(valueInSeconds) {
        return valueInSeconds / (C5 / C3);
    },
    toDays: function toDays(valueInSeconds) {
        return valueInSeconds / (C6 / C3);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toSeconds(value);
    },
    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_MINUTES = {
    shortName: 'min',
    longName: 'minutes',

    toString: function toString() {
        return 'MINUTES';
    },
    toNanos: function toNanos(valueInMinutes) {
        return x(valueInMinutes, C4 / C0, MAX / (C4 / C0));
    },
    toMicros: function toMicros(valueInMinutes) {
        return x(valueInMinutes, C4 / C1, MAX / (C4 / C1));
    },
    toMillis: function toMillis(valueInMinutes) {
        return x(valueInMinutes, C4 / C2, MAX / (C4 / C2));
    },
    toSeconds: function toSeconds(valueInMinutes) {
        return x(valueInMinutes, C4 / C3, MAX / (C4 / C3));
    },
    toMinutes: function toMinutes(valueInMinutes) {
        return valueInMinutes;
    },
    toHours: function toHours(valueInMinutes) {
        return valueInMinutes / (C5 / C4);
    },
    toDays: function toDays(valueInMinutes) {
        return valueInMinutes / (C6 / C4);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toMinutes(value);
    },
    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_HOURS = {
    shortName: "h",
    longName: 'hours',

    toString: function toString() {
        return 'HOURS';
    },
    toNanos: function toNanos(valueInHours) {
        return x(valueInHours, C5 / C0, MAX / (C5 / C0));
    },
    toMicros: function toMicros(valueInHours) {
        return x(valueInHours, C5 / C1, MAX / (C5 / C1));
    },
    toMillis: function toMillis(valueInHours) {
        return x(valueInHours, C5 / C2, MAX / (C5 / C2));
    },
    toSeconds: function toSeconds(valueInHours) {
        return x(valueInHours, C5 / C3, MAX / (C5 / C3));
    },
    toMinutes: function toMinutes(valueInHours) {
        return x(valueInHours, C5 / C4, MAX / (C5 / C4));
    },
    toHours: function toHours(valueInHours) {
        return valueInHours;
    },
    toDays: function toDays(valueInHours) {
        return valueInHours / (C6 / C5);
    },
    convert: function convert(value, timeUnit) {
        return timeUnit.toHours(value);
    },
    excessNanos: function excessNanos(value, m) {
        return 0;
    }
};

var SPEC_DAYS = {

    shortName: 'd',

    longName: 'days',

    /**
     *
     * @param {TimeUnit} units
     * @returns {boolean}
     */
    equals: function equals(units) {
        return units.toString() === this.toString();
    },

    toString: function toString() {
        return 'DAYS';
    },
    toNanos: function toNanos(valueInDays) {
        return x(valueInDays, C6 / C0, MAX / (C6 / C0));
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

    _createClass(TimeUnit, null, [{
        key: "NANOSECONDS",


        //region static TimeUnit enums
        //region NANOSECONDS
        /**
         *
         * @return {TimeUnit}
         */
        get: function get() {
            return new TimeUnit(SPEC_NANOSECONDS);
        }

        //endregion

        //region MICROSECONDS
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "MICROSECONDS",
        get: function get() {
            return new TimeUnit(SPEC_MICROSECONDS);
        }

        //endregion

        //region MILLISECONDS
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "MILLISECONDS",
        get: function get() {
            return new TimeUnit(SPEC_MILLISECONDS);
        }

        //endregion

        //region SECONDS
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "SECONDS",
        get: function get() {
            return new TimeUnit(SPEC_SECONDS);
        }

        //endregion

        //region MINUTES
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "MINUTES",
        get: function get() {
            return new TimeUnit(SPEC_MINUTES);
        }

        //endregion

        //region HOURS
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "HOURS",
        get: function get() {
            return new TimeUnit(SPEC_HOURS);
        }

        //endregion

        //region DAYS
        /**
         * @return {TimeUnit}
         */

    }, {
        key: "DAYS",
        get: function get() {
            return new TimeUnit(SPEC_DAYS);
        }

        //endregion
        //endregion

        /**
         * @protected
         * @param {Object} spec
         */

    }]);

    function TimeUnit(spec) {
        _classCallCheck(this, TimeUnit);

        // if (this.constructor === TimeUnit) {
        //     throw new TypeError('Cannot instantiate TimeUnit directly');
        // }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeUnit).call(this));

        _this._spec = spec;
        return _this;
    }

    //region public methods

    /**
     *
     * @returns {String}
     */


    _createClass(TimeUnit, [{
        key: "toString",


        /**
         * @returns {string}
         */
        value: function toString() {
            return this._spec.toString();
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toNanos",
        value: function toNanos(value) {
            return this._spec.toNanos(value);
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMicros",
        value: function toMicros(value) {
            return this._spec.toMicros(value);
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMillis",
        value: function toMillis(value) {
            return this._spec.toMillis(value);
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toSeconds",
        value: function toSeconds(value) {
            return this._spec.toSeconds(value);
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toMinutes",
        value: function toMinutes(value) {
            return this._spec.toMinutes(value);
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "toHours",
        value: function toHours(value) {
            return this._spec.toHours(value);
        }

        /**
         * @param {Number} value
         * @returns {Number}
         */

    }, {
        key: "toDays",
        value: function toDays(value) {
            return this._spec.toDays(value);
        }

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
            return this._spec.convert(value, timeUnit);
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
            return this._spec.shortName;
        }

        /**
         *
         * @returns {String}
         */

    }, {
        key: "longName",
        get: function get() {
            return this._spec.longName;
        }
    }]);

    return TimeUnit;
}(_CoreObject3.default);
//endregion

exports.TimeUnit = TimeUnit;
exports.default = TimeUnit;
//# sourceMappingURL=TimeUnit.js.map