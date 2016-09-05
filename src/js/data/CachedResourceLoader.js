import Utility from "../Utility";
import URI from "urijs";
import {Cache, LocalFileCache} from "../cache";
import ResourceLoader from "./ResourceLoader";

/**
 * @class CachedResourceLoader
 * @extends ResourceLoader
 */
class CachedResourceLoader extends ResourceLoader {

    /**
     *
     * @param {Object} options
     * @param {ResourceLoader} options.resourceLoader
     * @param {Cache} [options.cache]
     */
    constructor(options) {
        //region let cache
        /** @type {Cache} */
        let cache = Utility.take(options, 'cache', {
            adapter(value) {
                if (!value) {
                    value = new LocalFileCache();
                }

                return value;
            }
        });
        //endregion

        /** @type {ResourceLoader} */
        let resourceLoader = Utility.take(options, 'resourceLoader', ResourceLoader, true);

        super(options);

        this._loader = resourceLoader;
        this._cache = cache;

        this._startedLatch = new Promise((resolve, reject) => {
            let promise = Promise.resolve();

            promise = promise.then(() => cache.startedLatch);
            promise = promise.then(() => resourceLoader.startedLatch);

            resolve(promise);
        });
    }

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {ResourceLoader}
     * @return {ResourceLoader}
     */
    get resourceLoader() {
        return this._loader;
    }

    /**
     * @property
     * @readonly
     * @type {Cache}
     * @return {Cache}
     */
    get cache() {
        return this._cache;
    }

    //endregion

    load(path) {
        let cache = this.cache;
        let resourceLoader = this.resourceLoader;

        return super
            .load(path)
            .then((/**@type {URI}*/path) => {
                return cache
                    .read(path)
                    .then((value) => {
                        return value || resourceLoader.load(path);
                    });
            });
    }
}

export {CachedResourceLoader};
export default CachedResourceLoader;