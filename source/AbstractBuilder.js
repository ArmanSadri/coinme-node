'use strict';

import Utility from './Utility';
import _ from 'lodash';
import Preconditions from 'preconditions';
let $ = Preconditions.singleton();

import winston from 'winston';

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

class AbstractBuilder {

    constructor(options) {
        _.assign(this, options);

        if (!this.payload) {
            this.payload = {};
        }

        if (!this.Logger) {
            this.Logger = winston;
        }

        this.$ = $;
    }

    /**
     *
     * @param path
     * @returns {*}
     * @protected
     */
    get(path) {
        if (_.isUndefined(path)) {
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
        this.$.shouldBeString(path, 'path');
        this.$.shouldBeString(string, 'string');

        return this.set(path, string);
    }

    /**
     * @public
     * @param object
     * @return {AbstractBuilder}
     */
    mergeIntoPayload(object) {
        this.$.shouldBeDefined(object, 'Cannot merge null');
        this.$.shouldBeObject(object, 'should be object');

        _.assign(this.payload, object);

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
