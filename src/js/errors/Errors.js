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

    //region detection
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
    //endregion

    //region createInstance
    /**
     *
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @return {Error}
     */
    static createBadRequestInstance(messageOrSpecOrError, properties) {
        return Errors.createHttpErrorInstance(400, messageOrSpecOrError, properties);
    }

    /**
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} messageOrSpecOrError
     * @param {Object} [properties]
     * @return {Error}
     */
    static createNotFoundInstance(messageOrSpecOrError, properties) {
        return Errors.createHttpErrorInstance(404, messageOrSpecOrError, properties);
    }

    /**
     *
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @returns {Error}
     */
    static createServerErrorInstance(messageOrSpecOrError, properties) {
        return Errors.createHttpErrorInstance(500, messageOrSpecOrError, properties);
    }
    /**
     *
     * @param {String} [message]
     * @param {Object} [properties]
     * @returns {Error}
     */
    static createForbiddenErrorInstance(message, properties) {
        return Errors.createHttpErrorInstance(403, message, properties);
    }

    /**
     *
     * @param {number} statusCode
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @return {Error}
     */
    static createHttpErrorInstance(statusCode, messageOrSpecOrError, properties) {
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
    //endregion

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
    static throwErrorIf(errorFactory, value, predicateFn, options) {
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
    static throwNotFoundIf(value, predicateFn, options) {
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
    static throwBadRequestIf(value, predicateFn, options) {
        this.throwErrorIf(this.createBadRequestInstance, value, predicateFn, options);
    }

    /**
     * @param {{[cause]: Error, message: String, [properties]:Object}|String|Error} [messageOrSpecOrError]
     * @param {Object} [properties]
     * @return {Error}
     */
    static throwBadRequest(messageOrSpecOrError, properties) {
        throw Errors.createBadRequestInstance(messageOrSpecOrError, properties);
    }

    /**
     *
     * @param {Class} clazz
     */
    static throwMustBeAbstract(clazz) {
        let name = Utility.optClassName(clazz);

        throw new TypeError(`${name} is abstract and cannot be created`);
    }

    /**
     * @throws Error
     */
    static throwNotImplemented() {
        throw new Error('This method is not implemented');
    }

    /**
     * Throw a TypeError that says you have no idea what the fuck is going on.
     *
     * @param {*} thingy
     * @throws TypeError
     */
    static throwNotSure(thingy) {
        throw new TypeError(`Not sure what to do with ${thingy}`);
    }
}

export {Errors};
export default Errors;