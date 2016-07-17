'use strict';

import Preconditions from "../Preconditions";
import AbstractBuilder from "../slack/AbstractBuilder";
import FieldBuilder from "../slack/FieldBuilder";

class AttachmentBuilder extends AbstractBuilder {

    /**
     * @param {*} options
     */
    constructor(options) {
        super(...arguments);

        this._fields = [];

        this.get('parent')
            .attachments()
            .push(this.get('payload'));

        this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
        this.set('color', 'good');
    }

    /**
     *
     * @param {String} value
     * @returns {AttachmentBuilder}
     */
    title(value) {
        Preconditions.shouldBeString(value);

        this.set('title', value);

        return this;
    }

    /**
     *
     * @param color
     * @returns {AttachmentBuilder}
     */
    color(color) {
        Preconditions.shouldBeString(color);

        this.set('color', color);

        return this;
    }

    /**
     *
     * @param {String} value
     * @returns {AttachmentBuilder}
     */
    text(value) {
        Preconditions.shouldBeString(value);

        this.set('text', value);

        return this;
    }

    /**
     * @returns {FieldBuilder}
     */
    field() {
        return new FieldBuilder(this)
            .small();
    }

    /**
     *
     * @returns {[]}
     */
    fields() {
        return this._fields;
    }
}

export default AttachmentBuilder;
