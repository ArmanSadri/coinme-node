'use strict';

import CoreObject from '../CoreObject';
import Errors from '../errors/Errors';
import NotImplementedError from '../errors/NotImplementedError';
import Preconditions from "../Preconditions";

class Adapter extends CoreObject {

    /**
     *
     * @param {CoreObject|Class<CoreObject>} instanceOrClass
     */
    supports(instanceOrClass) {
        throw new NotImplementedError();
    }

    /**
     * @param {CoreObject|*} instance
     * @returns {*}
     */
    adapt(instance) {
        throw new NotImplementedError();
    }

    /**
     *
     * @param {CoreObject|Class|Class<CoreObject>|*} instanceOrClass
     * @throws {PreconditionsError} if the instanceOrClass is not supported.
     * @return {*}
     */
    shouldSupport(instanceOrClass) {
        if (!this.supports(instanceOrClass)) {
            Preconditions.fail(true, false, `Do not support ${instanceOrClass}`);
        }

        return instanceOrClass;
    }

    toFunction() {
        let self = this;

        return function() {
            return self.adapt.apply(self, arguments);
        }
    }
}

export {Adapter};
export default Adapter;