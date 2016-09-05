"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LocalFileCache = exports.Cache = undefined;

var _Cache = require("./Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _LocalFileCache = require("./LocalFileCache");

var _LocalFileCache2 = _interopRequireDefault(_LocalFileCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Cache = _Cache2.default;
exports.LocalFileCache = _LocalFileCache2.default;
exports.default = {
    Cache: _Cache2.default,
    LocalFileCache: _LocalFileCache2.default
};
//# sourceMappingURL=index.js.map