'use strict';

/**
 * This class should contain all of our reusable functions
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Functions = function () {
  function Functions() {
    _classCallCheck(this, Functions);
  }

  _createClass(Functions, null, [{
    key: 'identity',


    /**
     * Returns the current scope that you're calling from.
     *
     * @returns {Functions}
     */
    value: function identity() {
      return this;
    }

    /**
     * Always returns true
     *
     * @returns {boolean} true
     */

  }, {
    key: 'yes',
    value: function yes() {
      return true;
    }

    /**
     * Always returns false
     *
     * @returns {boolean} false
     */

  }, {
    key: 'no',
    value: function no() {
      return false;
    }
  }]);

  return Functions;
}();

exports.default = Functions;
module.exports = exports['default'];
//# sourceMappingURL=Functions.js.map