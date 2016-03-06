'use strict';

import CoreObject from '../CoreObject';
import NotificationBuilder from '../slack/NotificationBuilder';

/**
 *
 * This class is intended to be instantiated early and (generally) once in your app.
 */
class AbstractNotificationTemplate extends CoreObject {

    constructor(options) {
        super(options);

        this.Lodash.defaults(this, {
            name: 'NotificationTemplate'
        });

        this.Preconditions.shouldBeString(this.name, 'You must define a name for this template');
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

        return NotificationBuilder.innerCast(
            result,
            this.toDependencyMap());
    }

    /**
     *
     * @protected
     * @param {NotificationBuilder} builder
     * @param {Object} data
     * @return {Promise|NotificationBuilder|Object}
     */
    applyTemplate(builder, data) {
        this.Logger.silly('Builder', builder);
        this.Logger.silly('Data', data);

        throw new Error('This method must be overridden by a subclass');
    }

}

export default AbstractNotificationTemplate;