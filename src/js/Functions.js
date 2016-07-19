'use strict';

/**
 * This class should contain all of our reusable functions
 */
export default class Functions {

    /**
     * Returns the current scope that you're calling from.
     *
     * @returns {Functions}
     */
    static identity() {
        return this;
    }

    /**
     * Always returns true
     *
     * @returns {boolean} true
     */
    static yes() {
        return true;
    }

    static emptyFn() {

    }

    /**
     * Always returns false
     *
     * @returns {boolean} false
     */
    static no() {
        return false;
    }

    static ok() {
        return this;
    }

    static identityFn() {
        return this;
    }

    static passthroughFn(arg) {
        return arg;
    }

}