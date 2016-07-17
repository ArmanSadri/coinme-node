'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _AbstractBuilder2 = require("../slack/AbstractBuilder");

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

var _FieldBuilder = require("../slack/FieldBuilder");

var _FieldBuilder2 = _interopRequireDefault(_FieldBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttachmentBuilder = function (_AbstractBuilder) {
    _inherits(AttachmentBuilder, _AbstractBuilder);

    /**
     * @param {*} options
     */

    function AttachmentBuilder(options) {
        _classCallCheck(this, AttachmentBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttachmentBuilder).apply(this, arguments));

        _this._fields = [];

        _this.get('parent').attachments().push(_this.get('payload'));

        _this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
        _this.set('color', 'good');
        return _this;
    }

    /**
     *
     * @param {String} value
     * @returns {AttachmentBuilder}
     */


    _createClass(AttachmentBuilder, [{
        key: "title",
        value: function title(value) {
            _Preconditions2.default.shouldBeString(value);

            this.set('title', value);

            return this;
        }

        /**
         *
         * @param color
         * @returns {AttachmentBuilder}
         */

    }, {
        key: "color",
        value: function color(_color) {
            _Preconditions2.default.shouldBeString(_color);

            this.set('color', _color);

            return this;
        }

        /**
         *
         * @param {String} value
         * @returns {AttachmentBuilder}
         */

    }, {
        key: "text",
        value: function text(value) {
            _Preconditions2.default.shouldBeString(value);

            this.set('text', value);

            return this;
        }

        /**
         * @returns {FieldBuilder}
         */

    }, {
        key: "field",
        value: function field() {
            return new _FieldBuilder2.default(this).small();
        }

        /**
         *
         * @returns {[]}
         */

    }, {
        key: "fields",
        value: function fields() {
            return this._fields;
        }
    }]);

    return AttachmentBuilder;
}(_AbstractBuilder3.default);

exports.default = AttachmentBuilder;
module.exports = exports['default'];
//# sourceMappingURL=AttachmentBuilder.js.map