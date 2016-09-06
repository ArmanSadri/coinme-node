import Utility from "../Utility";
import URI from "urijs";
import filecache from "filecache";
import Promise from "bluebird";
import osenv from "osenv";
import mkdirp from "mkdirp";
import Cache from "./Cache";

/**
 * @class LocalFileCache
 * @extends Cache
 */
class LocalFileCache extends Cache {

    _config = {
        watchDirectoryChanges: true,
        watchFileChanges: false,
        hashAlgo: 'sha1',
        gzip: true,
        deflate: true,
        debug: true
    };

    //region constructor
    /**
     *
     * @param {Object} options
     * @param {String|URI} [options.path] defaults to tmpdir
     * @param {{watchDirectoryChanges: boolean, watchFileChanges: boolean, hashAlgo: string, gzip: boolean, deflate: boolean, debug: boolean}} [options.config]
     */
    constructor(options) {
        let path = Utility.take(options, 'path', {
            adapter(value) {
                return URI(value || (osenv.tmpdir() + '/coinme'));
            }
        });

        let config = Utility.take(options, 'config', false);

        super(options);

        this._config = Utility.defaults(config || {}, this._config);
        this._fc = filecache(this.config);
        this._path = path;
        this._started = false;

        let fc = this.fc;
        let scope = this;

        if (this.config.watchDirectoryChanges && this.config.debug) {
            fc.on('change', function (d) {
                scope.logger.debug('! file changed');
                scope.logger.debug('     full path: %s', d.p);
                scope.logger.debug(' relative path: %s', d.k);
                scope.logger.debug('        length: %s bytes', d.length);
                scope.logger.debug('                %s bytes (gzip)', d.gzip.length);
                scope.logger.debug('                %s bytes (deflate)', d.deflate.length);
                scope.logger.debug('     mime-type: %s', d.mime_type);
                scope.logger.debug('         mtime: %s', d.mtime.toUTCString());
            });
        }

        this._startedLatch = new Promise((resolve, reject) => {
            let cache_dir = scope.path.toString();

            mkdirp(cache_dir, function (err) {
                if (err) {
                    return reject(err);
                }

                fc.load(cache_dir, function (err, cache) {
                    if (err) {
                        reject(err);
                    } else {
                        scope._items = cache;

                        resolve();
                    }
                });

                fc.on('ready', function (cache) {
                    scope._items = cache;
                });
            })
        });

        this.startedLatch.catch((err) => {
            scope._error = err;
        });

        this.startedLatch.finally(() => {
            scope._started = true;
        });
    }

    //endregion

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {Promise}
     * @return {Promise}
     */
    get startedLatch() {
        return this._startedLatch;
    }

    /**
     * @property
     * @readonly
     * @type {boolean}
     * @return {boolean}
     */
    get started() {
        return this._started;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Error}
     * @return {boolean}
     */
    get hasError() {
        return !!this.error;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Error}
     * @return {undefined|Error}
     */
    get error() {
        return this._error;
    }

    /**
     * The items in the cache.
     * @readonly
     * @private
     * @type {Object}
     * @return {Object}
     */
    get items() {
        return this._items;
    }

    /**
     * @private
     * @property
     * @readonly
     * @type {filecache}
     * @return {filecache}
     */
    get fc() {
        return this._fc;
    }

    /**
     * @property
     * @readonly
     * @type {String}
     * @return {{watchDirectoryChanges: boolean, watchFileChanges: boolean, hashAlgo: string, gzip: boolean, deflate: boolean, debug: boolean}}
     */
    get config() {
        return this._config;
    }

    /**
     * @property
     * @readonly
     * @type {URI}
     * @return {URI}
     */
    get path() {
        return this._path;
    }

    //endregion

    /**
     *
     * @param {String|URI} path
     * @return {Promise}
     */
    read(path) {
        /** @type {URI} */
        let base_path = this.path;
        /** @type {winston.Logger} */
        let logger = this.logger;

        let scope = this;

        return super
            .read(path)
            .then((/** @type {URI} */path) => {
                if (scope.error) {
                    // an error here means that this cache is fucked.
                    throw scope.error;
                }

                return path;
            })
            .then((path) => {
                return URI.joinPaths(base_path, path);
            })
            .then((/** @type {URI} */absolutePath) => {
                let pathString = absolutePath.toString().substring(base_path.toString().length);

                if (pathString.startsWith('/')) {
                    pathString = pathString.substring(1);
                }

                return pathString;
            })
            .then((/** @type {String} */filePath) => {
                let items = scope.items;
                let result = items[filePath];

                if (!result) {
                    logger.warn(`Not sure why, but ${filePath} was not found in ${items}`);
                }

                return result;
            });
    }
}

export {LocalFileCache}
export default LocalFileCache;