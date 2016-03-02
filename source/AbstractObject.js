'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';
import winston from 'winston';
import Promise from 'bluebird';

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */
class CoreObject {

    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        options = options || {};

        let chosenLodashVersion = options.Lodash || _;

        options = chosenLodashVersion.defaults(options, {
            Preconditions: Preconditions.singleton(),
            Lodash: chosenLodashVersion,
            Logger: winston,
            Promise: Promise
        });

        chosenLodashVersion.assign(this, options);
    }
}

export default CoreObject;
