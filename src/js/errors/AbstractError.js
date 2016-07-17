import Utility from '../Utility';

function ExtendableBuiltin(cls){

    function ExtendableBuiltin(){
        cls.apply(this, arguments);
    }

    ExtendableBuiltin.prototype = Object.create(cls.prototype);

    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}

/**
 * @class
 */
class AbstractError extends ExtendableBuiltin(Error) {

    /**
     *
     * @param {String|Object} options
     */
    constructor(options) {
        if (Utility.isString(options)) {
            let message = options;

            options = { message: message };
        } else if (Utility.isNullOrUndefined(options)) {
            options = { message: 'Unknown Error' };
        }

        /**
         * @type {String}
         */
        let message = Utility.take(options, 'message');
        // let message = Utility.take(options, 'message', Utility.isString);

        super(message);
        
        var error = Error.call(this, message);
        // if (typeof Error.captureStackTrace === 'function') {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = (new Error(message)).stack;
        // }
        this.stack = error.stack;
        this.name = this.constructor.name;
        this.message = message;
    }

    toJSON() {
        return {
            stack: this.stack,
            name: this.name,
            message: this.message
        };
    }

    /**
     * Determines if a class definition is a subclass of CoreObject
     *
     * @param {*} clazz
     * @returns {boolean}
     */
    static isClass(clazz) {
        if ('function' !== typeof clazz) {
            return false;
        }

        while (clazz) {
            if (clazz === this) {
                return true;
            }

            clazz = Object.getPrototypeOf(clazz);
        }

        return false;
    }

    /**
     *
     * @param {*} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
        return obj instanceof this;
    }

    /**
     * @param obj
     * @returns {boolean}
     */
    static isInstanceOrClass(obj) {
        return this.isInstance(obj) || this.isClass(obj);
    }
}

export default AbstractError;