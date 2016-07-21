import Utility from '../Utility';
import AbstractError from './AbstractError';

class NotImplementedError extends AbstractError {

    /**
     *
     * @param {String|Object} [options]
     * @param {String} [options.message]
     * @param {Error} [options.cause]
     * @constructor
     */
    constructor(options) {
        if (Utility.isString(options)) {
            options = {message: options};
        }

        options = options || {};
        options.message = options.message || 'This method is not implemented';

        super(options);
    }

    /**
     * @return {String}
     */
    static toString() {
        return 'PreconditionsError';
    }
}

export {NotImplementedError};

export default NotImplementedError;

