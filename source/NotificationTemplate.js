'use strict';

import NotificationBuilder from './NotificationBuilder';
import AbstractObject from './AbstractObject';

class NotificationTemplate extends AbstractObject {

    constructor(options) {
        super(options);

        this.Lodash.defaults(this, {
            name: 'NotificationTemplate'
        });

        this.Preconditions.shouldBeString(this.name, 'You must define a name for this template');
    }

    /**
     *
     * @param {NotificationBuilder} notificationBuilder
     * @param {Object} data
     * @return {NotificationBuilder}
     */
    applyToNotificationBuilder(notificationBuilder, data) {
        if (this.Lodash.isObject(this.payload)) {
            notificationBuilder.mergeIntoPayload(this.payload);
        }

        if (this.Lodash.isObject(data)) {
            notificationBuilder.mergeIntoPayload(data);
        }

        // The default implementation
        // This is where you would modify your builder.
        return notificationBuilder;
    }
}

export default NotificationTemplate;