'use strict';

import AbstractBuilder from './AbstractBuilder';
import FieldBuilder from './FieldBuilder';

class AttachmentBuilder extends AbstractBuilder {

    constructor(parent) {
        super({
            parent: parent
        });

        this.parent
            .attachments()
            .push(this.payload);

        this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
        this.set('color', 'good');
    }

    title(value) {
        return this.setString('title', value);
    }

    text(value) {
        return this.setString('text', value);
    }

    fields() {
        let fields = this.getWithDefaultValue('fields', []);

        this.$.shouldBeArray(fields, 'fields');

        return fields;
    }

    color(color) {
        return this.setString('color', color);
    }

    field() {
        return new FieldBuilder(this)
            .small();
    }
}

export default AttachmentBuilder;
