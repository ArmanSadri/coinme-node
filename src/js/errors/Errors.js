import Utility from '../Utility';
import Preconditions from '../Preconditions';
import AbstractError from "./AbstractError";
import Lodash from "lodash";
import createError from "http-errors";
import HttpError from './HttpError';

let defaults = {
    message: 'Unknown Error',
    properties: {}
};

class Errors {

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
    static errorIf(errorFactory, value, predicateFn, options) {
        Preconditions.shouldBeFunction(errorFactory);
        Preconditions.shouldBeFunction(predicateFn);

        if (!Utility.isNullOrUndefined(options)) {
            Preconditions.shouldBeObject(options);
        }

        let result = predicateFn(value);

        if (false === result || Utility.isNullOrUndefined(result)) {
            return value;
        } else {
            result = Lodash.defaultsDeep(result, options || {}, defaults);

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
    static notFoundIf(value, predicateFn, options) {
        this.errorIf(this.notFound, value, predicateFn, options);
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
    static badRequestIf(value, predicateFn, options) {
        this.errorIf(this.badRequest, value, predicateFn, options);
    }

    /**
     * Determines if the given err object is an error class
     *
     * @param {*} clazz
     * @returns {boolean}
     */
    static isErrorClass(clazz) {
        if (AbstractError.isClass(clazz)) {
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
    static isErrorInstance(object) {
        return object instanceof Error || AbstractError.isInstance(object);
    }

    static isError(instanceOrClass) {
        return this.isErrorInstance(instanceOrClass) || this.isErrorClass(instanceOrClass);
    }

    /**
     * @param {Error|HttpError|*} instanceOrClass
     * @return boolean
     */
    static isHttpError(instanceOrClass) {
        return HttpError.isInstanceOrClass(instanceOrClass);
    }

    /**
     *
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @return {Error}
     */
    static badRequest(messageOrSpecOrError, properties) {
        return Errors.httpError(400, messageOrSpecOrError, properties);
    }

    /**
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} messageOrSpecOrError
     * @param {Object} [properties]
     * @return {Error}
     */
    static notFound(messageOrSpecOrError, properties) {
        return Errors.httpError(404, messageOrSpecOrError, properties);
    }

    /**
     *
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @returns {Error}
     */
    static serverError(messageOrSpecOrError, properties) {
        return Errors.httpError(500, messageOrSpecOrError, properties);
    }

    /**
     *
     * @param {number} statusCode
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @param {Object} [properties]
     * @return {Error}
     */
    static httpError(statusCode, messageOrSpecOrError, properties) {
        let stack = null;
        let message = null;
        let cause = null;

        if (Utility.isNullOrUndefined(messageOrSpecOrError)) {
            // I guess this is ok..
        } else if (this.isError(messageOrSpecOrError)) {
            message = messageOrSpecOrError.message;
            stack = messageOrSpecOrError.stack;
        } else if (Utility.isString(messageOrSpecOrError)) {
            message = messageOrSpecOrError;
        } else if (Utility.isObject(messageOrSpecOrError)) {
            statusCode = Lodash.result(messageOrSpecOrError, 'statusCode') || statusCode;
            message = Lodash.result(messageOrSpecOrError, 'message');
            cause = Lodash.result(messageOrSpecOrError, 'cause');
            properties = Lodash.result(messageOrSpecOrError, 'properties');
        }

        if (statusCode) {
            Preconditions.shouldBeNumber(statusCode);
        }

        if (message) {
            Preconditions.shouldBeString(message);
        }

        if (properties) {
            Preconditions.shouldBeObject(properties);
        }

        let template = createError(statusCode, message, properties);

        let error = new HttpError({
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

    /**
     *
     * @param {String} [message]
     * @param {Object} [properties]
     * @returns {Error}
     */
    static forbidden(message, properties) {
        return Errors.httpError(403, message, properties);
    }

    /**
     * @param {Error|AbstractError|null|undefined} error
     * @returns {Object|null}
     */
    static optJSON(error) {
        if (Utility.isNullOrUndefined(error)) {
            return null;
        } else if (Utility.isError(error)) {
            return Errors.toJSON(error);
        } else if (Utility.isPrimitive(error)) {
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
    static toJSON(error) {
        Preconditions.shouldBeError(error);

        if (!Utility.isFunction(error.toJSON)) {
            return {
                name: error.name,
                message: error.message
            };
        } else {
            return error.toJSON();
        }
    }
}

export default Errors;