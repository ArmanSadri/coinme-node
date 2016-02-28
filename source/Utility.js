'use strict';

import _ from 'lodash';
import Preconditions from 'preconditions';

//preconditions.shouldBeDefined(someObj.valueOne, "Custom error message.")
//    .shouldBeDefined(someObj.valueTwo)
//    .shouldBeUndefined(someObj.valueThree, "Custom error message.")
//    .checkPositionIndex(5, 10, "Custom error message.")
//    .shouldBeFunction(someObj.valueOne);

let Utility = {

    $: Preconditions.singleton()

};

_.merge(Utility, {

    Object: {
        /**
         * Set a value
         *
         * @param {Object} object
         * @param {String} path
         * @param {*} value
         */
        set: function(object, path, value) {
            Utility.$.shouldBeDefined(object);
            Utility.$.shouldBeString(path);

            _.set(object, path, value);

            let sanity = this.get(object, path);

            if (value !== sanity) {
                throw new Error('Does not match');
            }
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @param {String} string
         */
        setString: function(object, path, string) {
            Utility.$.shouldBeDefined(object);
            Utility.$.shouldBeString(path);
            Utility.$.shouldBeString(string);

            return _.set(object, path, string);
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @returns {*}
         */
        get: function(object, path) {
            return _.get(object, path);
        },

        /**
         *
         * @param {Object} object
         * @param {String} path
         * @param {Object} defaultValue
         * @return {*}
         */
        getWithDefaultValue(object, path, defaultValue) {
            var result = this.get(object, path);

            if (!result) {
                this.set(object, path, defaultValue);

                result = defaultValue;
            }

            return result;
        }
    }
});

export default Utility;