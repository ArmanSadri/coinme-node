'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _preconditions = require("preconditions");

var _preconditions2 = _interopRequireDefault(_preconditions);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _CoreObject = require("../CoreObject");

var _CoreObject2 = _interopRequireDefault(_CoreObject);

var _AbstractBuilder2 = require("../slack/AbstractBuilder");

var _AbstractBuilder3 = _interopRequireDefault(_AbstractBuilder2);

var _AttachmentBuilder = require("../slack/AttachmentBuilder");

var _AttachmentBuilder2 = _interopRequireDefault(_AttachmentBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationBuilder = function (_AbstractBuilder) {
    _inherits(NotificationBuilder, _AbstractBuilder);

    function NotificationBuilder(options) {
        _classCallCheck(this, NotificationBuilder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationBuilder).call(this, options));

        // Allow the URL to be defined later.
        //this.Preconditions.shouldBeString(this.url, 'NotificationBuilder.constructor(): url must be a string');
    }

    /**
     *
     * @param {String} value
     * @returns {NotificationBuilder}
     */


    _createClass(NotificationBuilder, [{
        key: "channel",
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
        key: "text",
        value: function text(_text) {
            return this.setString('text', _text);
        }

        /**
         *
         * @param icon
         * @returns {icon}
         */

    }, {
        key: "icon",
        value: function icon(_icon) {
            return this.setString('icon_emoji', _icon);
        }
    }, {
        key: "username",
        value: function username(_username) {
            return this.setString('username', _username);
        }
    }, {
        key: "attachments",
        value: function attachments() {
            return this.getWithDefaultValue('attachments', []);
        }
    }, {
        key: "attachment",
        value: function attachment() {
            return new _AttachmentBuilder2.default(this);
        }
    }, {
        key: "toPayload",
        value: function toPayload() {
            return this.payload;
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this.toPayload());
        }

        /**
         *
         * @return {Promise}
         */

    }, {
        key: "execute",
        value: function execute() {
            var scope = this;

            var url = this.url;
            var payload = this.toPayload();

            scope.Preconditions.shouldBeString(scope.url, 'NotificationBuilder.execute(): url must be a string');

            return _bluebird2.default.resolve().then(function () {
                //
                // https://www.npmjs.com/package/request-promise
                //
                // var options = {
                //    method: 'POST',
                //    uri: 'http://posttestserver.com/post.php',
                //    body: {
                //        some: 'payload'
                //    },
                //    json: true // Automatically stringifies the body to JSON
                // };

                var requestOptions = {
                    uri: url,
                    method: 'POST',
                    body: payload,
                    json: true
                };

                scope.Logger.debug("[SLACK:" + scope.name + "] webhook ", requestOptions);

                return _bluebird2.default.resolve((0, _requestPromise2.default)(requestOptions)).then(function (value) {
                    scope.Logger.debug("[SLACK:" + scope.name + "] webhook succeeded.", arguments);

                    return value;
                }).catch(function (err) {
                    scope.Logger.warn("[SLACK:" + scope.name + "] webhook failed.", arguments);

                    throw err;
                });
            });
        }

        /**
         * Do not insert a Promise into this method.
         *
         * @param {Object|NotificationBuilder} object
         * @param {Object|undefined} deps
         * @param {Preconditions|undefined} deps.Preconditions
         * @return {Promise<NotificationBuilder>}
         */

    }], [{
        key: "innerCast",
        value: function innerCast(object, deps) {
            deps = _CoreObject2.default.toDependencyMap(deps);

            var Preconditions = deps.Preconditions;

            Preconditions.shouldBeDefined(object);

            return _bluebird2.default.resolve(object).then(function (result) {
                Preconditions.shouldBeDefined(object, 'Casted object must be defined.');
                Preconditions.shouldNotBeArray(object, 'Casted object must NOT be an array.');
                Preconditions.shouldBeObject(object, 'Casted object must be an object.');

                if (result instanceof NotificationBuilder) {
                    return result;
                }

                return new NotificationBuilder(object);
            });
        }
    }]);

    return NotificationBuilder;
}(_AbstractBuilder3.default);

exports.default = NotificationBuilder;
module.exports = exports['default'];