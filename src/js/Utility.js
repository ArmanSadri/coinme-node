'use strict';

import Lodash from 'lodash';
import Preconditions from '~/Preconditions';
import Ember from '~/ember';

/**
 * @class
 * @singleton
 */
export default class Utility {

    /**
     *
     * @returns {String}
     */
    static typeOf(object) {
        return Ember.typeOf(object);
    }

    /**
     *
     * @param {*} object
     * @return boolean
     */
    static isUndefined(object) {
        return Lodash.isUndefined(object);
    }

    /**
     * @param {*} object
     * @return {boolean}
     */
    static isExisting(object) {
        let u = Utility.isUndefined(object);
        let n = Utility.isNaN(object);
        let nu = Utility.isNull(object);

        return !(u || n || nu);
    }

    static isNaN(object) {
        return Lodash.isNaN(object);
    }

    static isNull(object) {
        return null === object;
    }

    static isNotExisting(object) {
        return !this.isExisting(object);
    }

    /**
     *
     * @param {*} object
     * @returns {boolean}
     */
    static isFalsey(object) {
        return !object;
    }

    static isFunction(fn) {
        return this.typeOf(fn) === 'function';
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    static isNotBlank(string) {
        return !this.isBlank(string);
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    static isBlank(string) {
        Preconditions.shouldBeString(string);

        return Ember.isBlank(string);
    }

    /**
     *
     * @param {String} type
     * @return {function}
     */
    static typeMatcher(type) {

        /**
         * @param {*} object
         */
        return function(object) {
            return Utility.typeOf(object) === type;
        };
    }

    /**
     *
     * @param {Object} object
     * @param {Object} defaults
     * @returns {Object} The original object.
     */
    static defaults(object, defaults) {
        Preconditions.shouldBeObject(object);
        Preconditions.shouldBeObject(defaults);

        let updates = Object.keys(defaults);

        for (let i = 0, l = updates.length; i < l; i++) {
            let prop = updates[i];
            let value = Ember.get(defaults, prop);

            Ember.set(object, prop, value);
        }

        return object;
    }
};