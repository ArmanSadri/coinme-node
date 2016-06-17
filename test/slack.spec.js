'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Utility from "~/Utility";
import Ember from "~/ember";
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
        let e = new PreconditionsError({
            
        });

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

describe('Money', () => {
    it('shouldBeMoney', () => {
        let money = Bitcoin.create(1);

        assert.equal(Money.shouldBeMoney(money), money);
    });

    it('new Bitcoin() - fails', () => {
        try {
            new Money();

            assert.isTrue(false, 'The Bitcoin constructor should have thrown.');
        } catch (e) {
            Preconditions.shouldBeError(e, PreconditionsError, 'bad type: ' + e);
        }
    });

    it('Bitcoin + 1', () => {
        let bitcoin = Bitcoin.create(2);

        assert.equal(bitcoin + 1, 3);
    });


    it('Bitcoin.convert', () => {

        assert.equal(Bitcoin.create(1).convertTo(Satoshi, Bitcoin.SATOSHIS_PER_BITCOIN), Bitcoin.SATOSHIS_PER_BITCOIN);

        assert.equal(Satoshi.create(Bitcoin.SATOSHIS_PER_BITCOIN).convertTo(Bitcoin, Bitcoin.BITCOIN_PER_SATOSHI), 1);

    });

    it('Bitcoin.add', () => {

        let bitcoin = Bitcoin.create(1);
        let bitcoin2 = bitcoin.plus(bitcoin);

        assert.equal(bitcoin.value, 1);
        assert.equal(bitcoin2.value, 2);

        let bitcoin3 = bitcoin2.plus(Satoshi.create(Bitcoin.SATOSHIS_PER_BITCOIN));

        assert.equal(bitcoin3 + 0, 3);

        /**
         * @type {Money}
         */
        let usd = USD.create(1);

        usd.convertTo(Bitcoin, 1);
        usd.convertTo(Bitcoin, function (valueInUsd) {
            return valueInUsd;
        });

        usd.convertTo(Bitcoin, new Converter({

            conversionRate: 2,

            conversions: {
                'Bitcoin->USD': function (valueInBitcoin) {
                    return valueInBitcoin / this.conversionRate;
                },
                'USD->Bitcoin': function (valueInUsd) {
                    return valueInUsd * this.conversionRate;
                }
            }
        }));

        // let bitcoin4 = usd.convertTo(Bitcoin);
        //
        // Currency.converter.register({
        //     'Bitcoin->USD': 4,
        //     'USD->Bitcoin': 1/4
        // });
    });

    it('Simple case', () => {
        let bitcoin = Bitcoin.create(1);
        let satoshi = Satoshi.create(100000000);

        assert.isTrue(bitcoin.equals(satoshi)); // equals does an internal convert
        assert.isTrue(satoshi.equals(bitcoin));

        assert.equal(satoshi.convertTo(Bitcoin), 1); // Money.valueOf() returns a number, which can be compared.

        // The PLUS operator coerces into a number
        assert.isTrue(bitcoin.plus(satoshi).equals(Bitcoin.create(2)));
        assert.isTrue(bitcoin.plus(satoshi).equals(2));

        assert.equal(bitcoin.plus(satoshi) + 0, 2);

        assert.equal(satoshi.convertTo(Bitcoin) + 1, 2);
    });

    it('fromBitcoin', () => {
        let money = Bitcoin.fromBitcoin(1);

        assert.isFalse(Money.isClass(money), 'money is Money - static');
        assert.isTrue(Money.isInstance(money), 'money is Money - instance');
        assert.isTrue(Bitcoin.isCurrency(money.currency), 'money.currency is Currency');
        assert.isTrue(Bitcoin.isBitcoin(money.currency), 'money.currency is Bitcoin');

        Bitcoin.shouldBeBitcoin(money.currency);
        Bitcoin.shouldBeBitcoin(money);
    });

    it('Example', () => {
        let money = Bitcoin.fromBitcoin(1);
        let money2 = Bitcoin.fromBitcoin(money);

        assert.equal(money.value, money2.value);
        assert.isTrue(Bitcoin.isBitcoin(money));
        assert.isTrue(Bitcoin.isBitcoin(money2));
    });

    it('Convert: manual ', () => {
        let bitcoin = Bitcoin.fromBitcoin(1);
        let satoshis = Satoshi.fromBitcoin(bitcoin);

        assert.equal(bitcoin.value, 1);
        assert.equal(satoshis.value, Bitcoin.SATOSHIS_PER_BITCOIN * bitcoin.value);
    });

    it('Convert: bitcoin->satoshi', () => {
        let bitcoin = Bitcoin.create(1);
        let satoshis = Satoshi.fromBitcoin(bitcoin);

        assert.equal(bitcoin.value, 1);
        assert.equal(satoshis.value, Bitcoin.SATOSHIS_PER_BITCOIN * bitcoin.value);
        assert.equal(satoshis.value, 100000000, 'Value should be a number');

        assert.equal(bitcoin.convertTo(Satoshi).value, satoshis.value);
        assert.equal(bitcoin.convertTo(Bitcoin).value, bitcoin.value);

        assert.equal(satoshis.convertTo(Bitcoin).value, bitcoin.value);
        assert.equal(satoshis.convertTo(Satoshi).value, satoshis.value);

        assert.equal(bitcoin.plus(satoshis).value, 2);
        assert.equal(bitcoin.plus(satoshis).convertTo(Satoshi).value, 200000000);

        assert.equal(
            bitcoin
                .plus(bitcoin)
                .plus(1)
                .plus('1')
                .plus(bitcoin)
                .value,
            5);
    });

    it('Currency.equals', () => {
        assert.isTrue(Currency.equals(Currency), 'Currency equals self');
        assert.isTrue(Bitcoin.equals(Bitcoin));
        assert.isTrue(USD.equals(USD));

        assert.isFalse(USD.equals(Bitcoin));
        assert.isFalse(USD.equals(Currency));
    });

    it('Convert: bitcoin->fiat', () => {
        let bitcoin = Bitcoin.create(1);

        // Should work for self
        {
            let usd1 = USD.create(1);
            let usd2 = usd1.convertTo(USD);

            assert.equal(+usd1, +usd2);
            assert.isTrue(usd1.value == usd2.value);
            assert.isTrue(usd1.value === usd2.value);
            assert.equal(usd1.valueOf(), usd2.valueOf());
        }

        {
            // This only works because we passed in a converting function
            let converterFn = function (valueInBitcoin) {
                return valueInBitcoin * .5;
            };

            let usd = bitcoin.convertTo(USD, /* required because not registered */ converterFn);

            assert.equal(usd.value, bitcoin.value / 2);
        }

        {
            assert.equal(bitcoin.convertTo(USD, .5).value, bitcoin.value / 2);
        }

        // Should fail, because no conversions registered.
        {
            try {
                bitcoin.convertTo(USD);

                assert.isTrue(false, 'Should have failed earlier');
            } catch (e) {
            }
        }

        {
            Currency.converter.register({
                'Bitcoin->USD': function () {
                    return 2;
                }
            });

            assert.equal(bitcoin.convertTo(USD).value, bitcoin.value * 2);
        }
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

describe('Utility', function () {

    it('typeOf', () => {
        assert.equal('class', Utility.typeOf(Currency), 'Currency');
        assert.equal('class', Utility.typeOf(Error), 'Error');

        // assert.equal('instance', Utility.typeOf(new Error()), 'Error');
        // assert.equal('instance', Utility.typeOf(new PreconditionsError()), 'PreconditionsError');
    });

    it('Utility.typeMatcher(Class)', () => {
        assert.equal('class', Utility.typeOf(Money), 'Money should be class');
        assert.equal('instance', Utility.typeOf(new Money({
            value: 1,
            currency: Bitcoin
        })), 'new Money() should be instance');

        let matcherFn = Utility.typeMatcher(Money);

        assert.equal('function', Utility.typeOf(matcherFn), 'matcherFn should be function');

        assert.isFalse(matcherFn(Money), 'matcherFn(Money) should be false');
        assert.isFalse(matcherFn(Bitcoin), 'matcherFn(Bitcoin) is not Money');
        assert.isTrue(matcherFn(new Money({
            value: 1,
            currency: Bitcoin
        })), 'new Money() should be true');
    });

    it('CoreObject.toClass() (static)', () => {
        assert.equal(CoreObject.toClass(), CoreObject, 'CoreObject.toClass()');
    });

    it('(new CoreObject()).toClass() (instance)', () => {
        assert.equal(CoreObject, Utility.toClass(CoreObject), 'Utility.toClass(CoreObject) === CoreObject');
        assert.equal(Currency, Utility.toClass(Currency), 'Utility.toClass(Currency) === Currency');
        assert.equal(Utility.toClass(new CoreObject()), CoreObject, 'Utility.toClass(new CoreObject()) === CoreObject');

        assert.isTrue((new CoreObject()).toClass() === CoreObject, '(new CoreObject()).toClass()');
    });

    it('Utility.typeOf(class)', () => {
        assert.equal('class', Utility.typeOf(CoreObject), 'CoreObject is type of class');
        assert.equal('class', Utility.typeOf(Currency), 'Currency is type of class');
        assert.equal('class', Utility.typeOf(Bitcoin), 'Bitcoin is type of class');
        assert.equal('class', Utility.typeOf(Money), 'Money is type of class');
    });

    it('isClass', () => {
        assert.equal('class', Utility.typeOf(Money), 'Money is type of class');

        assert.isTrue(Utility.isClass(Currency));
        assert.isTrue(Currency.isClass(Bitcoin));
        assert.isFalse(Money.isClass(Bitcoin));
    });

    it('isInstance', () => {
        assert.equal('instance', Utility.typeOf(new CoreObject()));
    });

    it('function', () => {
        let fn = () => {
        };

        assert.isFunction(fn);
        assert.isTrue(Utility.isFunction(fn));
        assert.isFalse(Utility.isFunction(null));
        assert.isFalse(Utility.isFunction(''));
        assert.isFalse(Utility.isFunction(NaN));
    });

    it('take - with type', () => {
        let bitcoin = Bitcoin.create(1);
        let object = {key: bitcoin};

        var value = Utility.take(object, 'key', Money);

        assert.equal(bitcoin, value);
        assert.isTrue(bitcoin === value);
    });

    it('take - with dots', function () {
        var object = {one: {two: 3}};
        var three = Utility.take(object, 'one.two');

        assert.equal(three, 3, 'Should be 3');
        assert.isTrue(Utility.isUndefined(object.one.two));
    });

    it('take - without dots', function () {
        var object = {one: 2};
        var two = Utility.take(object, 'one');

        assert.equal(two, 2, 'Should be 2');
        assert.isTrue(Utility.isUndefined(object.one));
    });

    it('existing', function () {
        assert.isTrue(Utility.isExisting('string'));
        assert.isTrue(Utility.isExisting({}));
    });

    it('string', function () {
        assert.isFunction(Utility.typeMatcher('string'));
        assert.isTrue(Utility.typeMatcher('string')('string'));
        assert.isTrue(Utility.isString('asdfad'));
    });

    it('shouldBe', function () {
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
