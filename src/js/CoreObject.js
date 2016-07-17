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

    constructor(options) {
        super(...arguments);

        Lodash.merge(this, options);
    }

    /**
     *
     * @param {string} key
     * @returns {*|Object}
     */
    get(key) {
        return Ember.get(this, key);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns {CoreObject|*}
     */
    set(key, value) {
        Ember.set(this, key, value);

        return this;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.toClass().toString();
    }

    /**
     *
     * @returns {Class<CoreObject>}
     */
    toClass() {
        return this.constructor;
    }

    /**
     *
     * @returns {Class<CoreObject>}
     */
    static toClass() {
        return this;
    }

    /**
     * @returns {String}
     */
    static toString() {
        return this.constructor.name;
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