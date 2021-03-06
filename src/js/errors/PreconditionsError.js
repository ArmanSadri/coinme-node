import Utility from '../Utility';
import AbstractError from './AbstractError';

class PreconditionsError extends AbstractError {

    /**
     *
     * @param {*} options.expectedValue
     * @param {*} options.actualValue
     * @param {String} [options.message]
     * @param {Error} [options.cause]
     * @param {Error} [options.optionalCause]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        let cause = options.optionalCause || options.cause;
        let expectedValue = options.expectedValue;
        let actualValue = options.actualValue;
        let message = options.message;

        super(`failure (expected: '${expectedValue}' [${Utility.typeOf(expectedValue)}]) (actual: '${actualValue}' [${Utility.typeOf(actualValue)}]) (message: ${message})`);

        this._innerMessage = message;
        this._cause = cause;
        this._expectedValue = expectedValue;
        this._actualValue = actualValue;
    }

    get innerMessage() {
        return this._innerMessage;
    }

    get actualValue() {
        return this._actualValue;
    }

    get expectedValue() {
        return this._expectedValue;
    }

    get cause() {
        return this._cause;
    }

    static toString() {
        return 'PreconditionsError';
    }
}

// /**
//  *
//
//  */
// function PreconditionsError(expectedValue, actualValue, message, optionalCause) {
//
// }
//
// PreconditionsError.prototype = Object.create(Error.prototype);
// PreconditionsError.prototype.constructor = PreconditionsError;

export {PreconditionsError};
export default PreconditionsError;

