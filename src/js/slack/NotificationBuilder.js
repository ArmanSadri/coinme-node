'use strict';

import Promise from 'bluebird';
import Logger from 'winston';
import Preconditions from './../Preconditions';
import request from 'request-promise';

import CoreObject from '~/CoreObject';
import AbstractBuilder from './AbstractBuilder';
import AttachmentBuilder from './AttachmentBuilder';
import Ember from '~/Ember';

class NotificationBuilder extends AbstractBuilder {

    constructor(options) {
        super(...arguments);

        this._attachments = [];
    }

    /**
     *
     * @param {String} value
     * @returns {NotificationBuilder}
     */
    channel(value) {
        Preconditions.shouldBeString(value);

        return this.set('channel', value);
    }

    /**
     *
     *
     * @param text
     * @returns {NotificationBuilder}
     */
    text(text) {
        Preconditions.shouldBeString(text);

        return this.set('text', text);
    }

    /**
     *
     * @param icon
     * @returns {icon}
     */
    icon(icon) {
        Preconditions.shouldBeString(icon);

        return this.set('icon_emoji', icon);
    }

    username(username) {
        Preconditions.shouldBeString(username);

        return this.set('username', username);
    }

    attachments() {
        return this._attachments;
    }

    /**
     * @returns {AttachmentBuilder}
     */
    attachment() {
        return new AttachmentBuilder({
            parent: this
        });
    }

    toPayload() {
        return this.get('payload');
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

        Preconditions.shouldBeString(scope.url, 'NotificationBuilder.execute(): url must be a string');

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

                Logger.debug(`[SLACK:${scope.name}] webhook `, requestOptions);

                return Promise.resolve(request(requestOptions))
                    .then(function(value) {
                        Logger.debug(`[SLACK:${scope.name}] webhook succeeded.`, arguments);

                        return value;
                    })
                    .catch(function(err) {
                        Logger.warn(`[SLACK:${scope.name}] webhook failed.`, arguments);

                        throw err;
                    });
            });
    }

    /**
     * Do not insert a Promise into this method.
     *
     * @param {Object|NotificationBuilder} object
     * @param {Object|undefined} deps
     * @param {Preconditions|undefined} deps.Preconditions
     * @return {Promise<NotificationBuilder>}
     */
    static innerCast(object, deps) {
        deps = CoreObject.toDependencyMap(deps);

        let Preconditions = deps.Preconditions;

        Preconditions.shouldBeDefined(object);

        return Promise.resolve(object)
            .then(function(result) {
                Preconditions.shouldBeDefined(object, 'Casted object must be defined.');
                Preconditions.shouldNotBeArray(object, 'Casted object must NOT be an array.');
                Preconditions.shouldBeObject(object, 'Casted object must be an object.');

                if (result instanceof NotificationBuilder) {
                    return result;
                }

                return new NotificationBuilder(object);
            });
    }
}

export default NotificationBuilder;