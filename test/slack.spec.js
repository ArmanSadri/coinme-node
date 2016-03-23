'use strict';

import { expect } from 'chai';
import { NotificationService, NotificationBuilder, NotificationTemplate, InlineNotificationTemplate, UserNotificationTemplate } from '~/slack';
import Utility from '~/Utility';
import Ember from '~/ember';
import Preconditions from '~/Preconditions';

Preconditions.shouldBe(function() { return true; }, 'expected', 'actual', 'message');

NotificationService.url = 'https://hooks.slack.com/services/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';

NotificationService.mergeIntoPayload({
    channel: '#events-test',
    username: 'coinme-node/slack.spec.js'
});

describe('CoinmeSlack', function() {

    let { Object } = Utility;

    it('Utility tests', () => {
        
    });

    //
    it('Service', () => {
        NotificationService.register('USER_SIGNED_UP', new UserNotificationTemplate());

        NotificationService.notify('USER_SIGNED_UP', {
            id: 324,
            firstName: 'Michael',
            lastName: 'Smyers',
            address: 'asdfasdfasdfasdfasdf',
            url: 'https://www.coinmewallet.com/admin/users/' + 324
        });
    });

    it('Utility can set and get', () => {
        var object = {};

        Preconditions.shouldBeUndefined(Object.get(object, 'fieldName'));

        Object.set(object, 'fieldName', true);

        Preconditions.shouldBeBoolean(Object.get(object, 'fieldName'));
        Preconditions.shouldNotBeFalsey(Object.get(object, 'fieldName'));
    });

    it('Utility can set and get array', () => {
        var object = {};

        Preconditions.shouldBeUndefined(Object.get(object, 'fieldName'));

        Object.set(object, 'fieldName', []);

        Preconditions.shouldBeArray(Object.get(object, 'fieldName'));
    });

    it('getWithDefaultValue', () => {
        var object = {};

        Preconditions.shouldBeUndefined(Object.get(object, 'fields'));

        var fields = Ember.getWithDefault(object, 'fields', []);

        Preconditions.shouldBeArray(fields);
        Preconditions.shouldNotBeFalsey(fields);
    });
});

describe('CoinmeSlack', function() {

    it('User Did Something', function() {
        //NotificationService.register('EVENT_NAME', {
        //    payload: {
        //        username: 'InlineTemplate'
        //    },
        //
        //    /**
        //     *
        //     * @param {NotificationBuilder} builder
        //     * @param {Object} data
        //     * @returns {*}
        //     */
        //    applyToNotificationBuilder(builder, data) {
        //        builder
        //            .username('New User Monitor (unit test)')
        //            .text(`A new user signed up! ${data.firstName} ${data.lastName} with an address of '${data.address}'`);
        //
        //        let attachment = builder.attachment();
        //
        //        {
        //            attachment.title('');
        //        }
        //
        //    }
        //});

        //NotificationService.notify('EVENT_NAME', {
        //    text: 'text'
        //});
    });

    it('Can register templates', function() {
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
