import CoreObject from "../CoreObject";
import Utility from "../Utility";
import URI from "urijs";
import Preconditions from "../Preconditions";
import Promise from "bluebird";

/**
 * @class ResourceLoader
 * @extends CoreObject
 */
class ResourceLoader extends CoreObject {

    _startedLatch;

    constructor(options) {
        super(options);

        Preconditions.shouldBeAbstract(this, ResourceLoader);
    }

    /**
     * @abstract
     * @param {String|URI} path
     * @return {Promise|Promise<Buffer>|Promise<String>}
     */
    load(path) {
        return Promise
            .resolve()
            .then(() => {
                return Utility.getPath(path);
            });
    }

    /**
     * @property
     * @readonly
     * @type {Promise}
     * @return {Promise}
     */
    get startedLatch() {
        return this._startedLatch;
    }
}

export {ResourceLoader};
export default ResourceLoader;