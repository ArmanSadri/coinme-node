import Utility from "../Utility";
import URI from "urijs";
import Preconditions from "../Preconditions";
import osenv from "osenv";
import Promise from "bluebird";
import {Cache} from "../cache";
import fs from "fs";
import ResourceLoader from "./ResourceLoader";

class FileResourceLoader extends ResourceLoader {

    //region constructor
    /**
     *
     * @param {Object} [options]
     * @param {Cache} [options.cache]
     * @param {String|URI} [options.path] defaults to osenv.tempdir()
     */
    constructor(options) {
        //region let path
        /** @type {URI} */
        let path = Utility.take(options, 'path', {
            required: true,
            adapter: function (value) {
                if (!value) {
                    value = URI(osenv.tmpdir());
                }

                return Utility.getPath(value);
            },
            validator: function (value) {
                Preconditions.shouldBeInstanceOf(value, URI, 'uri');
            }
        });
        //endregion

        super(options);

        this._path = path;

        this._startedLatch = Promise.resolve();
    }

    //endregion

    //region getters/setters
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
     * @param {String|URI} path
     * @returns {Promise}
     */
    load(path) {
        let baseUri = this.path;

        return Promise
            .resolve()
            .then(() => {
                return Utility.getPath({
                    baseUri: baseUri,
                    uri: path
                });
            })
            .then((/** @type {String} */path) => {
                path = path.toString();

                return Promise.fromNode((callback) => {
                    fs.readFile(path, callback);
                });
            })
    }
}

export {FileResourceLoader};
export default FileResourceLoader;