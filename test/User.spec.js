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