'use strict';

import AbstractBuilder from './AbstractBuilder';

class FieldBuilder extends AbstractBuilder {

    constructor(parent) {
        super({
            parent: parent
        });

        this.parent
            .fields()
            .push(this.payload);
    }

    /**
     * @param {String} value
     * @returns {FieldBuilder}
     */
    title(value) {
        return this.setString('title', value);
    }

    /**
     * @param {String} value
     * @returns {FieldBuilder}
     */
    text(value) {
        return this.setString('value', value);
    }

    /**
     *
     * @returns {FieldBuilder}
     */
    small() {
        return this.set('short', true);
    }

    /**
     *
     * @param {String} stringToAdd
     * @returns {FieldBuilder}
     */
    add(stringToAdd) {
        var sb = this.get('value');

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
        var sb = this.get('value');

        {
            sb += (`\n_${key}:_ ${value}`);
        }

        return this.text(sb);
    }

}

export default FieldBuilder;
