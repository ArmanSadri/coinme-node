'use strict';

import Ember from "~/ember";
import Lodash from "lodash";

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */
export default class CoreObject extends Ember.Object {

    get(key) {
        return Ember.get(this, key);
    }

    set(key, value) {
        return Ember.set(this, key, value);
    }

    constructor(options) {
        super(...arguments);
        Lodash.merge(this, options);
    }

    toString() {
        return this.toClass().toString();
    }

    toClass() {
        return this.constructor;
    }

    static toClass() {
        return this;
    }

    static toString() {
        return 'CoreObject';
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
     * @param {object} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
        return obj instanceof this;
    }
}