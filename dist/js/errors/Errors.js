'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Errors = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Preconditions = require('../Preconditions');

var _Preconditions2 = _interopRequireDefault(_Preconditions);

var _AbstractError = require('./AbstractError');

var _AbstractError2 = _interopRequireDefault(_AbstractError);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _HttpError = require('./HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
    message: 'Unknown Error',
    properties: {}
};

var Errors = function () {
    function Errors() {
        _classCallCheck(this, Errors);
    }

    _createClass(Errors, null, [{
        key: 'isErrorClass',


        //region detection
        /**
         * Determines if the given err object is an error class
         *
         * @param {*} clazz
         * @returns {boolean}
         */
        value: function isErrorClass(clazz) {
            if (_AbstractError2.default.isClass(clazz)) {
                return true;
            }

            if ('function' !== typeof clazz) {
                return false;
            }

            while (clazz) {
                if (clazz === Error) {
                    return true;
                }

                clazz = Object.getPrototypeOf(clazz);
            }

            return false;
        }

        /**
         * Determines if the given error is
         *
         * @param object
         * @returns {boolean}
         */

    }, {
        key: 'isErrorInstance',
        value: function isErrorInstance(object) {
            return object instanceof Error || _AbstractError2.default.isInstance(object);
        }
    }, {
        key: 'isError',
        value: function isError(instanceOrClass) {
            return this.isErrorInstance(instanceOrClass) || this.isErrorClass(instanceOrClass);
        }

        /**
         * @param {Error|HttpError|*} instanceOrClass
         * @return boolean
         */

    }, {
        key: 'isHttpError',
        value: function isHttpError(instanceOrClass) {
            return _HttpError2.default.isInstanceOrClass(instanceOrClass);
        }
        //endregion

        //region createInstance
        /**
         *
         * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
         * @param {Object} [properties]
         * @return {Error}
         */

    }, {
        key: 'createBadRequestInstance',
        value: function createBadRequestInstance(messageOrSpecOrError, properties) {
            return Errors.createHttpErrorInstance(400, messageOrSpecOrError, properties);
        }

        /**
         * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} messageOrSpecOrError
         * @param {Object} [properties]
         * @return {Error}
         */

    }, {
        key: 'createNotFoundInstance',
        value: function createNotFoundInstance(messageOrSpecOrError, properties) {
            return Errors.createHttpErrorInstance(404, messageOrSpecOrError, properties);
        }

        /**
         *
         * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
         * @param {Object} [properties]
         * @returns {Error}
         */

    }, {
        key: 'createServerErrorInstance',
        value: function createServerErrorInstance(messageOrSpecOrError, properties) {
            return Errors.createHttpErrorInstance(500, messageOrSpecOrError, properties);
        }
        /**
         *
         * @param {String} [message]
         * @param {Object} [properties]
         * @returns {Error}
         */

    }, {
        key: 'createForbiddenErrorInstance',
        value: function createForbiddenErrorInstance(message, properties) {
            return Errors.createHttpErrorInstance(403, message, properties);
        }

        /**
         *
         * @param {number} statusCode
         * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
         * @param {Object} [properties]
         * @return {Error}
         */

    }, {
        key: 'createHttpErrorInstance',
        value: function createHttpErrorInstance(statusCode, messageOrSpecOrError, properties) {
            var stack = null;
            var message = null;
            var cause = null;

            if (_Utility2.default.isNullOrUndefined(messageOrSpecOrError)) {
                // I guess this is ok..
            } else if (this.isError(messageOrSpecOrError)) {
                message = messageOrSpecOrError.message;
                stack = messageOrSpecOrError.stack;
            } else if (_Utility2.default.isString(messageOrSpecOrError)) {
                message = messageOrSpecOrError;
            } else if (_Utility2.default.isObject(messageOrSpecOrError)) {
                statusCode = _lodash2.default.result(messageOrSpecOrError, 'statusCode') || statusCode;
                message = _lodash2.default.result(messageOrSpecOrError, 'message');
                cause = _lodash2.default.result(messageOrSpecOrError, 'cause');
                properties = _lodash2.default.result(messageOrSpecOrError, 'properties');
            }

            if (statusCode) {
                _Preconditions2.default.shouldBeNumber(statusCode);
            }

            if (message) {
                _Preconditions2.default.shouldBeString(message);
            }

            if (properties) {
                _Preconditions2.default.shouldBeObject(properties);
            }

            var template = (0, _httpErrors2.default)(statusCode, message, properties);

            var error = new _HttpError2.default({
                cause: cause,
                properties: template.properties,
                message: template.message,
                stack: template.stack,
                statusCode: template.statusCode
            });

            // if (stack) {
            //     error.stack = stack;
            // }

            if (!error.toJSON) {
                error.toJSON = function () {
                    return {
                        statusCode: error.statusCode,
                        message: error.message,
                        properties: error.properties
                    };
                };
            }

            return error;
        }
        //endregion

        /**
         * @param {Error|AbstractError|null|undefined} error
         * @returns {Object|null}
         */

    }, {
        key: 'optJSON',
        value: function optJSON(error) {
            if (_Utility2.default.isNullOrUndefined(error)) {
                return null;
            } else if (_Utility2.default.isError(error)) {
                return Errors.toJSON(error);
            } else if (_Utility2.default.isPrimitive(error)) {
                return {
                    message: '' + error
                };
            } else {
                // 'opt' means optional.
                return null;
            }
        }

        /**
         * @param {AbstractError|Error} error
         */

    }, {
        key: 'toJSON',
        value: function toJSON(error) {
            _Preconditions2.default.shouldBeError(error);

            if (!_Utility2.default.isFunction(error.toJSON)) {
                return {
                    name: error.name,
                    message: error.message
                };
            } else {
                return error.toJSON();
            }
        }

        /**
         *
         * @param {function} errorFactory
         * @param {*} value
         * @param {*|Function} predicateFn
         * @param {Object} [options]
         * @param {String} [options.message]
         * @param {Number} [options.statusCode]
         * @param {Object|undefined} [options.properties]
         * @returns {*}
         */

    }, {
        key: 'throwErrorIf',
        value: function throwErrorIf(errorFactory, value, predicateFn, options) {
            _Preconditions2.default.shouldBeFunction(errorFactory);
            _Preconditions2.default.shouldBeFunction(predicateFn);

            if (!_Utility2.default.isNullOrUndefined(options)) {
                _Preconditions2.default.shouldBeObject(options);
            }

            var result = predicateFn(value);

            if (false === result || _Utility2.default.isNullOrUndefined(result)) {
                return value;
            } else {
                result = _lodash2.default.defaultsDeep(result, options || {}, defaults);

                throw errorFactory(result.message, result.properties);
            }
        }

        /**
         *
         * @param {*} value
         * @param {*|Function} predicateFn
         * @param {Object} [options]
         * @param {String} [options.message]
         * @param {Number} [options.statusCode]
         * @param {Object|undefined} [options.properties]
         * @returns {*}
         */

    }, {
        key: 'throwNotFoundIf',
        value: function throwNotFoundIf(value, predicateFn, options) {
            this.throwErrorIf(this.createNotFoundInstance, value, predicateFn, options);
        }

        /**
         *
         * @param {*} value
         * @param {*|Function} predicateFn
         * @param {Object} [options]
         * @param {String} [options.message]
         * @param {Number} [options.statusCode]
         * @param {Object|undefined} [options.properties]
         * @returns {*}
         */

    }, {
        key: 'throwBadRequestIf',
        value: function throwBadRequestIf(value, predicateFn, options) {
            this.throwErrorIf(this.createBadRequestInstance, value, predicateFn, options);
        }

        /**
         * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
         * @param {Object} [properties]
         * @return {Error}
         */

    }, {
        key: 'throwBadRequest',
        value: function throwBadRequest(messageOrSpecOrError, properties) {
            throw Errors.createBadRequestInstance(messageOrSpecOrError, properties);
        }

        /**
         *
         * @param {Class} clazz
         */

    }, {
        key: 'throwMustBeAbstract',
        value: function throwMustBeAbstract(clazz) {
            var name = _Utility2.default.optClassName(clazz);

            throw new TypeError(name + ' is abstract and cannot be created');
        }

        /**
         * @throws Error
         */

    }, {
        key: 'throwNotImplemented',
        value: function throwNotImplemented() {
            throw new Error('This method is not implemented');
        }

        /**
         * Throw a TypeError that says you have no idea what the fuck is going on.
         *
         * @param {*} thingy
         * @throws TypeError
         */

    }, {
        key: 'throwNotSure',
        value: function throwNotSure(thingy) {
            throw new TypeError('Not sure what to do with ' + thingy);
        }
    }]);

    return Errors;
}();

exports.Errors = Errors;
exports.default = Errors;
//# sourceMappingURL=Errors.js.map