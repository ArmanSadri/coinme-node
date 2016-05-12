'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _CoreObject2 = require("/Users/msmyers/projects/coinme/coinme-node/src/js/CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */

var User = function (_CoreObject) {
    _inherits(User, _CoreObject);

    /**
     *
     * @param {Object} config
     * @param {String} config.phoneNumber
     * @param {String} config.username
     * @param {String} config.firstName
     * @param {String} config.middleName
     * @param {String} config.lastName
     * @param {String} config.race
     * @param {String} config.gender
     * @param {String} config.addressLine1
     * @param {String} config.addressLine2
     * @param {String} config.addressCity
     * @param {String} config.addressState
     * @param {String} config.addressZipcode
     * @param {String} config.addressCountry
     * @param {String} config.birthDate
     * @param {String} config.expirationDate
     */

    function User(config) {
        _classCallCheck(this, User);

        /** @type {String} */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(User).call(this, config));

        _this.firstName = config.firstName;

        /** @type {String} */
        _this.lastName = config.lastName;

        /** @type {String} */
        _this.middleName = config.middleName;

        /** @type {String} */
        _this.addressLine1 = config.addressLine1;

        /** @type {String} */
        _this.addressLine2 = config.addressLine2;

        /** @type {String} */
        _this.addressCity = config.addressCity;

        /** @type {String} */
        _this.addressState = config.addressState;

        /** @type {String} */
        _this.addressCountry = config.addressCountry;

        /** @type {String} */
        _this.expirationDate = config.expirationDate;

        /** @type {String} */
        _this.birthDate = config.birthDate;

        /** @type {String} */
        _this.gender = config.gender;

        /** @type {String} */
        _this.race = config.race;

        /** @type {String} */
        _this.addressZipcode = config.addressZipcode;

        /** @type {String} */
        _this.username = config.username;

        /** @type {String} */
        _this.phoneNumber = config.phoneNumber;
        return _this;
    }

    return User;
}(_CoreObject3.default);

exports.default = User;
module.exports = exports['default'];
//# sourceMappingURL=User.js.map