'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preconditions = require('preconditions');

var _preconditions2 = _interopRequireDefault(_preconditions);

var _NotificationBuilder = require('./NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotificationTemplate = function () {
    function NotificationTemplate(options) {
        _classCallCheck(this, NotificationTemplate);

        _lodash2.default.assign(this, options);

        this.$ = _preconditions2.default.singleton();
        this.$.shouldBeString(this.name, 'You must define a name for this template');
    }

    /**
     *
     * @param {NotificationBuilder} notificationBuilder
     * @param {Object} data
     * @return {NotificationBuilder}
     */


    _createClass(NotificationTemplate, [{
        key: 'applyToNotificationBuilder',
        value: function applyToNotificationBuilder(notificationBuilder, data) {

            if (_lodash2.default.isObject(this.payload)) {
                notificationBuilder.mergeIntoPayload(this.payload);
            }

            if (_lodash2.default.isObject(data)) {
                notificationBuilder.mergeIntoPayload(data);
            }

            // The default implementation
            // This is where you would modify your builder.
            return notificationBuilder;
        }
    }]);

    return NotificationTemplate;
}();

exports.default = NotificationTemplate;