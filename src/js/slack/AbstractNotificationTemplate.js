'use strict';

import Logger from "winston";
import CoreObject from "~/CoreObject";
import NotificationBuilder from "~/slack/NotificationBuilder";

/**
 *
 * This class is intended to be instantiated early and (generally) once in your app.
 */
class AbstractNotificationTemplate extends CoreObject {

    constructor() {
        super(...arguments);

        // Utility.defaults(this, {
        //     name: 'NotificationTemplate'
        // });

        // Preconditions.shouldBeString(Ember.get(this, 'name'), 'You must define a name for this template');
    }

    /**
     * @public
     * @param {NotificationBuilder} builder
     * @param {*|undefined} data
     * @returns {Promise}
     */
    render(builder, data) {
        // Apply the template. Might be a promise though.
        var result = this.applyTemplate(builder, data);

        result = result || builder;

        return result;
    }

    /**
     *
     * @protected
     * @param {NotificationBuilder} builder
     * @param {Object} data
     * @return {Promise|NotificationBuilder|Object}
     */
    applyTemplate(builder, data) {
        Logger.silly('Builder', builder);
        Logger.silly('Data', data);

        throw new Error('This method must be overridden by a subclass');
    }

}

export default AbstractNotificationTemplate;