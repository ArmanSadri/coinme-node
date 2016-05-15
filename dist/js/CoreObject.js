'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ember = require('./../../ember');

var _ember2 = _interopRequireDefault(_ember);

var _Preconditions = require('./../../Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */

var CoreObject = function (_Ember$CoreObject) {
  _inherits(CoreObject, _Ember$CoreObject);

  function CoreObject() {
    _classCallCheck(this, CoreObject);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CoreObject).apply(this, arguments));
  }

  _createClass(CoreObject, [{
    key: 'get',


    /**
     *
     * @param {String} path
     * @returns {*}
     */
    value: function get(path) {
      _Preconditions2.default.shouldBeString(path);

      return _ember2.default.get(this, path);
    }

    /**
     *
     * @param {String} path
     * @param {*} value
     */

  }, {
    key: 'set',
    value: function set(path, value) {
      _Preconditions2.default.shouldBeString(path);

      return _ember2.default.set(this, path, value);
    }
  }]);

  return CoreObject;
}(_ember2.default.CoreObject);

exports.default = CoreObject;
module.exports = exports['default'];
//# sourceMappingURL=CoreObject.js.map