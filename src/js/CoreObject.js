'use strict';

import Ember from "./Ember";
import Lodash from "lodash";
import Preconditions from './Preconditions';

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
     * Ensures that your object is an instance of this type.
     *
     * @param {*} object
     * @returns {Object}
     * @throws {PreconditionsError} if the type is incorrect
     */
    static shouldBeInstance(object) {
        if (!this.isInstance(object)) {
            Preconditions.fail(this, object, 'Should be instance');
        }

        return object;
    }

    /**
     *
     * @param {object} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
        return obj instanceof this;
    }

    /**
     *
     * @param obj
     * @return {boolean}
     */
    static isInstanceOrClass(obj) {
        return this.isInstance(obj) || this.isClass(obj);
    }

}