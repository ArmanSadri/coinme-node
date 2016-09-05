'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Adapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require('../CoreObject');

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Errors = require('../errors/Errors');

var _Errors2 = _interopRequireDefault(_Errors);

var _NotImplementedError = require('../errors/NotImplementedError');

var _NotImplementedError2 = _interopRequireDefault(_NotImplementedError);

var _Preconditions = require('../Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Adapter = function (_CoreObject) {
    _inherits(Adapter, _CoreObject);

    function Adapter() {
        _classCallCheck(this, Adapter);

        return _possibleConstructorReturn(this, (Adapter.__proto__ || Object.getPrototypeOf(Adapter)).apply(this, arguments));
    }

    _createClass(Adapter, [{
        key: 'supports',


        /**
         *
         * @param {CoreObject|Class<CoreObject>} instanceOrClass
         */
        value: function supports(instanceOrClass) {
            throw new _NotImplementedError2.default();
        }

        /**
         * @param {CoreObject|*} instance
         * @returns {*}
         */

    }, {
        key: 'adapt',
        value: function adapt(instance) {
            throw new _NotImplementedError2.default();
        }

        /**
         *
         * @param {CoreObject|Class|Class<CoreObject>|*} instanceOrClass
         * @throws {PreconditionsError} if the instanceOrClass is not supported.
         * @return {*}
         */

    }, {
        key: 'shouldSupport',
        value: function shouldSupport(instanceOrClass) {
            if (!this.supports(instanceOrClass)) {
                _Preconditions2.default.fail(true, false, 'Do not support ' + instanceOrClass);
            }

            return instanceOrClass;
        }

        /**
         *
         * @return {Function}
         */

    }, {
        key: 'toFunction',
        value: function toFunction() {
            var self = this;

            return function () {
                return self.adapt.apply(self, arguments);
            };
        }
    }]);

    return Adapter;
}(_CoreObject3.default);

exports.Adapter = Adapter;
exports.default = Adapter;
//# sourceMappingURL=Adapter.js.map