"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SmoothWarmingUpRateLimiter = exports.SmoothBurstyRateLimiter = exports.SmoothRateLimiter = exports.RateLimiter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Preconditions = require("./Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _TimeUnit = require("./TimeUnit");

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _Utility = require("./Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require("./CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Stopwatch = require("./Stopwatch");

var _Stopwatch2 = _interopRequireDefault(_Stopwatch);

var _Errors = require("./errors/Errors");

var _Errors2 = _interopRequireDefault(_Errors);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RateLimiter = function (_CoreObject) {
    _inherits(RateLimiter, _CoreObject);

    function RateLimiter(options) {
        _classCallCheck(this, RateLimiter);

        /**
         * @type {Stopwatch}
         * @private
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RateLimiter).call(this, options));

        _this._stopwatch = new _Stopwatch2.default({ start: true });

        // /**
        //  * @type {String}
        //  * @private
        //  */
        // this._failAction = Utility.take(options, 'failAction', {
        //         type: 'string',
        //         required: false,
        //         defaultValue: 'wait'
        //     });
        return _this;
    }

    //region property: {Stopwatch} stopwatch
    /**
     * @returns {Stopwatch}
     */


    _createClass(RateLimiter, [{
        key: "acquire",


        //endregion

        /**
         * Acquires a single permit from this {@code RateLimiter}. Returns a Promise that will resolve or reject.
         * The default maximum time to wait is 30 seconds.
         *
         * <p>This method is equivalent to {@code acquire(1)}.
         *
         * @param {Number} [permits] defaults to 1
         * @param {Number} [timeout] defaults to 30
         * @param {TimeUnit} [timeUnit] defaults to seconds
         * @return {Promise} time spent sleeping to enforce rate, in seconds; 0.0 if not rate-limited
         * @since 16.0 (present in 13.0 with {@code void} return type})
         */
        value: function acquire(permits, timeout, timeUnit) {
            return this.tryAcquire(permits, timeout, timeUnit);
        }

        /**
         * Reserves the given number of permits from this {@code RateLimiter} for future use, returning
         * the number of microseconds until the reservation can be consumed.
         *
         * @param {Number} [permits]
         * @return {Number} time in microseconds to wait until the resource can be acquired, never negative
         */

    }, {
        key: "reserve",
        value: function reserve(permits) {
            permits = this.checkPermits(permits);

            return this.reserveAndGetWaitLength(permits, this.stopwatch.elapsedMicros());
        }

        /**
         * Reserves next ticket and returns the wait time that the caller must wait for.
         *
         * @private
         * @param {Number} permits
         * @param {Number} nowMicros
         * @return {Number} the required wait time, never negative
         */

    }, {
        key: "reserveAndGetWaitLength",
        value: function reserveAndGetWaitLength(permits, nowMicros) {
            var momentAvailable = this.reserveEarliestAvailable(permits, nowMicros);
            var waitLength = Math.max(momentAvailable - nowMicros, 0);

            console.log(this + ".reserveAndGetWaitLength(" + permits + ", " + nowMicros + ") ==> " + waitLength);
            // Logger.debug(`${this}.reserveAndGetWaitLength(${permits}, ${nowMicros}) ==> ${waitLength}`);

            return waitLength;
        }

        /**
         * @private
         * @param {Number} nowMicros
         * @param {Number} timeoutMicros
         * @returns {boolean}
         */

    }, {
        key: "canAcquire",
        value: function canAcquire(nowMicros, timeoutMicros) {
            return this.queryEarliestAvailable(nowMicros) - timeoutMicros <= nowMicros;
        }

        /**
         * Acquires the given number of permits from this {@code RateLimiter} if it can be obtained
         * without exceeding the specified {@code timeout}, or returns {@code false}
         * immediately (without waiting) if the permits would not have been granted
         * before the timeout expired.
         *
         * @param {Number} [permits] the number of permits to acquire
         * @param {Number} [timeout] the maximum time to wait for the permits. Negative values are treated as zero.
         * @param {TimeUnit} [unit] the time unit of the timeout argument
         * @return {Promise} if the permits were acquired
         * @throws IllegalArgumentException if the requested number of permits is negative or zero
         */

    }, {
        key: "tryAcquire",
        value: function tryAcquire(permits, timeout, unit) {
            _Preconditions2.default.shouldBeNumber(this.permitsPerSecond, 'Rate must be defined.');

            permits = RateLimiter.checkPermits(permits);
            timeout = _Utility2.default.defaultNumber(timeout, 30);
            unit = _Utility2.default.defaultObject(unit, _TimeUnit2.default.SECONDS);

            var timeoutMicros = Math.max(unit.toMicros(timeout), 0);

            var microsToWait = void 0;
            var nowMicros = this.stopwatch.elapsedMicros();
            var goalMicros = this.queryEarliestAvailable(nowMicros);

            if (!this.canAcquire(nowMicros, timeoutMicros)) {
                return Promise.reject(new Error("RateLimit exceeded: (rate:" + this.permitsPerSecond + "/sec) (timeoutMicros:" + timeoutMicros + ") (goalMicros: " + goalMicros + ") (differenceMicros:" + (goalMicros - nowMicros) + ")"));
            } else {
                microsToWait = this.reserveAndGetWaitLength(permits, nowMicros);
            }

            _Preconditions2.default.shouldBeExisting(this.ticker, 'ticker');
            return this.ticker.wait(microsToWait, _TimeUnit2.default.MICROSECONDS);
        }

        //region abstract
        /**
         * Returns the earliest time that permits are available (with one caveat).
         *
         * @param {Number} nowMicros
         * @return the time that permits are available, or, if permits are available immediately, an
         *     arbitrary past or present time
         */

    }, {
        key: "queryEarliestAvailable",
        value: function queryEarliestAvailable(nowMicros) {
            _Errors2.default.throwNotImplemented();
        }

        /**
         * Reserves the requested number of permits and returns the time that those permits can be used
         * (with one caveat).
         *
         * @param {Number} permits
         * @param {Number} nowMicros
         * @return {Number} the time that the permits may be used, or, if the permits may be used immediately, an
         *     arbitrary past or present time
         */

    }, {
        key: "reserveEarliestAvailable",
        value: function reserveEarliestAvailable(permits, nowMicros) {
            _Errors2.default.throwNotImplemented();
        }

        //endregion

        //region statics
        /**
         * @private
         * @param {Number} [permits]
         * @returns {Number}
         */

    }, {
        key: "stopwatch",
        get: function get() {
            return this._stopwatch;
        }

        //endregion

        //region property: {Ticker} ticker
        /**
         *
         * @return {Ticker}
         */

    }, {
        key: "ticker",
        get: function get() {
            return this.stopwatch.ticker;
        }
        //endregion

        //region property: {Number} permitsPerSecond

        /**
         * Updates the stable rate of this {@code RateLimiter}, that is, the
         * {@code permitsPerSecond} argument provided in the factory method that
         * constructed the {@code RateLimiter}. Currently throttled threads will <b>not</b>
         * be awakened as a result of this invocation, thus they do not observe the new rate;
         * only subsequent requests will.
         *
         * <p>Note though that, since each request repays (by waiting, if necessary) the cost
         * of the <i>previous</i> request, this means that the very next request
         * after an invocation to {@code setRate} will not be affected by the new rate;
         * it will pay the cost of the previous request, which is in terms of the previous rate.
         *
         * <p>The behavior of the {@code RateLimiter} is not modified in any other way,
         * e.g. if the {@code RateLimiter} was configured with a warmup period of 20 seconds,
         * it still has a warmup period of 20 seconds after this method invocation.
         *
         * @param {Number} permitsPerSecond the new stable rate of this {@code RateLimiter}
         * @throws IllegalArgumentException if {@code permitsPerSecond} is negative or zero
         */

    }, {
        key: "permitsPerSecond",
        set: function set(permitsPerSecond) {
            _Preconditions2.default.shouldBeExisting(permitsPerSecond);
            _Preconditions2.default.shouldBeTrue(permitsPerSecond > 0.0 && !_Utility2.default.isNaN(permitsPerSecond), "rate must be positive");

            this._permitsPerSecond = _Preconditions2.default.shouldBePositiveNumber(permitsPerSecond, 'Rate must be positive');

            this.doSetRate(permitsPerSecond, this.stopwatch.elapsedMicros());
        }

        /**
         *
         * @returns {Number}
         */
        ,
        get: function get() {
            return this._permitsPerSecond;
        }
    }], [{
        key: "checkPermits",
        value: function checkPermits(permits) {
            if (_Utility2.default.isNotExisting(permits)) {
                return 1;
            }

            _Preconditions2.default.shouldBeNumber(permits, "Requested permits (" + permits + ") must be positive");
            _Preconditions2.default.shouldBeTrue(permits > 0, "Requested permits (" + permits + ") must be positive");

            return permits;
        }

        //endregion

    }]);

    return RateLimiter;
}(_CoreObject3.default);

var SmoothRateLimiter = function (_RateLimiter) {
    _inherits(SmoothRateLimiter, _RateLimiter);

    function SmoothRateLimiter(options) {
        _classCallCheck(this, SmoothRateLimiter);

        /**
         * The currently stored permits.
         */

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SmoothRateLimiter).call(this, options));

        _this2._storedPermits = 0;

        /**
         * The maximum number of stored permits.
         * @type {Number}
         * @private
         */
        _this2._maxPermits = 0;

        /**
         * The interval between two unit requests, at our stable rate. E.g., a stable rate of 5 permits
         * per second has a stable interval of 200ms.
         */
        _this2._stableIntervalMicros = 0;

        /**
         * The time when the next request (no matter its size) will be granted. After granting a
         * request, this is pushed further in the future. Large requests push this further than small
         * requests.
         * @type {Number}
         * @private
         */
        _this2._nextFreeTicketMicros = 0; // could be either in the past or future
        return _this2;
    }

    /**
     * @protected
     * @param permitsPerSecond
     * @param nowMicros
     */


    _createClass(SmoothRateLimiter, [{
        key: "doSetRate",
        value: function doSetRate(permitsPerSecond, nowMicros) {
            this.resync(nowMicros);
            var stableIntervalMicros = _TimeUnit2.default.SECONDS.toMicros(1) / permitsPerSecond;
            this._stableIntervalMicros = stableIntervalMicros;
            this.doSetRate2(permitsPerSecond, stableIntervalMicros);
        }

        /**
         * @protected
         * @param permitsPerSecond
         * @param stableIntervalMicros
         */

    }, {
        key: "doSetRate2",
        value: function doSetRate2(permitsPerSecond, stableIntervalMicros) {
            _Errors2.default.throwNotImplemented();
        }
    }, {
        key: "queryEarliestAvailable",
        value: function queryEarliestAvailable(nowMicros) {
            return _Preconditions2.default.shouldBeNumber(this._nextFreeTicketMicros);
        }
    }, {
        key: "reserveEarliestAvailable",
        value: function reserveEarliestAvailable(requiredPermits, nowMicros) {
            this.resync(nowMicros);
            var nextFreeTicketMicros = this._nextFreeTicketMicros;

            var returnValue = nextFreeTicketMicros;
            var storedPermitsToSpend = Math.min(requiredPermits, this._storedPermits);
            var freshPermits = requiredPermits - storedPermitsToSpend;

            var waitMicros = this.storedPermitsToWaitTime(this._storedPermits, storedPermitsToSpend) + freshPermits * this._stableIntervalMicros;

            this._nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
            this._storedPermits -= storedPermitsToSpend;

            return returnValue;
        }

        /**
         * Translates a specified portion of our currently stored permits which we want to
         * spend/acquire, into a throttling time. Conceptually, this evaluates the integral
         * of the underlying function we use, for the range of
         * [(storedPermits - permitsToTake), storedPermits].
         *
         * <p>This always holds: {@code 0 <= permitsToTake <= storedPermits}
         */

    }, {
        key: "storedPermitsToWaitTime",
        value: function storedPermitsToWaitTime(storedPermits, permitsToTake) {
            _Errors2.default.throwNotImplemented();
        }

        /**
         *
         * @param {Number} nowMicros
         * @return {Number}
         */

    }, {
        key: "resync",
        value: function resync(nowMicros) {
            if (_Utility2.default.isNullOrUndefined(nowMicros)) {
                nowMicros = this.stopwatch.elapsedMicros();
            }

            // if nextFreeTicket is in the past, resync to now
            var nextFreeTicketMicros = this._nextFreeTicketMicros;

            if (nowMicros > nextFreeTicketMicros) {
                this._storedPermits = Math.min(this._maxPermits, this._storedPermits + (nowMicros - nextFreeTicketMicros) / this._stableIntervalMicros);

                nextFreeTicketMicros = this._nextFreeTicketMicros = nowMicros;
            }

            return nextFreeTicketMicros;
        }
    }]);

    return SmoothRateLimiter;
}(RateLimiter);

/**
 * This implements a "bursty" RateLimiter, where storedPermits are translated to
 * zero throttling. The maximum number of permits that can be saved (when the RateLimiter is
 * unused) is defined in terms of time, in this sense: if a RateLimiter is 2qps, and this
 * time is specified as 10 seconds, we can save up to 2 * 10 = 20 permits.
 */


var SmoothBurstyRateLimiter = function (_SmoothRateLimiter) {
    _inherits(SmoothBurstyRateLimiter, _SmoothRateLimiter);

    /**
     * @param {Object} options
     * @param {Number} options.maxBurstSeconds
     * @param {Stopwatch} [options.stopwatch]
     */

    function SmoothBurstyRateLimiter(options) {
        _classCallCheck(this, SmoothBurstyRateLimiter);

        var maxBurstSeconds = _Utility2.default.take(options, 'maxBurstSeconds', 'number', true);

        // SleepingStopwatch stopwatch, double maxBurstSeconds

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(SmoothBurstyRateLimiter).apply(this, arguments));

        _this3.maxBurstSeconds = maxBurstSeconds;
        return _this3;
    }

    /**
     *
     * @param {Number} permitsPerSecond
     * @param {Number} stableIntervalMicros
     */


    /** The work (permits) of how many seconds can be saved up if this RateLimiter is unused? */


    _createClass(SmoothBurstyRateLimiter, [{
        key: "doSetRate2",
        value: function doSetRate2(permitsPerSecond, stableIntervalMicros) {
            var oldMaxPermits = _Utility2.default.defaultNumber(this._maxPermits);
            var maxBurstSeconds = _Utility2.default.defaultNumber(this.maxBurstSeconds);

            this._maxPermits = maxBurstSeconds * permitsPerSecond;

            // if (oldMaxPermits == Double.POSITIVE_INFINITY) {
            //     // if we don't special-case this, we would get storedPermits == NaN, below
            //     this.storedPermits = maxPermits;
            // } else {
            this._storedPermits = oldMaxPermits == 0.0 ? 0.0 // initial state
            : this._storedPermits * this._maxPermits / oldMaxPermits;
            // }

            _Preconditions2.default.shouldBeNumber(this._storedPermits, 'storedPermits');
            _Preconditions2.default.shouldBeNumber(this._maxPermits, '_maxPermits');
        }

        /**
         *
         * @param {Number} storedPermits
         * @param {Number} permitsToTake
         * @return {number}
         */

    }, {
        key: "storedPermitsToWaitTime",
        value: function storedPermitsToWaitTime(storedPermits, permitsToTake) {
            return 0;
        }
    }]);

    return SmoothBurstyRateLimiter;
}(SmoothRateLimiter);

var SmoothWarmingUpRateLimiter = function (_SmoothRateLimiter2) {
    _inherits(SmoothWarmingUpRateLimiter, _SmoothRateLimiter2);

    /**
     * The slope of the line from the stable interval (when permits == 0), to the cold interval
     * (when permits == maxPermits)
     */

    function SmoothWarmingUpRateLimiter(options) {
        _classCallCheck(this, SmoothWarmingUpRateLimiter);

        //    SleepingStopwatch stopwatch, long warmupPeriod, TimeUnit timeUnit
        var timeUnit = _Utility2.default.take(options, 'timeUnit', _TimeUnit2.default, true);
        var warmupPeriod = _Utility2.default.take(options, 'warmupPeriod', 'number', true);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(SmoothWarmingUpRateLimiter).apply(this, arguments));

        _this4.warmupPeriodMicros = timeUnit.toMicros(warmupPeriod);
        return _this4;
    }

    /**
     * @private
     * @param permitsPerSecond
     * @param stableIntervalMicros
     */


    _createClass(SmoothWarmingUpRateLimiter, [{
        key: "doSetRate2",
        value: function doSetRate2(permitsPerSecond, stableIntervalMicros) {
            var oldMaxPermits = this._maxPermits;
            this._maxPermits = this.warmupPeriodMicros / stableIntervalMicros;
            this.halfPermits = this._maxPermits / 2.0;

            // Stable interval is x, cold is 3x, so on average it's 2x. Double the time -> halve the rate
            var coldIntervalMicros = stableIntervalMicros * 3.0;
            this.slope = (coldIntervalMicros - stableIntervalMicros) / this.halfPermits;

            // if (oldMaxPermits == Number.POSITIVE_INFINITY) {
            //     // if we don't special-case this, we would get storedPermits == NaN, below
            //     this._storedPermits = 0.0;
            // } else {
            this._storedPermits = oldMaxPermits == 0.0 ? this._maxPermits // initial state is cold
            : this._storedPermits * this._maxPermits / oldMaxPermits;
            // }
        }

        /**
         * @private
         * @param storedPermits
         * @param permitsToTake
         * @return {number}
         */

    }, {
        key: "storedPermitsToWaitTime",
        value: function storedPermitsToWaitTime(storedPermits, permitsToTake) {
            var availablePermitsAboveHalf = storedPermits - this.halfPermits;
            var micros = 0;
            // measuring the integral on the right part of the function (the climbing line)
            if (availablePermitsAboveHalf > 0.0) {
                var permitsAboveHalfToTake = Math.min(availablePermitsAboveHalf, permitsToTake);
                micros = permitsAboveHalfToTake * (this.permitsToTime(availablePermitsAboveHalf) + this.permitsToTime(availablePermitsAboveHalf - permitsAboveHalfToTake)) / 2.0;
                permitsToTake -= permitsAboveHalfToTake;
            }
            // measuring the integral on the left part of the function (the horizontal line)
            micros += this._stableIntervalMicros * permitsToTake;
            return micros;
        }

        /**
         * @private
         * @param permits
         * @return {*}
         */

    }, {
        key: "permitsToTime",
        value: function permitsToTime(permits) {
            return this._stableIntervalMicros + permits * this.slope;
        }
    }]);

    return SmoothWarmingUpRateLimiter;
}(SmoothRateLimiter);

exports.RateLimiter = RateLimiter;
exports.SmoothRateLimiter = SmoothRateLimiter;
exports.SmoothBurstyRateLimiter = SmoothBurstyRateLimiter;
exports.SmoothWarmingUpRateLimiter = SmoothWarmingUpRateLimiter;
exports.default = SmoothRateLimiter;
//# sourceMappingURL=RateLimiter.js.map