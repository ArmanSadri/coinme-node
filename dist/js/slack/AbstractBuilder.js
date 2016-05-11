'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ember = require('/Users/msmyers/projects/coinme/coinme-node/src/js/ember');

var _ember2 = _interopRequireDefault(_ember);

var _Utility = require('/Users/msmyers/projects/coinme/coinme-node/src/js/Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Preconditions = require('/Users/msmyers/projects/coinme/coinme-node/src/js/Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _CoreObject2 = require('/Users/msmyers/projects/coinme/coinme-node/src/js/CoreObject');

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

var AbstractBuilder = function (_CoreObject) {
    _inherits(AbstractBuilder, _CoreObject);

    function AbstractBuilder() {
        _classCallCheck(this, AbstractBuilder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractBuilder).apply(this, arguments));
    }

    _createClass(AbstractBuilder, [{
        key: 'init',
        value: function init() {
            _Utility2.default.defaults(this, {
                name: 'AbstractBuilder',
                payload: {}
            });
        }

        /**
         * @public
         * @param object
         * @return {AbstractBuilder}
         */

    }, {
        key: 'mergeIntoPayload',
        value: function mergeIntoPayload(object) {
            _Preconditions2.default.shouldBeDefined(object, 'Cannot merge null');
            _Preconditions2.default.shouldBeObject(object, 'Should be object');

            _ember2.default.assign(this, {
                payload: object
            });

            return this;
        }
    }]);

    return AbstractBuilder;
}(_CoreObject3.default);

exports.default = AbstractBuilder;
module.exports = exports['default'];
//# sourceMappingURL=AbstractBuilder.js.map