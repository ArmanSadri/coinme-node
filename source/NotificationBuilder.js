'use strict';

import AbstractBuilder from './AbstractBuilder';
import AttachmentBuilder from './AttachmentBuilder';
import request from 'request-promise';

class NotificationBuilder extends AbstractBuilder {

    constructor(options) {
        super(options);

        this.$.shouldBeString(this.url, 'url');
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

    toObject() {
        return this.payload;
    }

    toJson() {
        return JSON.stringify(this.toObject());
    }

    /**
     *
     * @return {Promise}
     */
    execute() {
        //https://www.npmjs.com/package/request-promise
        //var options = {
        //    method: 'POST',
        //    uri: 'http://posttestserver.com/post.php',
        //    body: {
        //        some: 'payload'
        //    },
        //    json: true // Automatically stringifies the body to JSON
        //};

        let object = this.toObject();

        console.log('obj', object);

        return request({
            uri: this.url,
            method: 'POST',
            body: this.toObject(),
            json: true
        });
    }

}

export default NotificationBuilder;