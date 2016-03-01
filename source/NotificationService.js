'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';

import NotificationTemplate from './NotificationTemplate';
import NotificationBuilder from './NotificationBuilder';

class NotificationService {

    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        _.assign(this, options);

        this.$ = Preconditions.singleton();

        if (!this.templates) {
            this.templates = {};
        }

        if (!this.mappings) {
            this.mappings = {};
        }

        this.register('DEFAULT_TYPE', new NotificationTemplate({
            name: 'DEFAULT_TEMPLATE'
        }));
    }

    /**
     *
     * @param {String} notificationType
     * @param {NotificationTemplate} notificationTemplate
     * @return {NotificationService}
     */
    register(notificationType, notificationTemplate) {
        this.$.shouldBeString(notificationType, 'notificationType must be string');
        this.$.shouldBeObject(notificationTemplate, 'notificationTemplate must be an object');

        if (!(notificationTemplate instanceof NotificationTemplate)) {
            let options = notificationTemplate;

            notificationTemplate = new NotificationTemplate(options);
        }

        this.mappings[notificationType] = notificationTemplate.name;
        this.templates[notificationTemplate.name] = notificationTemplate;

        return this;
    }

    /**
     *
     * @param {String} notificationType
     * @param {Object} data
     * @return {NotificationBuilder}
     */
    builder(notificationType, data) {
        if (!notificationType) {
            notificationType = 'DEFAULT_TYPE';
        }

        if (!data) {
            data = {
                // TODO: apply some defaults?
            };
        }

        let notificationTemplateName = this.mappings[notificationType];
        var notificationTemplate = this.templates[notificationTemplateName];

        this.$.shouldBeDefined(notificationTemplate, 'Notification template not found for ' + notificationType);

        let builder = new NotificationBuilder({
            url: this.url
        });

        return notificationTemplate.applyToNotificationBuilder(builder, data);
    }

    /**
     *
     * @param {String} type
     * @param {*|undefined} data
     * @return {Promise}
     */
    notify(type, data) {
        this.$.shouldBeString(type, 'NotificationService.notify(type, data): type must be string.');
        //this.$.shouldBeDefined(data, 'NotificationService.notify(type, data): data must be defined.');
        data = data || {};

        let url = this.url;
        let builder = this.builder(type, data);

        this.$.shouldBeDefined(builder, 'No builder for ' + type);

        this.$.shouldBeString(url || builder.url, '');

        if (!builder.url) {
            builder.url = url;
        }

        return builder.execute();
    }
}

export { NotificationService };

export default new NotificationService({

});
