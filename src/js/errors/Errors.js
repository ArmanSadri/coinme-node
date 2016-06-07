import AbstractError from './AbstractError';

class Errors {

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
}

export default Errors;