'use strict';

import CoreObject from "../CoreObject";
import Preconditions from "../Preconditions";
import Utility from "../Utility";
import Lodash from "lodash";
import Functions from "../Functions";
import Conversion from "./Conversion";
import Stopwatch from "../Stopwatch";

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
export default class Converter extends CoreObject {

    /**
     * @param {Object} options
     * @param {Object} options.conversions
     */
    constructor(options) {
        let conversions = Utility.take(options, 'conversions');

        super(...arguments);

        /**
         * @type {Object}
         */
        this._conversions = conversions || {};
    }

    /**
     * This is the conversion map. The keys of this object should be 'Currency1->Currency2'
     *
     * The value of each key should be a conversion function of 'function(valueInSource) { return valueInDestination; }
     *
     * @returns {Object}
     */
    get conversions() {
        return this._conversions;
    }

    /**
     * Determines if this Converter instance can convert between the two currencies.
     *
     * NOTE: The direction matters.
     *
     * @param {Class<CoreObject>|*} inputClass
     * @param {Class<CoreObject>|*} outputClass
     * @param {Number|String|Function|Converter} [converter]
     * @returns {boolean}
     */
    canConvert(inputClass, outputClass, converter) {
        converter = this.getConversion(inputClass, outputClass, converter);

        return Utility.isFunction(converter);
    }

    /**
     * Executes the conversion.
     *
     * @param {*} input
     * @param {Class<CoreObject>|Class|*} outputClass
     * @param {Number|String|Function|Converter} [converter]
     * @returns {Promise<Conversion<*>>}
     *
     * @throws {PreconditionsError} if the converter fails to convert into a valid number
     * @throws {PreconditionsError} if the destinationCurrency is not a valid currency
     * @throws {PreconditionsError} if converter cannot support the conversion
     */
    convert(input, outputClass, converter) {
        let inputClass = this.getInputClass(input);
        let fn = this.getConversion(inputClass, outputClass, converter);
        let scope = (Converter.isInstance(converter)) ? converter : this;
        let output = fn.call(scope, input);
        let stopwatch = new Stopwatch();

        return Promise.resolve()
            .then(() => {
                /**
                 * @type {Number}
                 */
                stopwatch.stop({ finalized: true });

                return new Conversion({
                    input: input,
                    output: output,
                    stopwatch: stopwatch,
                    requestor: null, // TODO: Not sure what to do here.
                    converter: this
                });
            });
    }

    /**
     * Detects the conversion function, given the inputs.
     *
     * @param {Class<CoreObject>|Class|*} inputClass
     * @param {Class<CoreObject>|Class|*} outputClass
     * @param {Function|Number|String|Converter} [converter]
     *
     * @returns {Function|undefined}
     */
    getConversion(inputClass, outputClass, converter) {
        if (Utility.isFunction(converter)) {
            return converter;
        } else if (Converter.isInstance(converter)) {
            return this._getConversion(converter, inputClass, outputClass);
        }

        if (!inputClass || !outputClass) {
            return undefined;
        } else if (inputClass.equals(outputClass)) {
            return Functions.passthroughFn;
        } else {
            return this._getConversion(this, inputClass, outputClass);
        }
    }

    /**
     * @param {Converter} converter
     * @param {Class<CoreObject>|Class|CoreObject|*} inputClass
     * @param {Class<CoreObject>|Class|CoreObject|*} outputClass
     * @private
     * @return {Function}
     */
    _getConversion(converter, inputClass, outputClass) {
        Converter.shouldBeInstance(converter, 'Converter parameter must be a converter instance');

        inputClass = Preconditions.shouldBeClass(inputClass, 'inputClass must be a class'); // just in case
        outputClass = Preconditions.shouldBeClass(outputClass, 'outputClass must be a class'); // just in case

        let converterName = inputClass.toString() + '->' + outputClass.toString();
        let fn = converter.conversions[converterName];

        Preconditions.shouldBeFunction(fn, 'Converter not found: ' + converterName);

        return fn;
    }

    /**
     *
     * @param {*} input
     * @return {Class}
     */
    getInputClass(input) {
        return input.toClass();
    }
}