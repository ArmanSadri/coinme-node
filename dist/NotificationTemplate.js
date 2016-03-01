'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NotificationBuilder = require('./NotificationBuilder');

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

var _AbstractObject2 = require('./AbstractObject');

var _AbstractObject3 = _interopRequireDefault(_AbstractObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationTemplate = function (_AbstractObject) {
    _inherits(NotificationTemplate, _AbstractObject);

    function NotificationTemplate(options) {
        _classCallCheck(this, NotificationTemplate);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationTemplate).call(this, options));

        _this.Lodash.defaults(_this, {
            name: 'NotificationTemplate'
        });

        _this.Preconditions.shouldBeString(_this.name, 'You must define a name for this template');
        return _this;
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
            if (this.Lodash.isObject(this.payload)) {
                notificationBuilder.mergeIntoPayload(this.payload);
            }

            if (this.Lodash.isObject(data)) {
                notificationBuilder.mergeIntoPayload(data);
            }

            // The default implementation
            // This is where you would modify your builder.
            return notificationBuilder;
        }
    }]);

    return NotificationTemplate;
}(_AbstractObject3.default);

exports.default = NotificationTemplate;