"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Identity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CoreObject2 = require("../CoreObject");

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _Address = require("../Address");

var _Address2 = _interopRequireDefault(_Address);

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This class represents a User pointer.
 *
 * One user could possibly have more than 1 identity associated with them.
 *
 * It is best to use a Natural Key for an Identity
 */

var Identity = function (_CoreObject) {
    _inherits(Identity, _CoreObject);

    /**
     *
     * @param {String|URI|{address:Address, attributes?:Object}} options
     */

    function Identity(options) {
        _classCallCheck(this, Identity);

        var address = void 0;
        var attributes = {};

        if (_Utility2.default.isObject(options)) {
            address = _Utility2.default.take(options, 'address');
            attributes = _Utility2.default.take(options, 'attributes', 'object');
        } else {
            address = _Address2.default.toAddressWithDefaultScheme(options, 'identity');
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Identity).apply(this, arguments));

        _this._address = _Address2.default.shouldBeInstance(address, 'address is required');
        _this._attributes = attributes; // this is optional
        return _this;
    }

    /**
     *
     * @return {Address}
     */


    _createClass(Identity, [{
        key: "toString",
        value: function toString() {
            /** @type {URI} */
            var uri = this.address.uri.clone();

            _lodash2.default.each(this.attributes || {}, function (value, key) {
                uri = uri.addSearch(key, value);
            });

            return uri.toString();
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return _get(Object.getPrototypeOf(Identity.prototype), "toJson", this).call(this, {
                address: this.toString()
            });
        }
    }, {
        key: "address",
        get: function get() {
            return this._address;
        }

        /**
         * Optional attributes
         *
         * @return {Object}
         */

    }, {
        key: "attributes",
        get: function get() {
            return this._attributes;
        }
    }]);

    return Identity;
}(_CoreObject3.default);

exports.Identity = Identity;
exports.default = Identity;
//# sourceMappingURL=Identity.js.map