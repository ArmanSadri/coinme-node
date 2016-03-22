'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preconditions = require('preconditions');

var _preconditions2 = _interopRequireDefault(_preconditions);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = _preconditions2.default.singleton();

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */

var CoreObject = function () {

    /**
     *
     * @param {Object} options
     */

    function CoreObject(options) {
        _classCallCheck(this, CoreObject);

        options = options || {};

        var chosenLodashVersion = options.Lodash || _lodash2.default;

        options = chosenLodashVersion.defaults(options, {
            Preconditions: $,
            Lodash: chosenLodashVersion,
            Logger: _winston2.default,
            Promise: _bluebird2.default
        });

        chosenLodashVersion.assign(this, options);
    }

    _createClass(CoreObject, [{
        key: 'toDependencyMap',
        value: function toDependencyMap() {
            return CoreObject.toDependencyMap(this);
        }
    }], [{
        key: 'toDependencyMap',
        value: function toDependencyMap(options) {
            options = options || {
                Lodash: _lodash2.default
            };

            var Lodash = options.Lodash;

            return Lodash.defaults(options, {
                Preconditions: $,
                Logger: _winston2.default,
                Promise: _bluebird2.default
            });
        }
    }]);

    return CoreObject;
}();

exports.default = CoreObject;
module.exports = exports['default'];