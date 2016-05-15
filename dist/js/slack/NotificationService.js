'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotificationService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _index = require('lodash/index');

var _index2 = _interopRequireDefault(_index);

var _Preconditions = require('./../../../Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _NotificationTemplate = require('./NotificationTemplate');

var _NotificationTemplate2 = _interopRequireDefault(_NotificationTemplate);

var _NotificationBuilder = require('./NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

var _CoreObject = require('./../../../CoreObject');

var _CoreObject2 = _interopRequireDefault(_CoreObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationService = function (_AbstractObject) {
    _inherits(NotificationService, _AbstractObject);

    /**
     *
     * @param {Object} options
     */

    function NotificationService(options) {
        _classCallCheck(this, NotificationService);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationService).call(this, options));

        if (!_this.templates) {
            _this.templates = {};
        }

        if (!_this.mappings) {
            _this.mappings = {};
        }

        _this.register('DEFAULT_TYPE', new _NotificationTemplate2.default({
            name: 'DEFAULT_TEMPLATE'
        }));

        _this.payload = {};
        return _this;
    }

    _createClass(NotificationService, [{
        key: 'mergeIntoPayload',
        value: function mergeIntoPayload(payload) {
            _Preconditions2.default.shouldBeObject(payload, 'Payload must be object');
            _index2.default.assign(this.payload, payload);
        }

        /**
         *
         * @param {String} notificationType
         * @param {NotificationTemplate} notificationTemplate
         * @return {NotificationService}
         */

    }, {
        key: 'register',
        value: function register(notificationType, notificationTemplate) {
            _Preconditions2.default.shouldBeString(notificationType, 'notificationType must be string');
            _Preconditions2.default.shouldBeObject(notificationTemplate, 'notificationTemplate must be an object');

            if (!(notificationTemplate instanceof _NotificationTemplate2.default)) {
                var options = notificationTemplate;

                notificationTemplate = new _NotificationTemplate2.default(options);
            }

            this.mappings[notificationType] = notificationTemplate.name;
            this.templates[notificationTemplate.name] = notificationTemplate;

            return this;
        }
    }, {
        key: 'builder',
        value: function builder() {
            var builder = new _NotificationBuilder2.default({
                url: this.url
            });

            if (this.payload) {
                builder.mergeIntoPayload(this.payload);
            }

            return builder;
        }
    }, {
        key: 'notificationTemplate',
        value: function notificationTemplate(notificationType) {
            var notificationTemplateName = this.mappings[notificationType];
            var notificationTemplate = this.templates[notificationTemplateName];

            _Preconditions2.default.shouldBeDefined(notificationTemplate, 'Notification template not found for ' + notificationType);

            return notificationTemplate;
        }

        /**
         *
         * @param {String} type
         * @param {*|undefined} data
         * @return {Promise}
         */

    }, {
        key: 'notify',
        value: function notify(type, data) {
            _Preconditions2.default.shouldBeString(type, 'NotificationService.notify(type, data): type must be string.');
            //this.Preconditions.shouldBeDefined(data, 'NotificationService.notify(type, data): data must be defined.');
            data = data || {};

            var url = this.url;
            var scope = this;

            var notificationTemplate = this.notificationTemplate(type);
            var builder = this.builder();
            var promise = notificationTemplate.render(builder, data);

            return promise.then(function (builder) {
                // Let's sanity the builder before executing.

                _Preconditions2.default.shouldBeDefined(builder, 'No builder for ' + type);

                if (!builder.url) {
                    builder.url = url;
                }

                var payload = builder.payload;

                _Preconditions2.default.shouldBeString(builder.url, 'NotificationService.notify(): builder.url was undefined');
                // Attachments without top level text are valid.
                //Preconditions.shouldBeString(payload.text, 'builder did not complete \'text\' property. ' + JSON.stringify(payload));

                return builder.execute();
            });
        }
    }]);

    return NotificationService;
}(_CoreObject2.default);

exports.NotificationService = NotificationService;
exports.default = new NotificationService({});
//# sourceMappingURL=NotificationService.js.map