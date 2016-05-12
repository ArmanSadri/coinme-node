'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('lodash/index');

var _index2 = _interopRequireDefault(_index);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _Preconditions = require('/Users/msmyers/projects/coinme/coinme-node/src/js/Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _NotificationBuilder = require('/Users/msmyers/projects/coinme/coinme-node/src/js/slack/NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

var _AbstractNotificationTemplate = require('/Users/msmyers/projects/coinme/coinme-node/src/js/slack/AbstractNotificationTemplate');

var _AbstractNotificationTemplate2 = _interopRequireDefault(_AbstractNotificationTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationTemplate = function (_AbstractNotification) {
    _inherits(NotificationTemplate, _AbstractNotification);

    function NotificationTemplate(options) {
        _classCallCheck(this, NotificationTemplate);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationTemplate).call(this, options));

        _index2.default.defaults(_this, {
            name: 'NotificationTemplate'
        });

        _Preconditions2.default.shouldBeString(_this.name, 'You must define a name for this template');
        return _this;
    }

    /**
     *
     * @param {NotificationBuilder} builder
     * @param {Object} data
     * @return {NotificationBuilder}
     */


    _createClass(NotificationTemplate, [{
        key: 'applyTemplate',
        value: function applyTemplate(builder, data) {
            if (_index2.default.isObject(this.get('payload'))) {
                builder.mergeIntoPayload(this.get('payload'));
            }

            _winston2.default.silly('Data', data);

            // This is actually not useful 'by default'
            // It's useful if you want to do inline stuff, but if we do this in the common base-class,
            // then we are actually prevented from ever using this.super() in subclasses that use strongly
            // typed objects instead of slack formatted json. Since the architecture of this project is to
            // abstract away the slack parts, applying the "data" to the slack payload was a limiting design mistake.
            //
            //if (this.Lodash.isObject(data)) {
            //    notificationBuilder.mergeIntoPayload(data);
            //}

            // The default implementation
            // This is where you would modify your builder.
            return builder;
        }
    }]);

    return NotificationTemplate;
}(_AbstractNotificationTemplate2.default);

exports.default = NotificationTemplate;
module.exports = exports['default'];
//# sourceMappingURL=NotificationTemplate.js.map