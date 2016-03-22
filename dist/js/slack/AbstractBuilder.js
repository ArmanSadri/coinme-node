'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject = require('../CoreObject');

var _CoreObject2 = _interopRequireDefault(_CoreObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

var AbstractBuilder = function (_AbstractObject) {
    _inherits(AbstractBuilder, _AbstractObject);

    function AbstractBuilder(options) {
        _classCallCheck(this, AbstractBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractBuilder).call(this, options));

        _this.Lodash.defaults(_this, {
            payload: {}
        });
        return _this;
    }

    /**
     *
     * @param path
     * @return {*}
     * @protected
     */


    _createClass(AbstractBuilder, [{
        key: 'get',
        value: function get(path) {
            if (this.Lodash.isUndefined(path)) {
                return this.payload;
            } else {
                return _Utility2.default.Object.get(this.payload, path);
            }
        }

        /**
         *
         * @param {String} path
         * @param {*} value
         * @return {AbstractBuilder}
         * @protected
         */

    }, {
        key: 'set',
        value: function set(path, value) {
            _Utility2.default.Object.set(this.payload, path, value);

            return this;
        }

        /**
         *
         * @param {String} path
         * @param {String} string
         * @protected
         */

    }, {
        key: 'setString',
        value: function setString(path, string) {
            this.Preconditions.shouldBeString(path, 'path');
            this.Preconditions.shouldBeString(string, 'string');

            return this.set(path, string);
        }

        /**
         * @public
         * @param object
         * @return {AbstractBuilder}
         */

    }, {
        key: 'mergeIntoPayload',
        value: function mergeIntoPayload(object) {
            this.Preconditions.shouldBeDefined(object, 'Cannot merge null');
            this.Preconditions.shouldBeObject(object, 'Should be object');

            this.Lodash.assign(this.payload, object);

            return this;
        }

        /**
         *
         * @param {String} path
         * @param {*} defaultValue
         * @return {*}
         * @public
         */

    }, {
        key: 'getWithDefaultValue',
        value: function getWithDefaultValue(path, defaultValue) {
            return _Utility2.default.Object.getWithDefaultValue(this.payload, path, defaultValue);
        }
    }]);

    return AbstractBuilder;
}(_CoreObject2.default);

exports.default = AbstractBuilder;
module.exports = exports['default'];