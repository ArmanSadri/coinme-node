"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HttpError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractError2 = require("./AbstractError");

var _AbstractError3 = _interopRequireDefault(_AbstractError2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpError = function (_AbstractError) {
    _inherits(HttpError, _AbstractError);

    /**
     *
     * @param {String|Object} options
     */

    function HttpError(options) {
        _classCallCheck(this, HttpError);

        if (_Utility2.default.isString(options)) {
            var _message = options;

            options = { message: _message };
        }

        /**
         * @type {String}
         */
        var message = _Utility2.default.take(options, 'message', _Utility2.default.isString);

        // optional

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpError).call(this, message));

        _this._statusCode = _Utility2.default.take(options, 'statusCode', _Utility2.default.isNumber);
        _this._properties = _Utility2.default.take(options, 'properties', _Utility2.default.isNotFunction);
        return _this;
    }

    _createClass(HttpError, [{
        key: "toJSON",
        value: function toJSON() {
            return _lodash2.default.assign(_get(Object.getPrototypeOf(HttpError.prototype), "toJSON", this).call(this), {
                statusCode: this.statusCode,
                message: this.message,
                name: this.name,
                properties: this.properties
            });
        }
    }, {
        key: "properties",
        get: function get() {
            return this._properties;
        }

        /**
         * @returns {Number}
         */

    }, {
        key: "statusCode",
        get: function get() {
            return this._statusCode;
        }
    }]);

    return HttpError;
}(_AbstractError3.default);

exports.HttpError = HttpError;
exports.default = HttpError;
//# sourceMappingURL=HttpError.js.map