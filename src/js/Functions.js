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

    /**
     * Always returns false
     *
     * @returns {boolean} false
     */
    static no() {
        return false;
    }

}