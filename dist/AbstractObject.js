'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var AbstractObject =

/**
 *
 * @param {Object} options
 */
function AbstractObject(options) {
    _classCallCheck(this, AbstractObject);

    options = options || {};

    var chosenLodashVersion = options.Lodash || _lodash2.default;

    options = chosenLodashVersion.defaults(options, {
        Preconditions: _preconditions2.default.singleton(),
        Lodash: chosenLodashVersion,
        Logger: _winston2.default,
        Promise: _bluebird2.default
    });

    chosenLodashVersion.assign(this, options);
};

exports.default = AbstractObject;