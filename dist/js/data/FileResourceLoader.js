"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileResourceLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require("../Utility");

var _Utility2 = _interopRequireDefault(_Utility);

var _urijs = require("urijs");

var _urijs2 = _interopRequireDefault(_urijs);

var _Preconditions = require("../Preconditions");

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _osenv = require("osenv");

var _osenv2 = _interopRequireDefault(_osenv);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cache = require("../cache");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _ResourceLoader2 = require("./ResourceLoader");

var _ResourceLoader3 = _interopRequireDefault(_ResourceLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileResourceLoader = function (_ResourceLoader) {
    _inherits(FileResourceLoader, _ResourceLoader);

    //region constructor
    /**
     *
     * @param {Object} [options]
     * @param {Cache} [options.cache]
     * @param {String|URI} [options.path] defaults to osenv.tempdir()
     */
    function FileResourceLoader(options) {
        _classCallCheck(this, FileResourceLoader);

        //region let path
        /** @type {URI} */
        var path = _Utility2.default.take(options, 'path', {
            required: true,
            adapter: function adapter(value) {
                if (!value) {
                    value = (0, _urijs2.default)(_osenv2.default.tmpdir());
                }

                return _Utility2.default.getPath(value);
            },
            validator: function validator(value) {
                _Preconditions2.default.shouldBeInstanceOf(value, _urijs2.default, 'uri');
            }
        });
        //endregion

        var _this = _possibleConstructorReturn(this, (FileResourceLoader.__proto__ || Object.getPrototypeOf(FileResourceLoader)).call(this, options));

        _this._path = path;

        _this._startedLatch = _bluebird2.default.resolve();
        return _this;
    }

    //endregion

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {URI}
     * @return {URI}
     */


    _createClass(FileResourceLoader, [{
        key: "load",


        //endregion

        /**
         * @param {String|URI} path
         * @returns {Promise}
         */
        value: function load(path) {
            var baseUri = this.path;

            return _bluebird2.default.resolve().then(function () {
                return _Utility2.default.getPath({
                    baseUri: baseUri,
                    uri: path
                });
            }).then(function ( /** @type {String} */path) {
                path = path.toString();

                return _bluebird2.default.fromNode(function (callback) {
                    _fs2.default.readFile(path, callback);
                });
            });
        }
    }, {
        key: "path",
        get: function get() {
            return this._path;
        }
    }]);

    return FileResourceLoader;
}(_ResourceLoader3.default);

exports.FileResourceLoader = FileResourceLoader;
exports.default = FileResourceLoader;
//# sourceMappingURL=FileResourceLoader.js.map