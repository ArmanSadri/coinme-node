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

    static equals(foreignClass) {
        return this.isClass(foreignClass);
    }

    /**
     *
     * @param {CoreObject|Class|*} instanceOrClass
     * @param {String} [message]
     * @returns {*}
     */
    static shouldBeClassOrInstance(instanceOrClass, message) {
        if (!this.isInstance(instanceOrClass) && !this.isClass(instanceOrClass)) {
            Preconditions.fail(this.toClass(), CoreObject.optClass(instanceOrClass), message || 'Was not the correct class or instance')
        }

        return instanceOrClass;
    }

    /**
     *
     * @param {*|CoreObject} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
        return obj instanceof this;
    }

    /**
     *
     * @param {*|CoreObject} obj
     * @param {String} [message]
     * @returns {*|CoreObject}
     */
    static shouldBeInstance(obj, message) {
        if (!this.isInstance(obj)) {
            Preconditions.fail(this.toClass(), CoreObject.optClass(obj), message || 'Was not the correct class')
        }

        return obj;
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