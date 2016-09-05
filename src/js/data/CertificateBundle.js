"use strict";

import fs from "fs";
import Preconditions from "../Preconditions";
import Utility from "../Utility";
import CoreObject from "../CoreObject";
import URI from "urijs";
import osenv from "osenv";
import {ResourceLoader, FileResourceLoader, CachedResourceLoader} from "./";
import {LocalFileCache} from "../cache";
import Promise from "bluebird";

/**
 * @class
 */
class Certificate extends CoreObject {

    _started;
    _startedLatch;

    /**
     *
     * @param {Object} options
     * @param {String|URI} options.path
     */
    constructor(options) {
        //region let uri
        /** @type {URI} */
        let uri = Utility.take(options, 'path', {
            required: true,
            adapter(value) {
                return Utility.getPath(value);
            }
        });
        //endregion

        //region let resourceLoader
        /** @type {ResourceLoader} */
        let resourceLoader = Utility.take(options, 'resourceLoader', {
            adapter: function(value) {
                if (!value) {
                    let directoryPath = uri.clone().filename('');

                    value = new CachedResourceLoader({
                        resourceLoader: new FileResourceLoader({
                            path: directoryPath,
                            cache: new LocalFileCache({
                                path: directoryPath
                            })
                        })
                    });
                }

                return value;
            }
        });
        //endregion

        super(...arguments);

        this._uri = uri;
        this._path = this.uri.toString();
        this._name = this.uri.filename();
        this._resourceLoader = resourceLoader;

        //region startedLatch
        let scope = this;

        this._startedLatch = new Promise((resolve, reject) => {
            let promise = Promise.resolve();

            promise = promise.then(() => resourceLoader.startedLatch);

            promise = promise.then(() => {
                return this
                    .open()
                    .then((value) => {
                        scope._value = value;
                    });
            });

            resolve(promise);
        });

        this._startedLatch.finally(() => scope._started = true);
        //endregion
    }

    //region getters/setters
    /**
     * @property
     * @readonly
     * @type {Boolean}
     * @return {Boolean}
     */
    get started() {
        return this._started;
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

    /**
     * @property
     * @readonly
     * @type {ResourceLoader}
     * @return {ResourceLoader}
     */
    get resourceLoader() {
        return this._resourceLoader;
    }

    /**
     * @readonly
     * @property
     * @type {URI}
     * @return {URI}
     */
    get uri() {
        return this._uri;
    }

    /**
     * @readonly
     * @property
     * @type {String}
     * @return {String}
     */
    get path() {
        return this._path;
    }

    /**
     * @readonly
     * @property
     * @type {String}
     * @return {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @readonly
     * @property
     * @throws {Error}
     */
    get value() {
        Preconditions.shouldBeTrue(this._started, 'is not started yet');
        Preconditions.shouldBeTrue(this.startedLatch.isFulfilled(), 'must be started');
        Preconditions.shouldBeFalsey(this.startedLatch.isCancelled(), 'must be started');
        Preconditions.shouldBeFalsey(this.startedLatch.isRejected(), 'must not be rejected');
        Preconditions.shouldBeTrue(this.startedLatch.isResolved(), 'must be resolved');

        return this._value;
    }
    //endregion

    /**
     * @return {Buffer}
     */
    open() {
        let scope = this;

        return this.resourceLoader.load(this.path)
            .then((value) => {
                scope._value = value;

                return value;
            });
    }
}

/**
 * System for bundling 3 keys together (key, cert, and ca)
 *
 * @class
 */
class CertificateBundle extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {Certificate} options.certificate
     * @param {Certificate} options.key
     * @param {Certificate} options.authority
     */
    constructor(options) {
        function adapter(value) {
            if (Utility.isString(value) || value instanceof URI) {
                return new Certificate({path: value});
            }

            return value;
        }

        /** @type {Certificate} */
        let certificate = Utility.take(options, 'certificate', {
            required: true,
            adapter: adapter
        });

        /** @type {Certificate} */
        let key = Utility.take(options, 'key', {
            required: true,
            adapter: adapter
        });

        /** @type {Certificate} */
        let authority = Utility.take(options, 'authority', {
            required: true,
            adapter: adapter
        });

        super(options);

        this._authority = authority;
        this._key = key;
        this._certificate = certificate;

        //region startedLatch
        this._startedLatch = new Promise((resolve, reject) => {
            let promise = Promise.resolve();

            if (authority) {
                promise = promise.then(() => authority.open())
            }
            if (key) {
                promise = promise.then(() => key.open());
            }

            if (certificate) {
                promise = promise.then(() => certificate.open());
            }

            resolve(promise);
        });
        //endregion
    }

    //region getters/setters
    get startedLatch() {
        return this._startedLatch;
    }

    /**
     * @readonly
     * @property
     * @type {Certificate}
     * @return {Certificate}
     */
    get certificate() {
        return this._certificate;
    }

    /**
     * @readonly
     * @property
     * @type {Certificate}
     * @return {Certificate}
     */
    get key() {
        return this._key;
    }

    /**
     * @readonly
     * @property
     * @type {Certificate}
     * @return {Certificate}
     */
    get authority() {
        return this._authority;
    }
    //endregion

    /**
     * coinme-node-key.pem
     * coinme-node-cert.pem
     * coinme-wallet-ca-cert.pem
     *
     * @param {String} path example ~/.coinme-node
     * @return {CertificateBundle}
     */
    static fromFolder(path) {
        let uri = URI((Utility.getPath(path)).toString() + '/'); // fixes the bug when the folder has a leading dot.

        return new CertificateBundle({
            key: uri.filename('coinme-node-key.pem').clone(),
            certificate: uri.filename('coinme-node-cert.pem').clone(),
            authority: uri.filename('coinme-wallet-ca-cert.pem').clone()
        });
    }

    static fromHome() {
        return CertificateBundle.fromFolder('~/.coinme-node');
    }
}

export {Certificate};
export {CertificateBundle};

export default CertificateBundle;