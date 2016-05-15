'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Preconditions = require("./../../../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _ember = require("./../../../ember");

var _ember2 = _interopRequireDefault(_ember);

var _AbstractBuilder2 = require("./../../../slack/AbstractBuilder");

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

var _FieldBuilder = require("./../../../slack/FieldBuilder");

var _FieldBuilder2 = _interopRequireDefault(_FieldBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttachmentBuilder = function (_AbstractBuilder) {
    _inherits(AttachmentBuilder, _AbstractBuilder);

    function AttachmentBuilder() {
        _classCallCheck(this, AttachmentBuilder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(AttachmentBuilder).apply(this, arguments));
    }

    _createClass(AttachmentBuilder, [{
        key: "init",
        value: function init() {
            _get(Object.getPrototypeOf(AttachmentBuilder.prototype), "init", this).apply(this, arguments);

            this.get('parent').attachments().push(this.get('payload'));

            this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
            this.set('color', 'good');
        }
    }, {
        key: "title",
        value: function title(value) {
            _Preconditions2.default.shouldBeString(value);

            return this.set('title', value);
        }
    }, {
        key: "text",
        value: function text(value) {
            _Preconditions2.default.shouldBeString(value);

            return this.set('text', value);
        }
    }, {
        key: "fields",
        value: function fields() {
            var fields = _ember2.default.getWithDefault(this, 'fields', []);

            _Preconditions2.default.shouldBeArray(fields, 'fields');

            return fields;
        }
    }, {
        key: "color",
        value: function color(_color) {
            _Preconditions2.default.shouldBeString(_color);

            return this.set('color', _color);
        }
    }, {
        key: "field",
        value: function field() {
            return new _FieldBuilder2.default(this).small();
        }
    }]);

    return AttachmentBuilder;
}(_AbstractBuilder3.default);

exports.default = AttachmentBuilder;
module.exports = exports['default'];
//# sourceMappingURL=AttachmentBuilder.js.map