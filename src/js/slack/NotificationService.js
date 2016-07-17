'use strict';

import Logger from 'winston';
import Lodash from 'lodash/index';
import Preconditions from '~/Preconditions';
import NotificationTemplate from './NotificationTemplate';
import NotificationBuilder from './NotificationBuilder';
import CoreObject from '~/CoreObject';
import Promise from 'bluebird';

class NotificationService extends CoreObject {

    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        super(options);

        if (!this.templates) {
            this.templates = {};
        }

        if (!this.mappings) {
            this.mappings = {};
        }

        this.register('DEFAULT_TYPE', new NotificationTemplate({
            name: 'DEFAULT_TEMPLATE'
        }));

        this.payload = {};
    }

    mergeIntoPayload(payload) {
        Preconditions.shouldBeObject(payload, 'Payload must be object');
        Lodash.assign(this.payload, payload);
    }

    /**
     *
     * @param {String} notificationType
     * @param {NotificationTemplate} notificationTemplate
     * @return {NotificationService}
     */
    register(notificationType, notificationTemplate) {
        Preconditions.shouldBeString(notificationType, 'notificationType must be string');
        Preconditions.shouldBeObject(notificationTemplate, 'notificationTemplate must be an object');

        if (!(notificationTemplate instanceof NotificationTemplate)) {
            let options = notificationTemplate;

            notificationTemplate = new NotificationTemplate(options);
        }

        this.mappings[notificationType] = notificationTemplate.name;
        this.templates[notificationTemplate.name] = notificationTemplate;

        return this;
    }

    builder() {
        let builder = new NotificationBuilder({
            url: this.url
        });
        
        if (this.payload) {
            builder.mergeIntoPayload(this.payload);
        }

        return builder;
    }

    /**
     *
     * @param {String} notificationType
     * @returns {NotificationTemplate}
     */
    notificationTemplate(notificationType) {
        Preconditions.shouldBeString('param:notificationType');

        let notificationTemplateName = this.mappings[notificationType];
        var notificationTemplate = this.templates[notificationTemplateName];

        Preconditions.shouldBeDefined(notificationTemplate, 'Notification template not found for ' + notificationType);

        return notificationTemplate;
    }

    /**
     *
     * @param {String} type
     * @param {*|undefined} data
     * @return {Promise}
     */
    notify(type, data) {
        Preconditions.shouldBeString(type, 'NotificationService.notify(type, data): type must be string.');
        //this.Preconditions.shouldBeDefined(data, 'NotificationService.notify(type, data): data must be defined.');
        data = data || {};

        let url = this.url;

        let notificationTemplate = this.notificationTemplate(type);
        let promise = notificationTemplate.render(this.builder(), data);

        return promise
            .then((builder) => {
                Preconditions.shouldBeDefined(builder, 'No builder for ' + type);

                if (!builder.url) {
                    builder.url = url;
                }

                Preconditions.shouldBeString(builder.url, 'NotificationService.notify(): builder.url was undefined');
                // Attachments without top level text are valid.
                //Preconditions.shouldBeString(payload.text, 'builder did not complete \'text\' property. ' + JSON.stringify(payload));

                return Promise.resolve(builder.execute());
            });
    }
}

export { NotificationService };

export default new NotificationService({

});
