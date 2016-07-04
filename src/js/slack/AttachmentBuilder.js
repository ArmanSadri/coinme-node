'use strict';

import Preconditions from "~/Preconditions";
import Ember from "~/Ember";
import AbstractBuilder from "~/slack/AbstractBuilder";
import FieldBuilder from "~/slack/FieldBuilder";

class AttachmentBuilder extends AbstractBuilder {

    init() {
        super.init(...arguments);

        this.get('parent')
            .attachments()
            .push(this.get('payload'));

        this.set('mrkdwn_in', ['pretext', 'text', 'fields']);
        this.set('color', 'good');
    }

    title(value) {
        Preconditions.shouldBeString(value);
        
        return this.set('title', value);
    }

    text(value) {
        Preconditions.shouldBeString(value);

        return this.set('text', value);
    }

    fields() {
        let fields = Ember.getWithDefault(this, 'fields', []);

        Preconditions.shouldBeArray(fields, 'fields');

        return fields;
    }

    color(color) {
        Preconditions.shouldBeString(color);

        return this.set('color', color);
    }

    field() {
        return new FieldBuilder(this)
            .small();
    }
}

export default AttachmentBuilder;
