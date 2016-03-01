'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';
import winston from 'winston';
import Promise from 'bluebird';

class AbstractObject {

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

export default AbstractObject;
