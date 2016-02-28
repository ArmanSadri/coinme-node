'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractBuilder2 = require('./AbstractBuilder');

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

var _AttachmentBuilder = require('./AttachmentBuilder');

var _AttachmentBuilder2 = _interopRequireDefault(_AttachmentBuilder);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationBuilder = function (_AbstractBuilder) {
    _inherits(NotificationBuilder, _AbstractBuilder);

    function NotificationBuilder(options) {
        _classCallCheck(this, NotificationBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationBuilder).call(this, options));

        _this.$.shouldBeString(_this.url, 'url');
        return _this;
    }

    /**
     *
     * @param {String} value
     * @returns {NotificationBuilder}
     */


    _createClass(NotificationBuilder, [{
        key: 'channel',
        value: function channel(value) {
            return this.setString('channel', value);
        }

        /**
         *
         *
         * @param text
         * @returns {NotificationBuilder}
         */

    }, {
        key: 'text',
        value: function text(_text) {
            return this.setString('text', _text);
        }

        /**
         *
         * @param icon
         * @returns {icon}
         */

    }, {
        key: 'icon',
        value: function icon(_icon) {
            return this.setString('icon_emoji', _icon);
        }
    }, {
        key: 'username',
        value: function username(_username) {
            return this.setString('username', _username);
        }
    }, {
        key: 'attachments',
        value: function attachments() {
            return this.getWithDefaultValue('attachments', []);
        }
    }, {
        key: 'attachment',
        value: function attachment() {
            return new _AttachmentBuilder2.default(this);
        }
    }, {
        key: 'toObject',
        value: function toObject() {
            return this.payload;
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            return JSON.stringify(this.toObject());
        }

        /**
         *
         * @return {Promise}
         */

    }, {
        key: 'execute',
        value: function execute() {
            //https://www.npmjs.com/package/request-promise
            //var options = {
            //    method: 'POST',
            //    uri: 'http://posttestserver.com/post.php',
            //    body: {
            //        some: 'payload'
            //    },
            //    json: true // Automatically stringifies the body to JSON
            //};

            var object = this.toObject();

            console.log('obj', object);

            return (0, _requestPromise2.default)({
                uri: this.url,
                method: 'POST',
                body: this.toObject(),
                json: true
            });
        }
    }]);

    return NotificationBuilder;
}(_AbstractBuilder3.default);

exports.default = NotificationBuilder;