'use strict';

import AbstractBuilder from './AbstractBuilder';
import AttachmentBuilder from './AttachmentBuilder';
import request from 'request-promise';

class NotificationBuilder extends AbstractBuilder {

    constructor(options) {
        super(options);

        this.Preconditions.shouldBeString(this.url, 'NotificationBuilder.constructor(): url must be a string');
    }

    /**
     *
     * @param {String} value
     * @returns {NotificationBuilder}
     */
    channel(value) {
        return this.setString('channel', value);
    }

    /**
     *
     *
     * @param text
     * @returns {NotificationBuilder}
     */
    text(text) {
        return this.setString('text', text);
    }

    /**
     *
     * @param icon
     * @returns {icon}
     */
    icon(icon) {
        return this.setString('icon_emoji', icon);
    }

    username(username) {
        return this.setString('username', username);
    }

    attachments() {
        return this.getWithDefaultValue('attachments', []);
    }

    attachment() {
        return new AttachmentBuilder(this);
    }

    toPayload() {
        return this.payload;
    }

    toJson() {
        return JSON.stringify(this.toPayload());
    }

    /**
     *
     * @return {Promise}
     */
    execute() {
        let scope = this;

        let url = this.url;
        let payload = this.toPayload();

        return Promise.resolve()
            .then(() => {
                //
                // https://www.npmjs.com/package/request-promise
                //
                // var options = {
                //    method: 'POST',
                //    uri: 'http://posttestserver.com/post.php',
                //    body: {
                //        some: 'payload'
                //    },
                //    json: true // Automatically stringifies the body to JSON
                // };

                let requestOptions = {
                    uri: url,
                    method: 'POST',
                    body: payload,
                    json: true
                };

                scope.Logger.debug(`[SLACK:${scope.name}] webhook `, requestOptions);

                return Promise.resolve(request(requestOptions))
                    .then(function(value) {
                        scope.Logger.debug(`[SLACK:${scope.name}] webhook succeeded.`, arguments);

                        return value;
                    })
                    .catch(function(err) {
                        scope.Logger.warn(`[SLACK:${scope.name}] webhook failed.`, arguments);

                        throw err;
                    });
            });
    }

    /**
     * Convenience method for triggering execute. It makes this class a Promise, kind of. (Thenable)
     *
     * @returns {Promise}
     */
    then() {
        return this.execute();
    }
}

export default NotificationBuilder;