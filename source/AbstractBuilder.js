'use strict';

import Utility from './Utility';
import AbstractObject from './AbstractObject';

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

class AbstractBuilder extends AbstractObject {

    constructor(options) {
        super(options);

        this.Lodash.defaults(this, {
            payload: {

            }
        });
    }

    /**
     *
     * @param path
     * @returns {*}
     * @protected
     */
    get(path) {
        if (this.Lodash.isUndefined(path)) {
            return this.payload;
        } else {
            return Utility.Object.get(this.payload, path);
        }
    }

    /**
     *
     * @param {String} path
     * @param {*} value
     * @return
     * @protected
     */
    set(path, value) {
        Utility.Object.set(this.payload, path, value);

        return this;
    }

    /**
     *
     * @param {String} path
     * @param {String} string
     * @protected
     */
    setString(path, string) {
        this.Preconditions.shouldBeString(path, 'path');
        this.Preconditions.shouldBeString(string, 'string');

        return this.set(path, string);
    }

    /**
     * @public
     * @param object
     * @return {AbstractBuilder}
     */
    mergeIntoPayload(object) {
        this.Preconditions.shouldBeDefined(object, 'Cannot merge null');
        this.Preconditions.shouldBeObject(object, 'should be object');

        this.Lodash.assign(this.payload, object);

        return this;
    }

    /**
     *
     * @param {String} path
     * @param {*} defaultValue
     * @returns {*}
     * @public
     */
    getWithDefaultValue(path, defaultValue) {
        return Utility.Object.getWithDefaultValue(this.payload, path, defaultValue);
    }

}

export default AbstractBuilder;
