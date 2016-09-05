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

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _NotificationBuilder = require("./NotificationBuilder");

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttachmentBuilder = function (_AbstractBuilder) {
    _inherits(AttachmentBuilder, _AbstractBuilder);

    /**
     *
     * @param {{parent: NotificationBuilder}} options
     */
    function AttachmentBuilder(options) {
        _classCallCheck(this, AttachmentBuilder);

        _Preconditions2.default.shouldBeObject(options, 'AttachmentBuilder constructor requires configuration.');

        /**
         * @type {NotificationBuilder}
         */
        var parent = _Utility2.default.take(options, 'parent', {
            type: _NotificationBuilder2.default,
            required: true
        });

        var _this = _possibleConstructorReturn(this, (AttachmentBuilder.__proto__ || Object.getPrototypeOf(AttachmentBuilder)).call(this, options));

        _this._parent = parent;

        var payload = _Utility2.default.defaults(_this.payload, {
            mrkdwn_in: ['pretext', 'text', 'fields'],
            color: 'good'
        });

        parent.attachments().push(payload);
        return _this;
    }

    /**
     *
     * @returns {AttachmentBuilder}
     */


    _createClass(AttachmentBuilder, [{
        key: "title",


        /**
         *
         * @param {String} value
         * @returns {AttachmentBuilder}
         */
        value: function title(value) {
            _Preconditions2.default.shouldBeString(value);

            return this.mergeIntoPayload({
                title: value
            });
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

            return this.mergeIntoPayload({
                color: _color
            });
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

            return this.mergeIntoPayload({
                text: value
            });
        }

        /**
         * @returns {FieldBuilder}
         */

    }, {
        key: "field",
        value: function field() {
            return new _FieldBuilder2.default({
                parent: this
            }).small();
        }

        /**
         *
         * @returns {[]}
         */

    }, {
        key: "fields",
        value: function fields() {
            var fields = this.get('payload.fields');

            if (!fields) {
                fields = [];

                this.set('payload.fields', fields);
            }

            return fields;
        }
    }, {
        key: "parent",
        get: function get() {
            return this._parent;
        }
    }]);

    return AttachmentBuilder;
}(_AbstractBuilder3.default);

exports.default = AttachmentBuilder;
//# sourceMappingURL=AttachmentBuilder.js.map