console.log('capture stack -1');

/**
 *
 * @class
 */
class AbstractError extends Error {

    constructor(message) {
        super(message);

        console.log('capture stack 0');

        this.name = this.constructor.name;
        this.message = message;

        if (typeof Error.captureStackTrace === 'function') {
            console.log('capture stack 1');
            Error.captureStackTrace(this, this.constructor);
        } else {
            console.log('capture stack 2');
            this.stack = (new Error(message)).stack;
        }
    }
}

export default AbstractError;