'use strict';

import NotificationBuilder from './NotificationBuilder';
import AbstractObject from './AbstractObject';

/**
 *
 * This class is intended to be instantiated early and (generally) once in your app.
 * @abstract
 * @class
 */
class AbstractNotificationTemplate extends AbstractObject {

    constructor(options) {
        super(options);

        this.Lodash.defaults(this, {
            name: 'NotificationTemplate'
        });

        this.Preconditions.shouldBeString(this.name, 'You must define a name for this template');
    }

    /**
     *
     * @param {NotificationBuilder} builder
     * @param {Object} data
     * @return {Promise|NotificationBuilder|Object}
     */
    applyTemplate(builder, data) {

    }
}

export default NotificationTemplate;