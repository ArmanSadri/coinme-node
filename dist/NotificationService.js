'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotificationService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NotificationTemplate = require('./NotificationTemplate');

var _NotificationTemplate2 = _interopRequireDefault(_NotificationTemplate);

var _NotificationBuilder = require('./NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

var _AbstractObject2 = require('./AbstractObject');

var _AbstractObject3 = _interopRequireDefault(_AbstractObject2);

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
        return _this;
    }

    /**
     *
     * @param {String} notificationType
     * @param {NotificationTemplate} notificationTemplate
     * @return {NotificationService}
     */


    _createClass(NotificationService, [{
        key: 'register',
        value: function register(notificationType, notificationTemplate) {
            this.Preconditions.shouldBeString(notificationType, 'notificationType must be string');
            this.Preconditions.shouldBeObject(notificationTemplate, 'notificationTemplate must be an object');

            if (!(notificationTemplate instanceof _NotificationTemplate2.default)) {
                var options = notificationTemplate;

                notificationTemplate = new _NotificationTemplate2.default(options);
            }

            this.mappings[notificationType] = notificationTemplate.name;
            this.templates[notificationTemplate.name] = notificationTemplate;

            return this;
        }

        /**
         *
         * @param {String} notificationType
         * @param {Object} data
         * @return {NotificationBuilder}
         */

    }, {
        key: 'builder',
        value: function builder(notificationType, data) {
            if (!notificationType) {
                notificationType = 'DEFAULT_TYPE';
            }

            if (!data) {
                data = {
                    // TODO: apply some defaults?
                };
            }

            var notificationTemplateName = this.mappings[notificationType];
            var notificationTemplate = this.templates[notificationTemplateName];

            this.Preconditions.shouldBeDefined(notificationTemplate, 'Notification template not found for ' + notificationType);

            var builder = new _NotificationBuilder2.default({
                url: this.url
            });

            return notificationTemplate.applyToNotificationBuilder(builder, data);
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
            this.Preconditions.shouldBeString(type, 'NotificationService.notify(type, data): type must be string.');
            //this.Preconditions.shouldBeDefined(data, 'NotificationService.notify(type, data): data must be defined.');
            data = data || {};

            var url = this.url;
            var builder = this.builder(type, data);

            this.Preconditions.shouldBeDefined(builder, 'No builder for ' + type);

            this.Preconditions.shouldBeString(url || builder.url, '');

            if (!builder.url) {
                builder.url = url;
            }

            return builder.execute();
        }
    }]);

    return NotificationService;
}(_AbstractObject3.default);

exports.NotificationService = NotificationService;
exports.default = new NotificationService({});