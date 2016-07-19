'use strict';

/**
 * How to use Chai
 * @see http://chaijs.com/api/assert/
 */
import {expect, assert} from "chai";
import Utility from "~/Utility";
import Preconditions from "~/Preconditions";
import CoreObject from "~/CoreObject";
import {Errors, AbstractError, PreconditionsError} from "~/errors";
import {Currency, Bitcoin, Money, Satoshi, USD, Converter} from "~/money";
import "source-map-support/register";


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

    it('take - with defaultValue', () => {
        let object = {
            one: 'one',
            two: 'two',
            three: 'three'
        };

        let objectWithValue1 = Utility.take(object, 'four', {
            defaultValue: 'four'
        });

        assert.equal(Object.keys(object).length, 3);
        assert.equal(objectWithValue1, 'four', 'Should have returned an object');
    });

    it('take(object, array<String>)', () => {
        let object = {
            one: 'one',
            two: 'two',
            three: 'three'
        };

        let objectWithValue1 = Utility.take(object, ['one']);

        Preconditions.shouldBeObject(objectWithValue1);
        Preconditions.shouldBeString(objectWithValue1.one);

        assert.equal(objectWithValue1.one, 'one', 'Should have returned an object');
        assert.equal(1, Object.keys(objectWithValue1).length, 'Should have returned only one value');
    });

    it('take(object, array<Object>)', () => {
        let object = {
            one: 'one',
            two: 'two',
            three: 'three'
        };

        let objectWithValue1 = Utility.take(object, [{key: 'one'}]);

        Preconditions.shouldBeObject(objectWithValue1);
        Preconditions.shouldBeString(objectWithValue1.one);

        assert.equal(objectWithValue1.one, 'one', 'Should have returned an object');
        assert.equal(1, Object.keys(objectWithValue1).length, 'Should have returned only one value');
    });

    it('take(object, {{ key: "type" }})', () => {
        let object = {
            one: 'one',
            two: 'two',
            three: 'three'
        };

        let objectWithValue1 = Utility.take(object, {one: 'string'});

        Preconditions.shouldBeObject(objectWithValue1);
        Preconditions.shouldBeString(objectWithValue1.one);

        assert.equal(objectWithValue1.one, 'one', 'Should have returned an object');
        assert.equal(1, Object.keys(objectWithValue1).length, 'Should have returned only one value');
    });

    it('take(object, {{ key: "type" }})', () => {
        let object = {
            one: 'one',
            two: 'two',
            three: 'three'
        };

        let objectWithValue1 = Utility.take(object, {
            one: 'string',
            two: {
                adapter: function () {
                    return 'CHANGED';
                }
            }
        });

        Preconditions.shouldBeObject(objectWithValue1);
        Preconditions.shouldBeString(objectWithValue1.one);
        Preconditions.shouldBeString(objectWithValue1.two);

        assert.equal(objectWithValue1.one, 'one', 'Should have returned an object');
        assert.equal(objectWithValue1.two, 'CHANGED', 'Should have returned an object');

        assert.equal(2, Object.keys(objectWithValue1).length, 'Should have returned only one value');
    });

    it('take - with function', () => {
        let expected = new CoreObject();
        let object = {key: expected};

        let value = Utility.take(object, 'key', Utility.yes);

        assert.equal(expected, value);
        assert.isTrue(expected === value);
    });

    it('take - with type', () => {
        let expected = new CoreObject();
        let object = {key: expected};

        let value = Utility.take(object, 'key', CoreObject);

        assert.equal(expected, value);
        assert.isTrue(expected === value);
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
        assert.isTrue(Utility.isUndefined(object.one), '\'one\' should be undefined');
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

