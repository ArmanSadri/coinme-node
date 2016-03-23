'use strict';

import Ember from "~/ember";
import Preconditions from '~/Preconditions';

/**
 * This is the base class for all classes in our architecture.
 *
 *
 * @abstract
 * @class
 */
class CoreObject extends Ember.CoreObject {

    /**
     *
     * @param {String} path
     * @returns {*}
     */
    get(path) {
        Preconditions.shouldBeString(path);

        return Ember.get(this, path);
    }

    /**
     *
     * @param {String} path
     * @param {*} value
     */
    set(path, value) {
        Preconditions.shouldBeString(path);

        return Ember.set(this, path, value);
    }
}

export default CoreObject;