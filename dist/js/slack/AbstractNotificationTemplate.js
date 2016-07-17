'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _CoreObject2 = require("./../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _NotificationBuilder = require("./NotificationBuilder");

var _NotificationBuilder2 = _interopRequireDefault(_NotificationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * This class is intended to be instantiated early and (generally) once in your app.
 */

var AbstractNotificationTemplate = function (_CoreObject) {
    _inherits(AbstractNotificationTemplate, _CoreObject);

    function AbstractNotificationTemplate() {
        _classCallCheck(this, AbstractNotificationTemplate);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractNotificationTemplate).apply(this, arguments));

        // Utility.defaults(this, {
        //     name: 'NotificationTemplate'
        // });

        // Preconditions.shouldBeString(Ember.get(this, 'name'), 'You must define a name for this template');
    }

    /**
     * @public
     * @param {NotificationBuilder} builder
     * @param {*|undefined} data
     * @returns {Promise}
     */


    _createClass(AbstractNotificationTemplate, [{
        key: "render",
        value: function render(builder, data) {
            // Apply the template. Might be a promise though.
            var result = this.applyTemplate(builder, data);

            result = result || builder;

            return Promise.resolve(result);
        }

        /**
         *
         * @protected
         * @param {NotificationBuilder} builder
         * @param {Object} data
         * @return {Promise|NotificationBuilder|Object}
         */

    }, {
        key: "applyTemplate",
        value: function applyTemplate(builder, data) {
            _winston2.default.silly('Builder', builder);
            _winston2.default.silly('Data', data);

            throw new Error('This method must be overridden by a subclass');
        }
    }]);

    return AbstractNotificationTemplate;
}(_CoreObject3.default);

exports.default = AbstractNotificationTemplate;
module.exports = exports['default'];
//# sourceMappingURL=AbstractNotificationTemplate.js.map