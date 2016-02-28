'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotificationService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preconditions = require('preconditions');

var _preconditions2 = _interopRequireDefault(_preconditions);

var _NotificationTemplate = require('./NotificationTemplate');

var _NotificationTemplate2 = _interopRequireDefault(_NotificationTemplate);

var _NotificationBuilder = require('./NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = _preconditions2.default.singleton();

var NotificationService = function () {

    /**
     *
     * @param {Object} options
     */

    function NotificationService(options) {
        _classCallCheck(this, NotificationService);

        _lodash2.default.assign(this, options);

        this.$ = _preconditions2.default.singleton();

        if (!this.templates) {
            this.templates = {};
        }

        if (!this.mappings) {
            this.mappings = {};
        }

        this.registerTemplate('DEFAULT_TYPE', new _NotificationTemplate2.default({
            name: 'DEFAULT_TEMPLATE'
        }));
    }

    /**
     *
     * @param {String} notificationType
     * @param {NotificationTemplate} notificationTemplate
     * @return {NotificationService}
     */


    _createClass(NotificationService, [{
        key: 'registerTemplate',
        value: function registerTemplate(notificationType, notificationTemplate) {
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
        key: 'notificationBuilder',
        value: function notificationBuilder(notificationType, data) {
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

            this.$.shouldBeDefined(notificationTemplate, 'Notification template not found for ' + notificationType);

            var builder = new _NotificationBuilder2.default({
                url: this.url
            });

            return notificationTemplate.applyToNotificationBuilder(builder, data);
        }

        /**
         *
         * @param {String} type
         * @param {Object} data
         * @return {Promise}
         */

    }, {
        key: 'notify',
        value: function notify(type, data) {
            this.$.shouldBeString(type, 'NotificationService.notify(type, data): type must be string.');
            this.$.shouldBeDefined(data, 'NotificationService.notify(type, data): data must be defined.');

            var url = this.url;
            var builder = this.notificationBuilder(type, data);

            this.$.shouldBeDefined(builder, 'No builder for ' + type);

            this.$.shouldBeString(url || builder.url, '');

            if (!builder.url) {
                builder.url = url;
            }

            return builder.execute();
        }
    }]);

    return NotificationService;
}();

exports.NotificationService = NotificationService;
exports.default = new NotificationService({});