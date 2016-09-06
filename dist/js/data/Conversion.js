"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _Stopwatch = require("../Stopwatch");

var _Stopwatch2 = _interopRequireDefault(_Stopwatch);

var _Converter = require("./Converter");

var _Converter2 = _interopRequireDefault(_Converter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Conversion = function (_CoreObject) {
    _inherits(Conversion, _CoreObject);

    /**
     *
     * @param {Object} options
     * @param {*} options.input
     * @param {*} options.output
     * @param {Number} options.duration
     * @param {Stopwatch} options.stopwatch
     * @param {Converter} options.converter
     */
    function Conversion(options) {
        _classCallCheck(this, Conversion);

        var input = _Utility2.default.take(options, 'input', true);
        var output = _Utility2.default.take(options, 'output', true);

        var stopwatch = _Utility2.default.take(options, 'stopwatch', _Stopwatch2.default, true);
        var converter = _Utility2.default.take(options, 'converter', _Converter2.default, true);
        var requestor = _Utility2.default.take(options, 'requestor');

        var _this = _possibleConstructorReturn(this, (Conversion.__proto__ || Object.getPrototypeOf(Conversion)).apply(this, arguments));

        _this._input = input;
        _this._output = output;

        _this._stopwatch = stopwatch;
        _this._converter = converter;
        _this._requestor = requestor;
        return _this;
    }

    /**
     *
     * @return {Stopwatch}
     */


    _createClass(Conversion, [{
        key: "valueOf",


        /**
         *
         * @return {*}
         */
        value: function valueOf() {
            if (_Utility2.default.isNullOrUndefined(output)) {
                return null;
            }

            if (this.output.valueOf) {
                return this.output.valueOf();
            } else {
                return this.output;
            }
        }

        /**
         * @return {String}
         */

    }, {
        key: "toString",
        value: function toString() {
            return "Conversion{ input:'" + this.input + "', output:'" + this.output + "' }";
        }

        /**
         *
         * @return {String}
         */

    }, {
        key: "stopwatch",
        get: function get() {
            return this._stopwatch;
        }

        /**
         * @returns {*|undefined}
         */

    }, {
        key: "requestor",
        get: function get() {
            return this._requestor;
        }

        /**
         * @returns {*}
         */

    }, {
        key: "input",
        get: function get() {
            return this._input;
        }

        /**
         * @returns {*}
         */

    }, {
        key: "output",
        get: function get() {
            return this._output;
        }

        /**
         * @returns {Converter}
         */

    }, {
        key: "converter",
        get: function get() {
            return this._converter;
        }
    }], [{
        key: "toString",
        value: function toString() {
            return 'Conversion';
        }
    }]);

    return Conversion;
}(_CoreObject3.default);

exports.default = Conversion;
//# sourceMappingURL=Conversion.js.map