'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import { expect, assert } from 'chai';

// import { NotificationService, NotificationBuilder, NotificationTemplate, InlineNotificationTemplate, UserNotificationTemplate } from '~/slack';
import Lodash from 'lodash';
import Utility from '~/Utility';
import Ember from '~/ember';
import Preconditions from '~/Preconditions';
import Functions from '~/Functions';
import User from '~/data/User';
import UserBuilder from '~/data/UserBuilder';

// Preconditions.shouldBe(function() { return true; }, 'expected', 'actual', 'message');

// NotificationService.url = 'https://hooks.slack.com/services/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';

// NotificationService.mergeIntoPayload({
//     channel: '#events-test',
//     username: 'coinme-node/slack.spec.js'
// });

describe('Utility', function() {

    it('function', () => {
        let fn = () => {};

        assert.isFunction(fn);
        assert.isTrue(Utility.isFunction(fn));
        assert.isFalse(Utility.isFunction(null));
        assert.isFalse(Utility.isFunction(''));
        assert.isFalse(Utility.isFunction(NaN));
    });

    it('existing', function() {
        assert.isTrue(Utility.isExisting('string'));
        assert.isTrue(Utility.isExisting({ }));

    });

    it('string', function() {
        assert.isFunction(Utility.typeMatcher('string'));
        assert.isTrue(Utility.typeMatcher('string')('string'));
        assert.isTrue(Utility.isString('asdfad'));
    });

    it('shouldBe', function() {
        Preconditions.shouldBeFalsey(undefined);
        Preconditions.shouldBeFalsey(false);
        Preconditions.shouldBeFalsey(null);
    });

});

describe('User', () => {

    it('UserBuilder', () => {
        let SPEC_VERSION_8 = {
            'DBA': 'expirationDate',
            'DAC': 'firstName',
            'DCS': 'lastName',
            'DAD': 'middleName',
            'DBB': 'birthDate',
            'DCB': 'gender',
            'DAG': 'addressLine1',
            'DAH': 'addressLine2',
            'DAI': 'addressCity',
            'DAJ': 'addressState',
            'DAK': 'addressZipcode',
            'DAQ': 'username',
            'DCG': 'addressCountry',
            'DCL': 'race'
        };

        let user = UserBuilder.fromVersion8({
            'DBA': 'expirationDate',
            'DAC': 'firstName',
            'DCS': 'lastName',
            'DAD': 'middleName',
            'DBB': 'birthDate',
            'DCB': 'gender',
            'DAG': 'addressLine1',
            'DAH': 'addressLine2',
            'DAI': 'addressCity',
            'DAJ': 'addressState',
            'DAK': 'addressZipcode',
            'DAQ': 'username',
            'DCG': 'addressCountry',
            'DCL': 'race'
        });

        assert.equal(user.expirationDate, 'expirationDate');
        assert.equal(user.username, 'username');
        assert.equal(user.firstName, 'firstName');
        assert.equal(user.lastName, 'lastName');
        assert.equal(user.middleName, 'middleName');
        assert.equal(user.birthDate, 'birthDate');
        assert.equal(user.addressLine1, 'addressLine1');
        assert.equal(user.addressLine2, 'addressLine2');
        assert.equal(user.addressCity, 'addressCity');
        assert.equal(user.addressState, 'addressState');
        assert.equal(user.addressZipcode, 'addressZipcode');
        assert.equal(user.addressCountry, 'addressCountry');
        assert.equal(user.gender, 'gender');
        assert.equal(user.race, 'race');
    });

});


describe('Ember', () => {

    it('computed properties', () => {

        var Record = Ember.Object.extend({

            thong: Ember.computed('thingy', function() {
                return this.get('thingy') + 'thong';
            })

        });

        var record = new Record({

            thingy: false,
            believesInHumanity: false

        });

        assert.equal(record.get('believesInHumanity'), false);
        assert.equal(record.get('thingy'), false);
        assert.equal(record.get('thong'), 'falsethong');

        record.set('thingy', true);

        assert.equal(record.get('thingy'), true);
        assert.equal(record.get('thong'), 'truethong');
    });
});

describe('Functions', () => {

    it('Should return scope', () => {
        var scope = 5;

        assert.equal(Functions.identity.apply(scope), scope);
    });

});

// describe('CoinmeSlack', function() {
//
//     let { Object } = Utility;
//
//     it('Utility tests', () => {
//
//     });
//
//     //
//     it('Service', () => {
//         NotificationService.register('USER_SIGNED_UP', new UserNotificationTemplate());
//
//         NotificationService.notify('USER_SIGNED_UP', {
//             id: 324,
//             firstName: 'Michael',
//             lastName: 'Smyers',
//             address: 'asdfasdfasdfasdfasdf',
//             url: 'https://www.coinmewallet.com/admin/users/' + 324
//         });
//     });
//
//     it('Utility can set and get', () => {
//         var object = {};
//
//         Preconditions.shouldBeUndefined(Object.get(object, 'fieldName'));
//
//         Object.set(object, 'fieldName', true);
//
//         Preconditions.shouldBeBoolean(Object.get(object, 'fieldName'));
//         Preconditions.shouldNotBeFalsey(Object.get(object, 'fieldName'));
//     });
//
//     it('Utility can set and get array', () => {
//         var object = {};
//
//         Preconditions.shouldBeUndefined(Object.get(object, 'fieldName'));
//
//         Object.set(object, 'fieldName', []);
//
//         Preconditions.shouldBeArray(Object.get(object, 'fieldName'));
//     });
//
//     it('getWithDefaultValue', () => {
//         var object = {};
//
//         Preconditions.shouldBeUndefined(Object.get(object, 'fields'));
//
//         var fields = Ember.getWithDefault(object, 'fields', []);
//
//         Preconditions.shouldBeArray(fields);
//         Preconditions.shouldNotBeFalsey(fields);
//     });
// });
//
// describe('CoinmeSlack', function() {
//
//     it('User Did Something', function() {
//         //NotificationService.register('EVENT_NAME', {
//         //    payload: {
//         //        username: 'InlineTemplate'
//         //    },
//         //
//         //    /**
//         //     *
//         //     * @param {NotificationBuilder} builder
//         //     * @param {Object} data
//         //     * @returns {*}
//         //     */
//         //    applyToNotificationBuilder(builder, data) {
//         //        builder
//         //            .username('New User Monitor (unit test)')
//         //            .text(`A new user signed up! ${data.firstName} ${data.lastName} with an address of '${data.address}'`);
//         //
//         //        let attachment = builder.attachment();
//         //
//         //        {
//         //            attachment.title('');
//         //        }
//         //
//         //    }
//         //});
//
//         //NotificationService.notify('EVENT_NAME', {
//         //    text: 'text'
//         //});
//     });
//
//     it('Can register templates', function() {
//         NotificationService.register('EVENT_NAME', new InlineNotificationTemplate({
//             name: 'InlineTemplate',
//
//             payload: {
//                 username: 'InlineTemplate'
//             }
//         }));
//
//         NotificationService.notify('EVENT_NAME', {
//             text: 'text'
//         });
//     });
//
//     it('Can be instantiated', () => {
//         var builder = new NotificationBuilder({
//             url: 'https://hooks.slack.com/services/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',
//
//             payload: {
//                 'username': 'Say my name again, mother fucker',
//                 'text': 'this is text',
//                 'attachments': [{
//                     'fallback': 'ReferenceError - UI is not defined: https://honeybadger.io/path/to/event/',
//                     'text': '<https://honeybadger.io/path/to/event/|ReferenceError> - UI is not defined',
//                     'fields': [{
//                         'title': 'Project',
//                         'value': 'Awesome Project',
//                         'short': true
//                     }, {
//                         'title': 'Environment',
//                         'value': 'production',
//                         'short': true
//                     }],
//                     'color': '#F35A00'
//                 }]
//             }
//         });
//
//         builder.mergeIntoPayload({
//             merged: true
//         });
//
//         if (!builder.payload.merged) {
//             throw new Error('Must exist');
//         }
//
//         builder.text('asdfasdf');
//
//         let attachment = builder.attachment();
//
//         {
//             let field = attachment.field();
//
//             {
//                 field.title('');
//             }
//         }
//
//         builder
//             .attachment()
//             .text('this is text for a new attachment')
//             .field()
//             .title('this is the title');
//
//         //expect(builder)
//         //    .to
//         //    .exist();
//     });
// });
