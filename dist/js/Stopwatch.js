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

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Ticker = require("./Ticker");

var _Ticker2 = _interopRequireDefault(_Ticker);

var _nanotimer = require("nanotimer");

var _nanotimer2 = _interopRequireDefault(_nanotimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MILLISECONDS = _TimeUnit2.default.MILLISECONDS;
var MICROSECONDS = _TimeUnit2.default.MICROSECONDS;
var NANOSECONDS = _TimeUnit2.default.NANOSECONDS;

/**
 *
 * @type {Ticker}
 */
var SYSTEM_TICKER = _Ticker2.default.systemTicker();

var Stopwatch = function (_CoreObject) {
    _inherits(Stopwatch, _CoreObject);

    /**
     *
     * @param {Object} [options]
     * @param {Ticker} [options.ticker]
     * @param {boolean} [options.start]
     */

    function Stopwatch(options) {
        _classCallCheck(this, Stopwatch);

        var shouldStart = _Utility2.default.take(options, 'start', {
            defaultValue: true
        });

        var ticker = _Utility2.default.take(options, 'ticker') || SYSTEM_TICKER;

        // options = options || {};

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Stopwatch).apply(this, arguments));

        _this._ticker = ticker;

        /**
         * @type {Number} nanoseconds
         * @private
         */
        _this._startTick = _this.ticker.read();

        if (shouldStart) {
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
            _Preconditions2.default.shouldBeFalsey(this.running, "This stopwatch is already running.");
            _Preconditions2.default.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");

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

    }, {
        key: "stop",
        value: function stop(options) {
            _Preconditions2.default.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");
            _Preconditions2.default.shouldBeTrue(this.running, "This stopwatch is already stopped.");

            this._running = false;
            this._elapsedNanos += this.ticker.read() - this._startTick;
            this._finalized = _Utility2.default.take(options, 'finalized', {
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

    }, {
        key: "reset",
        value: function reset() {
            _Preconditions2.default.shouldBeFalsey(this.finalized, "This stopwatch cannot be started, stopped, or reset.");

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

    }, {
        key: "elapsedNanos",
        value: function elapsedNanos() {
            return this.running ? this.ticker.read() - this._startTick + this._elapsedNanos : this._elapsedNanos;
        }
    }, {
        key: "elapsedMillis",
        value: function elapsedMillis() {
            return this.elapsed(MILLISECONDS);
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
                timeUnit = MILLISECONDS;
            }

            return timeUnit.convert(this.elapsedNanos(), timeUnit);
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
        key: "running",
        get: function get() {
            return this._running;
        }
    }, {
        key: "finalized",
        get: function get() {
            return this._finalized;
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

exports.Ticker = _Ticker2.default;
exports.Stopwatch = Stopwatch;
exports.default = Stopwatch;
//# sourceMappingURL=Stopwatch.js.map