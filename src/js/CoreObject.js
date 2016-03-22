'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';
import winston from 'winston';
import Promise from 'bluebird';

let $ = Preconditions.singleton();

/**
 * This is the base class for all classes in our architecture.
 *
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
            Preconditions: $,
            Lodash: chosenLodashVersion,
            Logger: winston,
            Promise: Promise
        });

        chosenLodashVersion.assign(this, options);
    }

    toDependencyMap() {
        return CoreObject.toDependencyMap(this);
    }

    static toDependencyMap(options) {
        options = options || {
                Lodash: _
            };

        let Lodash = options.Lodash;

        return Lodash.defaults(options, {
            Preconditions: $,
            Logger: winston,
            Promise: Promise
        });
    }
}

export default CoreObject;
