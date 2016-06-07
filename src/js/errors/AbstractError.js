function ExtendableBuiltin(cls){

    function ExtendableBuiltin(){
        cls.apply(this, arguments);
    }
    
    ExtendableBuiltin.prototype = Object.create(cls.prototype);

    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}

/**
 *
 * @class
 */
class AbstractError extends ExtendableBuiltin(Error) {

    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;

        var error = Error.call(this, message);
        // if (typeof Error.captureStackTrace === 'function') {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = (new Error(message)).stack;
        // }
        this.stack = error.stack;
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
}

export default AbstractError;