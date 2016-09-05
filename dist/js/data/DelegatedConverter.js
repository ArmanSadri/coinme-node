'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DelegatedConverter = exports.CoreObjectAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject = require("../CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _Adapter2 = require("./Adapter");

var _Adapter3 = _interopRequireDefault(_Adapter2);

var _Converter2 = require("./Converter");

var _Converter3 = _interopRequireDefault(_Converter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//region class CoreObjectAdapter
/**
 * Internal class used by DelegatedConverter
 *
 * @private
 */
var CoreObjectAdapter = function (_Adapter) {
    _inherits(CoreObjectAdapter, _Adapter);

    function CoreObjectAdapter() {
        _classCallCheck(this, CoreObjectAdapter);

        return _possibleConstructorReturn(this, (CoreObjectAdapter.__proto__ || Object.getPrototypeOf(CoreObjectAdapter)).apply(this, arguments));
    }

    _createClass(CoreObjectAdapter, [{
        key: "supports",


        /**
         *
         * @param {CoreObject|Class<CoreObject>} instanceOrClass
         */
        value: function supports(instanceOrClass) {
            return _CoreObject2.default.isInstanceOrClass(instanceOrClass);
        }

        /**
         * @param {CoreObject|*} instance
         * @returns {*}
         */

    }, {
        key: "adapt",
        value: function adapt(instance) {
            this.shouldSupport(instance);

            return instance.toClass();
        }
    }]);

    return CoreObjectAdapter;
}(_Adapter3.default);
//endregion

/**
 * Supports different conversion directions.
 *
 * This is not tied to money. It supports simple converting.
 *
 * {<br>
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },<br>
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }<br>
 * }<br>
 *
 * @class
 */


var DelegatedConverter = function (_Converter) {
    _inherits(DelegatedConverter, _Converter);

    //region constructor
    /**
     * @param {Object} options
     * @param {Object} options.conversions
     * @param {Adapter} [options.adapter]
     */
    function DelegatedConverter(options) {
        _classCallCheck(this, DelegatedConverter);

        var adapter = _Utility2.default.take(options, 'adapter', {
            type: _Adapter3.default,
            defaultValue: new CoreObjectAdapter()
        });

        var conversions = _Utility2.default.take(options, 'conversions', true);

        /**
         * @type {Object}
         * @private
         */
        var _this2 = _possibleConstructorReturn(this, (DelegatedConverter.__proto__ || Object.getPrototypeOf(DelegatedConverter)).apply(this, arguments));

        _this2._conversions = conversions || {};

        /**
         * @type {Adapter}
         */
        _this2._adapter = adapter;
        return _this2;
    }
    //endregion

    //region properties
    /**
     * @return {Adapter}
     */


    _createClass(DelegatedConverter, [{
        key: "supports",


        //endregion

        /**
         * @param instance
         * @param clazz
         * @return {boolean}
         */
        value: function supports(instance, clazz) {
            var adapter = this.adapter;

            if (!adapter.supports(instance) || !adapter.supports(clazz)) {
                return false;
            }

            var fn = this.getConversion(instance, clazz);

            return _Utility2.default.isFunction(fn);
        }

        /**
         * Executes the conversion.
         *
         * @param {CoreObject|*} input
         * @param {Class<CoreObject>|Class|*} outputClass
         * @returns {*}
         *
         * @throws {PreconditionsError} if the converter fails to convert into a valid number
         * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
         * @throws {PreconditionsError} if converter cannot support the conversion
         */

    }, {
        key: "convert",
        value: function convert(input, outputClass) {
            var fn = this.getConversion(input, outputClass);

            return fn.call(this, input, outputClass);
        }

        /**
         * Detects the conversion function, given the inputs.
         *
         * @param {Class<CoreObject>|Class|*} input
         * @param {Class<CoreObject>|Class|*} output
         *
         * @returns {Function|undefined}
         */

    }, {
        key: "getConversion",
        value: function getConversion(input, output) {
            /**
             * @type {String}
             */
            var conversionName = this.getConversionName(input, output);

            return _Preconditions2.default.shouldBeFunction(this._conversions[conversionName], "Converter not found for " + conversionName);
        }

        /**
         *
         * @param {*} input
         * @param {*} output
         * @returns {Function}
         */

    }, {
        key: "optConversion",
        value: function optConversion(input, output) {
            var conversionName = this.optConversionName(input, output);

            return this._conversions[conversionName];
        }

        /**
         *
         * @param {Class<CoreObject>|Class|*} input
         * @param {Class<CoreObject>|Class|*} output
         * @private
         * @return {string}
         */

    }, {
        key: "getConversionName",
        value: function getConversionName(input, output) {
            _Preconditions2.default.shouldBeDefined(input, 'param:input');
            _Preconditions2.default.shouldBeDefined(output, 'param:output');

            var adapter = this.adapter;

            input = _Preconditions2.default.shouldBeClass(adapter.adapt(input), 'inputClass must be a class');
            output = _Preconditions2.default.shouldBeClass(adapter.adapt(output), 'outputClass must be a class');

            return _Preconditions2.default.shouldNotBeBlank(this.optConversionName(input, output));
        }

        /**
         * @param {*} input
         * @param {*} output
         * @return {string}
         */

    }, {
        key: "optConversionName",
        value: function optConversionName(input, output) {
            if (!input) {
                input = '';
            }

            if (!output) {
                output = '';
            }

            return input.toString() + "->" + output.toString();
        }
    }, {
        key: "adapter",
        get: function get() {
            return this._adapter;
        }
    }]);

    return DelegatedConverter;
}(_Converter3.default);

exports.CoreObjectAdapter = CoreObjectAdapter;
exports.DelegatedConverter = DelegatedConverter;
exports.default = DelegatedConverter;
//# sourceMappingURL=DelegatedConverter.js.map