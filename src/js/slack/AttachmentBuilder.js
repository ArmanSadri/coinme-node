'use strict';

import Preconditions from "../Preconditions";
import AbstractBuilder from "../slack/AbstractBuilder";
import FieldBuilder from "../slack/FieldBuilder";
import Utility from "../Utility";
import NotificationBuilder from "./NotificationBuilder";

class AttachmentBuilder extends AbstractBuilder {

    /**
     *
     * @param {{parent: NotificationBuilder}} options
     */
    constructor(options) {
        Preconditions.shouldBeObject(options, 'AttachmentBuilder constructor requires configuration.');

        /**
         * @type {NotificationBuilder}
         */
        let parent = Utility.take(options, 'parent', {
            type: NotificationBuilder,
            required: true
        });

        super(options);

        this._parent = parent;

        let payload = Utility.defaults(this.payload, {
            mrkdwn_in: ['pretext', 'text', 'fields'],
            color: 'good'
        });

        parent
            .attachments()
            .push(payload);
    }

    /**
     *
     * @returns {AttachmentBuilder}
     */
    get parent() {
        return this._parent;
    }

    /**
     *
     * @param {String} value
     * @returns {AttachmentBuilder}
     */
    title(value) {
        Preconditions.shouldBeString(value);

        return this.mergeIntoPayload({
            title: value
        });
    }

    /**
     *
     * @param color
     * @returns {AttachmentBuilder}
     */
    color(color) {
        Preconditions.shouldBeString(color);

        return this.mergeIntoPayload({
            color: color
        });
    }

    /**
     *
     * @param {String} value
     * @returns {AttachmentBuilder}
     */
    text(value) {
        Preconditions.shouldBeString(value);

        return this.mergeIntoPayload({
            text: value
        });
    }

    /**
     * @returns {FieldBuilder}
     */
    field() {
        return new FieldBuilder({
            parent: this
        })
            .small();
    }

    /**
     *
     * @returns {[]}
     */
    fields() {
        let fields = this.get('payload.fields');

        if (!fields) {
            fields = [];

            this.set('payload.fields', fields);
        }

        return fields;
    }
}

export default AttachmentBuilder;
