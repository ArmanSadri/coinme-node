'use strict';

import Logger from 'winston';
import Lodash from 'lodash';
import Ember from '~/ember';
import Utility from '~/Utility';
import Preconditions from '~/Preconditions';
import CoreObject from '~/CoreObject';

// winston : https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/

class AbstractBuilder extends CoreObject {

    init() {
        Utility.defaults(this, {
            name: 'AbstractBuilder',
            payload: {}
        });
    }

    /**
     * @public
     * @param object
     * @return {AbstractBuilder}
     */
    mergeIntoPayload(object) {
        Preconditions.shouldBeDefined(object, 'Cannot merge null');
        Preconditions.shouldBeObject(object, 'Should be object');

        console.log(Ember);
        console.log(Ember.assign);

        Ember.assign(this, {
            payload: object
        });

        return this;
    }

}

export default AbstractBuilder;
