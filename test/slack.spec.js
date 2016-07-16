'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Utility from "~/Utility";
import Ember from "~/Ember";
import Preconditions from "~/Preconditions";
import Functions from "~/Functions";
import UserBuilder from "~/data/UserBuilder";
import CoreObject from "~/CoreObject";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import "source-map-support/register";

// import { NotificationService, NotificationBuilder, NotificationTemplate, InlineNotificationTemplate, UserNotificationTemplate } from '~/slack';

//sadf
// Preconditions.shouldBe(function() { return true; }, 'expected', 'actual', 'message');

// NotificationService.url = 'https://hooks.slack.com/services/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';

// NotificationService.mergeIntoPayload({
//     channel: '#events-test',
//     username: 'coinme-node/slack.spec.js'
// });

describe('Errors', () => {

    it('Errors.isErrorClass(Error)', () => {
        assert.isTrue(Errors.isErrorClass(Error));
    });

    it('Errors.isErrorClass(AbstractError)', () => {
        assert.isTrue(Errors.isErrorClass(AbstractError));
    });

    it('Errors.isErrorInstance(Error)', () => {
        assert.isTrue(Errors.isErrorInstance(new Error()));
    });

    it('Errors.isErrorInstance(AbstractError)', () => {
        assert.isTrue(Errors.isErrorInstance(new AbstractError('Abstract')));
    });

    it('Utility.isInstance(new PreconditionsError())', () => {
        let e = new PreconditionsError({});

        assert.isTrue(Utility.isError(e));
        assert.isTrue(Errors.isErrorInstance(e));
    });

    it('Preconditions.shouldBeType(error)', () => {
        Preconditions.shouldBeType('error', new PreconditionsError(), 'Should be error type');
        Preconditions.shouldBeType('error', new Error(), 'Should be error type');
    })

    it('PreconditionsError.isInstance(new PreconditionsError())', () => {
        assert.isTrue(PreconditionsError.isInstance(new PreconditionsError()));
    });

    it('AbstractError.isInstance(new AbstractError())', () => {
        assert.isTrue(AbstractError.isInstance(new AbstractError()));
    });

    it('Preconditions.shouldBeError', () => {
        let e = new PreconditionsError({
            message: 'message'
        });

        Preconditions.shouldBeError(e, PreconditionsError, 'bad type: ' + e);
    });
});

describe('CoreObject', () => {

    it('isClass - self', () => {
        assert.isTrue(CoreObject.isClass(CoreObject));
        assert.isFalse(CoreObject.isClass(function () {
        }));
        assert.isFalse(CoreObject.isClass(new CoreObject()));
        assert.isFalse(CoreObject.isClass(new CoreObject({})));

        assert.isTrue(CoreObject.isClass((new CoreObject({})).toClass()));
    });

    it('isInstance - self', () => {
        assert.isFalse(CoreObject.isInstance(CoreObject));
        assert.isTrue(CoreObject.isInstance(new CoreObject()));
        assert.isFalse(CoreObject.isInstance({}));
    });

    it('isClass - subclass', () => {
        class Subclass extends CoreObject {

        }

        assert.isTrue(CoreObject.isClass(Subclass), 'Subclass should be a CoreObject');
        assert.isFalse(CoreObject.isClass(new Subclass()));
        assert.isTrue(CoreObject.isInstance(new Subclass()), 'subclass is instance of CoreObject');
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

        var Record = CoreObject.extend({
            thong: Ember.computed('thingy', function () {
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
