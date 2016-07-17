'use strict';

import AbstractBuilder from "../slack/AbstractBuilder";
import AttachmentBuilder from "../slack/AttachmentBuilder";
import Preconditions from "../Preconditions";
import Utility from "../Utility";

class FieldBuilder extends AbstractBuilder {

    /**
     *
     * @param {{parent: AttachmentBuilder}} options
     */
    constructor(options) {
        Preconditions.shouldBeObject(options, 'FieldBuilder constructor requires configuration.');

        /**
         * @type {AttachmentBuilder}
         */
        let parent = Utility.take(options, 'parent', {
            type: AttachmentBuilder,
            required: true
        });

        super(options);

        this._parent = parent;

        this.parent
            .fields()
            .push(this.payload);
    }

    /**
     * @returns {AttachmentBuilder}
     */
    get parent() {
        return this._parent;
    }

    /**
     * @param {String} value
     * @returns {FieldBuilder}
     */
    title(value) {
        Preconditions.shouldBeString(value);

        return this.mergeIntoPayload({
            title: value
        });
    }

    /**
     * @param {String} value
     * @returns {FieldBuilder}
     */
    text(value) {
        return this.mergeIntoPayload({
            value: value
        });
    }

    /**
     *
     * @returns {FieldBuilder}
     */
    small() {
        return this.mergeIntoPayload({
            short: true
        });
    }

    /**
     *
     * @param {String} stringToAdd
     * @returns {FieldBuilder}
     */
    add(stringToAdd) {
        var sb = this.get('payload.value') || '';

        {
            sb += (`\n${stringToAdd}`);
        }

        return this.text(sb);
    }

    /**
     *
     * @param {String} key
     * @param {String} value
     * @returns {FieldBuilder}
     */
    addKeyValuePair(key, value) {
        var sb = this.get('payload.value') || '';

        {
            sb += (`\n_${key}:_ ${value}`);
        }

        return this.text(sb);
    }
}

export default FieldBuilder;
