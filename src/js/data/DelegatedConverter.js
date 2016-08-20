'use strict';

import CoreObject from "../CoreObject";
import Preconditions from "../Preconditions";
import Utility from "../Utility";
import Adapter from "./Adapter";
import Converter from "./Converter";

//region class CoreObjectAdapter
/**
 * Internal class used by DelegatedConverter
 *
 * @private
 */
class CoreObjectAdapter extends Adapter {

    /**
     *
     * @param {CoreObject|Class<CoreObject>} instanceOrClass
     */
    supports(instanceOrClass) {
        return CoreObject.isInstanceOrClass(instanceOrClass);
    }

    /**
     * @param {CoreObject|*} instance
     * @returns {*}
     */
    adapt(instance) {
        this.shouldSupport(instance);

        return instance.toClass();
    }
}
//endregion

/**
 * Supports different conversion directions.
 *
 * This is not tied to money. It supports simple converting.
 *
 * {<br>
 *   'Bitcoin->Satoshi' : function(value) { return value * satoshi_factor; },<br>
 *   'Satoshi->Bitcoin': function(value) { return value / satoshi_factor; }<br>
 * }<br>
 *
 * @class
 */
class DelegatedConverter extends Converter {

    //region constructor
    /**
     * @param {Object} options
     * @param {Object} options.conversions
     * @param {Adapter} [options.adapter]
     */
    constructor(options) {
        let adapter = Utility.take(options, 'adapter', {
            type: Adapter,
            defaultValue: new CoreObjectAdapter()
        });

        let conversions = Utility.take(options, 'conversions', true);

        super(...arguments);

        /**
         * @type {Object}
         * @private
         */
        this._conversions = conversions || {};

        /**
         * @type {Adapter}
         */
        this._adapter = adapter;
    }
    //endregion

    //region properties
    /**
     * @return {Adapter}
     */
    get adapter() {
        return this._adapter;
    }

    //endregion

    /**
     * @param instance
     * @param clazz
     * @return {boolean}
     */
    supports(instance, clazz) {
        let adapter = this.adapter;

        if (!adapter.supports(instance) || !adapter.supports(clazz)) {
            return false;
        }

        let fn = this.getConversion(instance, clazz);

        return Utility.isFunction(fn);
    }

    /**
     * Executes the conversion.
     *
     * @param {CoreObject|*} input
     * @param {Class<CoreObject>|Class|*} outputClass
     * @returns {*}
     *
     * @throws {PreconditionsError} if the converter fails to convert into a valid number
     * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
     * @throws {PreconditionsError} if converter cannot support the conversion
     */
    convert(input, outputClass) {
        let fn = this.getConversion(input, outputClass);

        return fn.call(this, input, outputClass);
    }

    /**
     * Detects the conversion function, given the inputs.
     *
     * @param {Class<CoreObject>|Class|*} input
     * @param {Class<CoreObject>|Class|*} output
     *
     * @returns {Function|undefined}
     */
    getConversion(input, output) {
        /**
         * @type {String}
         */
        let conversionName = this.getConversionName(input, output);

        return Preconditions.shouldBeFunction(
            this._conversions[conversionName],
            `Converter not found for ${conversionName}`);
    }

    /**
     *
     * @param {*} input
     * @param {*} output
     * @returns {Function}
     */
    optConversion(input, output) {
        let conversionName = this.optConversionName(input, output);

        return this._conversions[conversionName];
    }

    /**
     *
     * @param {Class<CoreObject>|Class|*} input
     * @param {Class<CoreObject>|Class|*} output
     * @private
     * @return {string}
     */
    getConversionName(input, output) {
        Preconditions.shouldBeDefined(input, 'param:input');
        Preconditions.shouldBeDefined(output, 'param:output');

        let adapter = this.adapter;

        input = Preconditions.shouldBeClass(adapter.adapt(input), 'inputClass must be a class');
        output = Preconditions.shouldBeClass(adapter.adapt(output), 'outputClass must be a class');

        return Preconditions.shouldNotBeBlank(this.optConversionName(input, output));
    }

    /**
     * @param {*} input
     * @param {*} output
     * @return {string}
     */
    optConversionName(input, output) {
        if (!input) {
            input = '';
        }

        if (!output) {
            output = '';
        }

        return `${input.toString()}->${output.toString()}`;
    }
}

export {CoreObjectAdapter};
export {DelegatedConverter};

export default DelegatedConverter;