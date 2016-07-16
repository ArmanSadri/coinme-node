'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Stopwatch = exports.Ticker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _TimeUnit = require("./TimeUnit");

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _CoreObject2 = require("./CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MICROSECONDS = _TimeUnit2.default.MICROSECONDS;
var NANOSECONDS = _TimeUnit2.default.NANOSECONDS;

/**
 *
 * @type {Ticker}
 */
var SYSTEM_TICKER = null;

var Ticker = function () {

    /**
     * Constructor for use by subclasses.
     */

    function Ticker(options) {
        _classCallCheck(this, Ticker);
    }

    /**
     * Returns the number of nanoseconds elapsed since this ticker's fixed
     * point of reference.
     */


    _createClass(Ticker, [{
        key: "read",
        value: function read() {
            var time = process.hrtime();
            var timeInSeconds = time[0];
            var timeInNanos = time[1];

            return _TimeUnit2.default.SECONDS.toNanos(timeInSeconds) + timeInNanos;
        }

        /**
         * A ticker that reads the current time using {@link System#nanoTime}.
         *
         * @return {Ticker}
         */

    }], [{
        key: "systemTicker",
        value: function systemTicker() {
            return SYSTEM_TICKER;
        }
    }]);

    return Ticker;
}();

SYSTEM_TICKER = new Ticker();

var Stopwatch = function (_CoreObject) {
    _inherits(Stopwatch, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {Ticker} [options.ticker]
     * @param {boolean} [options.start]
     */

    function Stopwatch(options) {
        _classCallCheck(this, Stopwatch);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Stopwatch).call(this));

        _this._ticker = _Utility2.default.take(options, 'ticker') || SYSTEM_TICKER;
        _this._isRunning = _Utility2.default.take(options, 'start');
        _this._elapsedNanos;
        _this._startTick;

        if (_this.isRunning) {
            _this.start();
        }
        return _this;
    }

    /**
     *
     * @returns {Number}
     */


    _createClass(Stopwatch, [{
        key: "start",


        /**
         * Starts the stopwatch.
         *
         * @return {Stopwatch}
         */
        value: function start() {
            _Utility2.default.shouldBeFalsey(this.isRunning, "This stopwatch is already running.");

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

    }, {
        key: "stop",
        value: function stop() {
            _Utility2.default.shouldBeTrue(this.isRunning, "This stopwatch is already stopped.");

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

    }, {
        key: "reset",
        value: function reset() {
            this._elapsedNanos = 0;
            this._isRunning = false;

            return this;
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "elapsedNanos",
        value: function elapsedNanos() {
            return this.isRunning ? this.ticker.read() - this._startTick + this.elapsedNanos : this.elapsedNanos;
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "elapsedMicros",
        value: function elapsedMicros() {
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

    }, {
        key: "elapsed",
        value: function elapsed(timeUnit) {
            if (!timeUnit) {
                timeUnit = NANOSECONDS;
            }

            return timeUnit.convert(this.elapsedNanos(), _TimeUnit2.default.NANOSECONDS);
        }

        /**
         * Returns a string representation of the current elapsed time.
         */

    }, {
        key: "toString",
        value: function toString() {
            var nanos = this.elapsedNanos();
            var unit = this.chooseUnit(nanos);

            var value = nanos / _TimeUnit2.default.NANOSECONDS.convert(1, unit);

            // Too bad this functionality is not exposed as a regular method call
            return value + " " + unit.shortName;
        }

        /**
         * @private
         * @param {Number} nanos
         * @return {TimeUnit}
         */

    }, {
        key: "startTick",
        get: function get() {
            return this._startTick;
        }

        /**
         * @returns {Ticker}
         */

    }, {
        key: "ticker",
        get: function get() {
            return this._ticker;
        }

        /**
         * Returns {@code true} if {@link #start()} has been called on this stopwatch,
         * and {@link #stop()} has not been called since the last call to {@code
         * start()}.
         */

    }, {
        key: "isRunning",
        get: function get() {
            return this._isRunning;
        }
    }], [{
        key: "chooseUnit",
        value: function chooseUnit(nanos) {
            if (_TimeUnit2.default.DAYS.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.DAYS;
            }

            if (_TimeUnit2.default.HOURS.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.HOURS;
            }

            if (_TimeUnit2.default.MINUTES.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.MINUTES;
            }

            if (_TimeUnit2.default.SECONDS.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.SECONDS;
            }

            if (_TimeUnit2.default.MILLISECONDS.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.MILLISECONDS;
            }

            if (_TimeUnit2.default.MICROSECONDS.convert(nanos, _TimeUnit2.default.NANOSECONDS) > 0) {
                return _TimeUnit2.default.MICROSECONDS;
            }

            return _TimeUnit2.default.NANOSECONDS;
        }
    }]);

    return Stopwatch;
}(_CoreObject3.default);

exports.Ticker = Ticker;
exports.Stopwatch = Stopwatch;
exports.default = Stopwatch;
//# sourceMappingURL=Stopwatch.js.map