'use strict';

import Lodash from 'lodash/index';
import Logger from 'winston';

import Preconditions from '~/Preconditions';
import NotificationBuilder from '~/slack/NotificationBuilder';
import AbstractNotificationTemplate from '~/slack/AbstractNotificationTemplate';

class NotificationTemplate extends AbstractNotificationTemplate {

    constructor(options) {
        super(options);

        Lodash.defaults(this, {
            name: 'NotificationTemplate'
        });

        Preconditions.shouldBeString(this.name, 'You must define a name for this template');
    }

    /**
     *
     * @param {NotificationBuilder} builder
     * @param {*|Object} data
     * @return {NotificationBuilder}
     */
    applyTemplate(builder, data) {
        if (Lodash.isObject(this.get('payload'))) {
            builder.mergeIntoPayload(this.get('payload'));
        }

        Logger.silly('Data', data);

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