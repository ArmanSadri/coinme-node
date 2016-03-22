'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractBuilder2 = require('../slack/AbstractBuilder');

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldBuilder = function (_AbstractBuilder) {
    _inherits(FieldBuilder, _AbstractBuilder);

    function FieldBuilder(parent) {
        _classCallCheck(this, FieldBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldBuilder).call(this, {
            parent: parent
        }));

        _this.parent.fields().push(_this.payload);
        return _this;
    }

    /**
     * @param {String} value
     * @returns {FieldBuilder}
     */


    _createClass(FieldBuilder, [{
        key: 'title',
        value: function title(value) {
            return this.setString('title', value);
        }

        /**
         * @param {String} value
         * @returns {FieldBuilder}
         */

    }, {
        key: 'text',
        value: function text(value) {
            return this.setString('value', value);
        }

        /**
         *
         * @returns {FieldBuilder}
         */

    }, {
        key: 'small',
        value: function small() {
            return this.set('short', true);
        }

        /**
         *
         * @param {String} stringToAdd
         * @returns {FieldBuilder}
         */

    }, {
        key: 'add',
        value: function add(stringToAdd) {
            var sb = this.get('value');

            {
                sb += '\n' + stringToAdd;
            }

            return this.text(sb);
        }

        /**
         *
         * @param {String} key
         * @param {String} value
         * @returns {FieldBuilder}
         */

    }, {
        key: 'addKeyValuePair',
        value: function addKeyValuePair(key, value) {
            var sb = this.get('value');

            {
                sb += '\n_' + key + ':_ ' + value;
            }

            return this.text(sb);
        }
    }]);

    return FieldBuilder;
}(_AbstractBuilder3.default);

exports.default = FieldBuilder;
module.exports = exports['default'];