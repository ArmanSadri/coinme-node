import CoreObject from "../CoreObject";
import Utility from "../Utility";
import URI from "urijs";
import Preconditions from "../Preconditions";
import Promise from "bluebird";

/**
 * @class Cache
 * @extends CoreObject
 * @abstract
 */
class Cache extends CoreObject {

    /**
     * @protected
     * @type {Promise}
     */
    _startedLatch;

    //region constructor
    constructor(options) {
        super(options);

        Preconditions.shouldBeAbstract(this, Cache);
    }

    //endregion

    //region getters/setters
    /**
     * @readonly
     * @property
     * @return {Promise}
     */
    get startedLatch() {
        return this._startedLatch;
    }

    //endregion

    /**
     * @abstract
     * @param {String|URI} path
     * @return {Promise}
     */
    read(path) {
        let scope = this;

        return Promise.resolve()
            .then(() => scope.startedLatch)
            .then(() => {
                return Utility.getPath(path);
            });
    }
}

export {Cache}
export default Cache;