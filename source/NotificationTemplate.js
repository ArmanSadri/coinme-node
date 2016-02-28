'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';
import NotificationBuilder from './NotificationBuilder';

class NotificationTemplate {

    constructor(options) {
        _.assign(this, options);

        this.$ = Preconditions.singleton();
        this.$.shouldBeString(this.name, 'You must define a name for this template');
    }

    /**
     *
     * @param {NotificationBuilder} notificationBuilder
     * @param {Object} data
     * @return {NotificationBuilder}
     */
    applyToNotificationBuilder(notificationBuilder, data) {
        // The default implementation
        // This is where you would modify your builder.
        return notificationBuilder;
    }
}

export default NotificationTemplate;