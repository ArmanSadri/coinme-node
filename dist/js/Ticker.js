'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ticker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nanotimer = require('nanotimer');

var _nanotimer2 = _interopRequireDefault(_nanotimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @type {Ticker}
 */
var SYSTEM_TICKER;

var Ticker = function () {

    /**
     * Constructor for use by subclasses.
     */

    function Ticker(options) {
        _classCallCheck(this, Ticker);

        this._timer = new _nanotimer2.default();
    }

    /**
     *
     * @return {NanoTimer}
     */


    _createClass(Ticker, [{
        key: 'read',


        /**
         * Returns the number of nanoseconds elapsed since this ticker's fixed
         * point of reference.
         *
         * @return {Number} nanoseconds
         */
        value: function read() {
            var time = process.hrtime();
            var timeInSeconds = time[0];
            var timeInNanos = time[1];

            return _TimeUnit2.default.SECONDS.toNanos(timeInSeconds) + timeInNanos;
        }

        /**
         * Returns a promise that will finish in the given time.
         *
         * @param {Number} value
         * @param {TimeUnit} timeUnit
         * @return {Promise}
         */

    }, {
        key: 'wait',
        value: function wait(value, timeUnit) {
            var scope = this;

            console.log('wait!', value, timeUnit);
            return new _bluebird2.default(function (resolve, reject) {
                var numberOfNanos = _TimeUnit2.default.NANOSECONDS.convert(value, timeUnit);

                //.setTimeout(task, args, timeout, [callback])
                scope.timer.setTimeout(function () {
                    console.log('waited!', value, timeUnit);

                    resolve();
                }, null, numberOfNanos + 'n');
            });
        }

        /**
         * A ticker that reads the current time using nanoseconds.
         *
         * @return {Ticker}
         */

    }, {
        key: 'timer',
        get: function get() {
            return this._timer;
        }
    }], [{
        key: 'systemTicker',
        value: function systemTicker() {
            return SYSTEM_TICKER;
        }
    }]);

    return Ticker;
}();

SYSTEM_TICKER = new Ticker();

exports.Ticker = Ticker;
exports.default = Ticker;
//# sourceMappingURL=Ticker.js.map