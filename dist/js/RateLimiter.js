"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MICROSECONDS = _TimeUnit2.default.MICROSECONDS;
var SECONDS = _TimeUnit2.default.SECONDS;

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

        /**
         * @type {String}
         * @private
         */
        _this._failAction = _Utility2.default.take(options, 'failAction', {
            type: 'string',
            required: false,
            defaultValue: 'wait'
        });
        return _this;
    }

    //region property: {String} failAction
    /**
     * @returns {String}
     */


    _createClass(RateLimiter, [{
        key: "acquire",

        //endregion

        /**
         * Acquires a single permit from this {@code RateLimiter}, blocking until the
         * request can be granted. Tells the amount of time slept, if any.
         *
         * <p>This method is equivalent to {@code acquire(1)}.
         *
         * @param {Number} [permits]
         * @return {Number} time spent sleeping to enforce rate, in seconds; 0.0 if not rate-limited
         * @since 16.0 (present in 13.0 with {@code void} return type})
         */
        value: function acquire(permits) {
            return new Promise(function (resolve, reject) {
                return self.tryAcquire(permits);
            });
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

            return max(momentAvailable - nowMicros, 0);
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
         * @return {boolean} if the permits were acquired
         * @throws IllegalArgumentException if the requested number of permits is negative or zero
         */

    }, {
        key: "tryAcquire",
        value: function tryAcquire(permits, timeout, unit) {
            permits = RateLimiter.checkPermits(permits);
            timeout = _Utility2.default.defaultNumber(timeout, 0);
            unit = _Utility2.default.defaultObject(unit, MICROSECONDS);

            var timeoutMicros = Math.max(unit.toMicros(timeout), 0);

            var microsToWait = void 0;
            var nowMicros = this.stopwatch.elapsedMicros();

            if (!this.canAcquire(nowMicros, timeoutMicros)) {
                return false;
            } else {
                microsToWait = this.reserveAndGetWaitLength(permits, nowMicros);
            }

            this.stopwatch.sleepMicrosUninterruptibly(microsToWait);

            return true;
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
            throw new Error('Not implemented');
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
            throw new Error('Not implemented');
        }
        //endregion

        //region statics
        /**
         * @private
         * @param {Number} [permits]
         * @returns {Number}
         */

    }, {
        key: "failAction",
        get: function get() {
            return this._failAction;
        }
        //endregion

        //region property: {Stopwatch} stopwatch
        /**
         * @returns {Stopwatch}
         */

    }, {
        key: "stopwatch",
        get: function get() {
            return this._stopwatch;
        }
        //endregion

        //region property: {String} rate

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
        key: "rate",
        set: function set(permitsPerSecond) {
            _Preconditions2.default.shouldBeTrue(permitsPerSecond > 0.0 && !_Utility2.default.isNaN(permitsPerSecond), "rate must be positive");

            this._rate = permitsPerSecond;
        }

        /**
         *
         * @returns {Number}
         */
        ,
        get: function get() {
            return this._rate;
        }
    }], [{
        key: "checkPermits",
        value: function checkPermits(permits) {
            if (_Utility2.default.isNullOrUndefined(permits)) {
                return 1;
            }

            _Utility2.default.shouldBeTrue(permits > 0, "Requested permits (" + permits + ") must be positive");

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
        _this2._stableIntervalMicros;

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

    // doSetRate(permitsPerSecond, nowMicros) {
    //     this.resync(nowMicros);
    //     this._stableIntervalMicros = SECONDS.toMicros(1) / permitsPerSecond;
    // }

    _createClass(SmoothRateLimiter, [{
        key: "queryEarliestAvailable",
        value: function queryEarliestAvailable(nowMicros) {
            return this.nextFreeTicketMicros;
        }
    }, {
        key: "reserveEarliestAvailable",
        value: function reserveEarliestAvailable(requiredPermits, nowMicros) {
            this.resync(nowMicros);
            var nextFreeTicketMicros = this._nextFreeTicketMicros;

            var returnValue = nextFreeTicketMicros;
            var storedPermitsToSpend = min(requiredPermits, this.storedPermits);
            var freshPermits = requiredPermits - storedPermitsToSpend;

            var waitMicros = storedPermitsToWaitTime(this.storedPermits, storedPermitsToSpend) + freshPermits * stableIntervalMicros;

            this.nextFreeTicketMicros = nextFreeTicketMicros + waitMicros;
            this.storedPermits -= storedPermitsToSpend;

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
        value: function storedPermitsToWaitTime(storedPermits, permitsToTake) {}

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
                this.storedPermits = min(this._maxPermits, this._storedPermits + (nowMicros - nextFreeTicketMicros) / this.stableIntervalMicros);

                nextFreeTicketMicros = this._nextFreeTicketMicros = nowMicros;
            }

            return nextFreeTicketMicros;
        }
    }]);

    return SmoothRateLimiter;
}(RateLimiter);

exports.default = RateLimiter;
//# sourceMappingURL=RateLimiter.js.map