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
     * @param {NotificationBuilder} builder
     * @param {Object} data
     * @return {NotificationBuilder}
     */
    applyTemplate(builder, data) {
        if (this.Lodash.isObject(this.payload)) {
            builder.mergeIntoPayload(this.payload);
        }

        // This is actually not useful 'by default'
        // It's useful if you want to do inline stuff, but if we do this in the common base-class,
        // then we are actually prevented from ever using this.super() in subclasses that use strongly
        // typed objects instead of slack formatted json. Since the architecture of this project is to
        // abstract away the slack parts, applying the "data" to the slack payload was a limiting design mistake.
        //
        //if (this.Lodash.isObject(data)) {
        //    notificationBuilder.mergeIntoPayload(data);
        //}

        // The default implementation
        // This is where you would modify your builder.
        return builder;
    }
}

export default NotificationTemplate;