'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _CoreObject2 = require('./CoreObject');

var _CoreObject3 = _interopRequireDefault(_CoreObject2);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A class for uniquely identifying something.
 */

var Address = function (_CoreObject) {
    _inherits(Address, _CoreObject);

    function Address(options) {
        _classCallCheck(this, Address);

        if (_Utility2.default.isString(options)) {
            var string = options;
            options = { value: string };
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Address).call(this, options));

        var uri = (0, _urijs2.default)(options.value);

        _this._scheme = uri.scheme();
        return _this;
    }

    _createClass(Address, [{
        key: 'toString',
        value: function toString() {}
    }, {
        key: 'valueOf',
        value: function valueOf() {}
    }], [{
        key: 'toString',
        value: function toString() {}
    }]);

    return Address;
}(_CoreObject3.default);

exports.default = Address;
module.exports = exports['default'];
//# sourceMappingURL=Address.js.map