"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CoreObject2 = require("./../../../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _User = require("./../../../data/User");

var _User2 = _interopRequireDefault(_User);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SPEC_VERSION_8 = {
    'DBA': 'expirationDate',
    'DAC': 'firstName',
    'DCS': 'lastName',
    'DAD': 'middleName',
    'DBB': 'birthDate',
    'DCB': 'gender',
    'DAG': 'addressLine1',
    'DAH': 'addressLine2',
    'DAI': 'addressCity',
    'DAJ': 'addressState',
    'DAK': 'addressZipcode',
    'DAQ': 'username',
    'DCG': 'addressCountry',
    'DCL': 'race'
};

var UserBuilder = function (_CoreObject) {
    _inherits(UserBuilder, _CoreObject);

    function UserBuilder() {
        _classCallCheck(this, UserBuilder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(UserBuilder).apply(this, arguments));
    }

    _createClass(UserBuilder, null, [{
        key: "fromVersion8",


        /**
         *
         * @param {Object} options
         * @param {String} options.DBA expirationDate
         * @param {String} options.DAC firstName
         * @param {String} options.DCS lastName
         * @param {String} options.DAD middleName
         * @param {String} options.DBB birthDate
         * @param {String} options.DCB gender
         * @param {String} options.DAG addressLine1
         * @param {String} options.DAH addressLine2
         * @param {String} options.DAI addressCity
         * @param {String} options.DAJ addressState
         * @param {String} options.DAK addressZipcode
         * @param {String} options.DAQ username
         * @param {String} options.DCG addressCountry
         * @param {String} options.DCL race
         *
         * @returns {User}
         */
        value: function fromVersion8(options) {
            return UserBuilder.fromSpec(UserBuilder.SPEC_VERSION_8, options);
        }
    }, {
        key: "fromSpec",
        value: function fromSpec(spec, options) {
            var object = {};

            _lodash2.default.forEach(spec, function (value, key) {
                object[value] = options[key];
            });

            return new _User2.default(object);
        }
    }, {
        key: "SPEC_VERSION_8",
        get: function get() {
            return SPEC_VERSION_8;
        }
    }]);

    return UserBuilder;
}(_CoreObject3.default);

exports.default = UserBuilder;
module.exports = exports['default'];
//# sourceMappingURL=UserBuilder.js.map