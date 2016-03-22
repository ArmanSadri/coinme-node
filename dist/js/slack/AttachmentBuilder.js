'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractBuilder2 = require('/Users/msmyers/projects/coinme/coinme-node/src/js/slack/AbstractBuilder');

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

var _FieldBuilder = require('/Users/msmyers/projects/coinme/coinme-node/src/js/slack/FieldBuilder');

var _FieldBuilder2 = _interopRequireDefault(_FieldBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttachmentBuilder = function (_AbstractBuilder) {
    _inherits(AttachmentBuilder, _AbstractBuilder);

    function AttachmentBuilder(parent) {
        _classCallCheck(this, AttachmentBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttachmentBuilder).call(this, {
            parent: parent
        }));

        _this.parent.attachments().push(_this.payload);

        _this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
        _this.set('color', 'good');
        return _this;
    }

    _createClass(AttachmentBuilder, [{
        key: 'title',
        value: function title(value) {
            return this.setString('title', value);
        }
    }, {
        key: 'text',
        value: function text(value) {
            return this.setString('text', value);
        }
    }, {
        key: 'fields',
        value: function fields() {
            var fields = this.getWithDefaultValue('fields', []);

            this.Preconditions.shouldBeArray(fields, 'fields');

            return fields;
        }
    }, {
        key: 'color',
        value: function color(_color) {
            return this.setString('color', _color);
        }
    }, {
        key: 'field',
        value: function field() {
            return new _FieldBuilder2.default(this).small();
        }
    }]);

    return AttachmentBuilder;
}(_AbstractBuilder3.default);

exports.default = AttachmentBuilder;
module.exports = exports['default'];