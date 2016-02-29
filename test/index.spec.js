'use strict';
import { expect } from 'chai';
import NotificationService from '../source/';
import { NotificationBuilder, NotificationTemplate } from '../source/';
import Utility from '../source/Utility';

describe('CoinmeSlack', function() {

    let { Object } = Utility;
    let $ = Utility.$;

    it('Service', () => {
        NotificationService.url = 'https://hooks.slack.com/services/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';

        NotificationService.registerTemplate('USER_SIGNED_UP', new NotificationTemplate({

            name: 'UserSignedUpNotificationTemplate',

            /**
             *
             * @param {NotificationBuilder} builder
             * @param {Object} data
             * @returns {*}
             */
            applyToNotificationBuilder(builder, data) {
                return builder
                    .username('New User Monitor (unit test)')
                    .text(`A new user signed up! ${data.firstName} ${data.lastName} with an address of '${data.address}'`);
            }
        }));

        NotificationService.notify('USER_SIGNED_UP', {
            firstName: 'Michael',
            lastName: 'Smyers',
            address: 'asdfasdfasdfasdfasdf'
        });
    });

    it('Utility can set and get', () => {
        var object = {};

        $.shouldBeUndefined(Object.get(object, 'fieldName'));

        Object.set(object, 'fieldName', true);

        $.shouldBeBoolean(Object.get(object, 'fieldName'));
        $.shouldNotBeFalsey(Object.get(object, 'fieldName'));
    });

    it('Utility can set and get array', () => {
        var object = {};

        $.shouldBeUndefined(Object.get(object, 'fieldName'));

        Object.set(object, 'fieldName', []);

        $.shouldBeArray(Object.get(object, 'fieldName'));
    });

    it('getWithDefaultValue', () => {
        var object = {};

        $.shouldBeUndefined(Object.get(object, 'fields'));

        var fields = Object.getWithDefaultValue(object, 'fields', []);

        $.shouldBeArray(fields);
        $.shouldNotBeFalsey(fields);
    });
});

describe('CoinmeSlack', function() {

    it('Can register templates', function() {
        NotificationService.registerTemplate('EVENT_NAME', {
            name: 'InlineTemplate',

            payload: {
                username: 'InlineTemplate'
            }
        });

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

        //expect(builder.payload.merged).to.exist();

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

        builder.execute();

        //expect(builder)
        //    .to
        //    .exist();
    });
});
