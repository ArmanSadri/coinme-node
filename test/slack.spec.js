'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Promise from "bluebird";
import Ember from "../src/js/Ember";
import Preconditions from "../src/js/Preconditions";
import Utility from "../src/js/Utility";
import {Errors, AbstractError, PreconditionsError} from "../src/js/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "../src/js/money";
import "source-map-support/register";

import {
    NotificationService,
    FieldBuilder,
    AttachmentBuilder,
    NotificationBuilder,
    InlineNotificationTemplate,
    UserNotificationTemplate
} from "../src/js/slack";

NotificationService.url = 'https://hooks.slack.com/services/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';

NotificationService.mergeIntoPayload({
    channel: '#events-test',
    username: 'coinme-node/slack.spec.js'
});

describe('CoinmeSlack', function () {

    it('Builders', () => {

        let builder = new NotificationBuilder();

        assert.isTrue(Utility.isUndefined(builder.toPayload().attachments));

        builder.attachments();

        assert.isTrue(Utility.isArray(builder.toPayload().attachments));

        let attachment = builder.attachment();

        assert.isTrue( attachment.payload === builder.payload.attachments[0], 'These objects should be the same instance');
        assert.isTrue(Utility.isUndefined(builder.toPayload().attachments[0].text), 'Should not have text yet: ' + JSON.stringify(builder.toPayload().attachments[0]));

        attachment.text("red");

        assert.isTrue(Utility.isString(builder.toPayload().attachments[0].text), JSON.stringify(builder.toPayload().attachments[0]) + ' vs ' + JSON.stringify(attachment.payload));

    });

    it('FieldBuilder.constructor -- should crash if no parent', (done)=> {

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder();
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder(null);
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder({});
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder({
                parent: null
            });
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder({
                parent: 'wrong-type'
            });
        });

        Preconditions.shouldFailWithPreconditionsError(() => {
            new FieldBuilder({
                parent: new Object()
            });
        });

        new FieldBuilder({
            parent: new AttachmentBuilder({
                parent: new NotificationBuilder({

                })
            })
        });

        done();
    });

    //
    it('Service', (done) => {
        NotificationService.register('USER_SIGNED_UP', new UserNotificationTemplate());

        NotificationService
            .notify('USER_SIGNED_UP', {
                id: 324,
                firstName: 'Michael',
                lastName: 'Smyers',
                address: 'asdfasdfasdfasdfasdf',
                url: 'https://www.coinmewallet.com/admin/users/' + 324
            })
            .then(() => {
                // console.log('done', arguments);
            })
            .catch(function (err) {
                // console.error(err);
            })
            .finally(() => {
                done();
            });
    });

    it('Promise', (done) => {
        Promise.resolve().then(()=> {
        }).catch(()=> {
        }).finally(done);
    });

    it('Utility can set and get', () => {
        var object = {};

        Preconditions.shouldBeUndefined(Ember.get(object, 'fieldName'));

        Ember.set(object, 'fieldName', true);

        Preconditions.shouldBeBoolean(Ember.get(object, 'fieldName'));
        Preconditions.shouldNotBeFalsey(Ember.get(object, 'fieldName'));
    });

    it('Utility can set and get array', () => {
        var object = {};

        Preconditions.shouldBeUndefined(Ember.get(object, 'fieldName'));

        Ember.set(object, 'fieldName', []);

        Preconditions.shouldBeArray(Ember.get(object, 'fieldName'));
    });

    it('getWithDefaultValue', () => {
        var object = {};

        var r = Ember.get(object, 'fields');

        Preconditions.shouldBeUndefined(r);

        var fields = Ember.getWithDefault(object, 'fields', []);

        Preconditions.shouldBeArray(fields);
        Preconditions.shouldNotBeFalsey(fields);
    });

    it('User Did Something', function () {
        NotificationService.register('EVENT_NAME', {
            payload: {
                username: 'InlineTemplate'
            },

            /**
             *
             * @param {NotificationBuilder} builder
             * @param {Object} data
             * @returns {*}
             */
            applyToNotificationBuilder(builder, data) {
                builder
                    .username('New User Monitor (unit test)')
                    .text(`A new user signed up! ${data.firstName} ${data.lastName} with an address of '${data.address}'`);

                let attachment = builder.attachment();

                {
                    attachment.title('');
                }

            }
        });

        NotificationService.notify('EVENT_NAME', {
            text: 'text'
        });
    });

    it('Can register templates', function () {
        NotificationService.register('EVENT_NAME', new InlineNotificationTemplate({
            name: 'InlineTemplate',

            payload: {
                username: 'InlineTemplate'
            }
        }));

        NotificationService.notify('EVENT_NAME', {
            text: 'text'
        });
    });

    it('Can be instantiated', () => {
        var builder = new NotificationBuilder({
            url: 'https://hooks.slack.com/services/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',

            payload: {
                'username': 'Say my name again, mother fucker',
                'text': 'this is text',
                'attachments': [{
                    'fallback': 'ReferenceError - UI is not defined: https://honeybadger.io/path/to/event/',
                    'text': '<https://honeybadger.io/path/to/event/|ReferenceError> - UI is not defined',
                    'fields': [{
                        'title': 'Project',
                        'value': 'Awesome Project',
                        'short': true
                    }, {
                        'title': 'Environment',
                        'value': 'production',
                        'short': true
                    }],
                    'color': '#F35A00'
                }]
            }
        });

        builder.mergeIntoPayload({
            merged: true
        });

        if (!builder.payload.merged) {
            throw new Error('Must exist');
        }

        builder.text('asdfasdf');

        let attachment = builder.attachment();

        {
            let field = attachment.field();

            {
                field.title('');
            }
        }

        builder
            .attachment()
            .text('this is text for a new attachment')
            .field()
            .title('this is the title');

        //expect(builder)
        //    .to
        //    .exist();
    });
});
