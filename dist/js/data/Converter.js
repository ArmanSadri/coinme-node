'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Converter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _NotImplementedError = require("../errors/NotImplementedError");

var _NotImplementedError2 = _interopRequireDefault(_NotImplementedError);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _Adapter2 = require("./Adapter");

var _Adapter3 = _interopRequireDefault(_Adapter2);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConverterAdapter = function (_Adapter) {
    _inherits(ConverterAdapter, _Adapter);

    /**
     *
     * @param {Object} options
     * @param {Converter} options.converter
     * @param {Class|Class<CoreObject>|*} options.outputClass
     */

    function ConverterAdapter(options) {
        _classCallCheck(this, ConverterAdapter);

        var converter = _Utility2.default.take(options, 'converter', true);
        var outputClass = _Utility2.default.take(options, 'outputClass', true);
        var inputClass = _Utility2.default.take(options, 'inputClass', false);

        /**
         * @type {Converter}
         * @private
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConverterAdapter).apply(this, arguments));

        _this._converter = converter;
        _this._outputClass = outputClass;
        _this._inputClass = inputClass;
        return _this;
    }

    //region Properties

    /**
     *
     * @return {Class<CoreObject>|Class}
     */


    _createClass(ConverterAdapter, [{
        key: "supports",

        //endregion

        /**
         *
         * @param {CoreObject|Class<CoreObject>} instanceOrClass
         * @return {boolean}
         */
        value: function supports(instanceOrClass) {
            return this.converter.supports(instanceOrClass, this.outputClass);
        }

        /**
         *
         * @param {CoreObject|*} instance
         * @return {CoreObject|*}
         */

    }, {
        key: "adapt",
        value: function adapt(instance) {
            if (this.inputClass) {
                _Preconditions2.default.shouldBeClass(_Utility2.default.getClass(instance), this.inputClass);
            }

            return this.converter.convert(instance, this.outputClass);
        }
    }, {
        key: "outputClass",
        get: function get() {
            return this._outputClass;
        }

        /**
         *
         * @return {Class<CoreObject>|Class}
         */

    }, {
        key: "inputClass",
        get: function get() {
            return this._inputClass;
        }

        /**
         * @return {Converter}
         */

    }, {
        key: "converter",
        get: function get() {
            return this._converter;
        }
    }]);

    return ConverterAdapter;
}(_Adapter3.default);

var Converter = function (_CoreObject) {
    _inherits(Converter, _CoreObject);

    function Converter() {
        _classCallCheck(this, Converter);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Converter).apply(this, arguments));
    }

    _createClass(Converter, [{
        key: "supports",


        /**
         * Determines if this Converter instance can convert between the two currencies.
         *
         * NOTE: The direction matters.
         *
         * @param {CoreObject|Class<CoreObject>|*} instanceOrClass
         * @param {Class<CoreObject>|*} clazz
         * @returns {boolean}
         */
        value: function supports(instanceOrClass, clazz) {
            throw new _NotImplementedError2.default();
        }
    }, {
        key: "shouldSupport",
        value: function shouldSupport(instance, clazz) {
            if (!this.supports(instance, clazz)) {
                _Preconditions2.default.fail(true, false, "does not support " + instance + "->" + clazz);
            }
        }

        /**
         * @param {CoreObject|*} instance
         * @param {Class<CoreObject>|Class|*} clazz
         * @return {CoreObject|*}
         */

    }, {
        key: "convert",
        value: function convert(instance, clazz) {
            throw new _NotImplementedError2.default();
        }

        /**
         *
         * @param {Class<CoreObject>} options
         * @param {Class<CoreObject>} [options.inputClass]
         * @param {Class<CoreObject>} [options.outputClass]
         * @return {Adapter}
         */

    }, {
        key: "toAdapter",
        value: function toAdapter(options) {
            return new ConverterAdapter({
                converter: this,
                inputClass: options.inputClass,
                outputClass: options.outputClass
            });
        }

        /**
         *
         * @param {Class|Class<CoreObject>} options
         * @param {Class|Class<CoreObject>} [options.inputClass]
         * @param {Class|Class<CoreObject>} [options.outputClass]
         * @return {Function}
         */

    }, {
        key: "toFunction",
        value: function toFunction(options) {
            return this.toAdapter(options).toFunction();
        }
    }]);

    return Converter;
}(_CoreObject3.default);

exports.Converter = Converter;
exports.default = Converter;
//# sourceMappingURL=Converter.js.map