'use strict';

import CoreObject from "../CoreObject";
import NotImplementedError from "../errors/NotImplementedError";
import Preconditions from "../Preconditions";
import Adapter from "./Adapter";
import Utility from '../Utility';

class ConverterAdapter extends Adapter {

    /**
     *
     * @param {Object} options
     * @param {Converter} options.converter
     * @param {Class|Class<CoreObject>|*} options.outputClass
     */
    constructor(options) {
        let converter = Utility.take(options, 'converter', true);
        let outputClass = Utility.take(options, 'outputClass', true);
        let inputClass = Utility.take(options, 'inputClass', false);

        super(...arguments);

        /**
         * @type {Converter}
         * @private
         */
        this._converter = converter;
        this._outputClass = outputClass;
        this._inputClass = inputClass;
    }

    //region Properties

    /**
     *
     * @return {Class<CoreObject>|Class}
     */
    get outputClass() {
        return this._outputClass;
    }

    /**
     *
     * @return {Class<CoreObject>|Class}
     */
    get inputClass() {
        return this._inputClass;
    }

    /**
     * @return {Converter}
     */
    get converter() {
        return this._converter;
    }
    //endregion

    /**
     *
     * @param {CoreObject|Class<CoreObject>} instanceOrClass
     * @return {boolean}
     */
    supports(instanceOrClass) {
        return this.converter.supports(instanceOrClass, this.outputClass);
    }

    /**
     *
     * @param {CoreObject|*} instance
     * @return {CoreObject|*}
     */
    adapt(instance) {
        if (this.inputClass) {
            Preconditions.shouldBeClass(Utility.getClass(instance), this.inputClass);
        }

        return this.converter.convert(instance, this.outputClass);
    }

}

class Converter extends CoreObject {

    /**
     * Determines if this Converter instance can convert between the two currencies.
     *
     * NOTE: The direction matters.
     *
     * @param {CoreObject|Class<CoreObject>|*} instanceOrClass
     * @param {Class<CoreObject>|*} clazz
     * @returns {boolean}
     */
    supports(instanceOrClass, clazz) {
        throw new NotImplementedError();
    }

    shouldSupport(instance, clazz) {
        if (!this.supports(instance, clazz)) {
            Preconditions.fail(true, false, `does not support ${instance}->${clazz}`);
        }
    }

    /**
     * @param {CoreObject|*} instance
     * @param {Class<CoreObject>|Class|*} clazz
     * @return {CoreObject|*}
     */
    convert(instance, clazz) {
        throw new NotImplementedError();
    }

    /**
     *
     * @param {Class<CoreObject>} options
     * @param {Class<CoreObject>} [options.inputClass]
     * @param {Class<CoreObject>} [options.outputClass]
     * @return {Adapter}
     */
    toAdapter(options) {
        return new ConverterAdapter({
            converter: this,
            inputClass: options.inputClass,
            outputClass: options.outputClass
        });
    }

    /**
     *
     * @param {Class|Class<CoreObject>} options
     * @param {Class|Class<CoreObject>} [options.inputClass]
     * @param {Class|Class<CoreObject>} [options.outputClass]
     * @return {Function}
     */
    toFunction(options) {
        return this.toAdapter(options).toFunction();
    }

}

export {Converter};
export default Converter;