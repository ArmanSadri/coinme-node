import Identity from "data/Identity";
import Snowflake from "node-snowflake";
import fs from "fs";
import CoreObject from "./CoreObject";
import Utility from "./Utility";
import Preconditions from "./Preconditions";
import {CertificateBundle} from "./data/CertificateBundle";
import osenv  from "osenv";

class Environment extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {Identity} options.identity
     * @param {Object} options.configuration
     */
    constructor(options) {
        let identity = Utility.take(options, 'identity', Identity, true);
        let configuration = Utility.take(options, 'configuration', false);
        let certificate = Utility.take(options, 'certificate', {
            required: true,
            adapter(value) {
                if (!value) {
                    return CertificateBundle.fromHome();
                }

                return value;
            }
        });

        super(options);

        this._identity = identity;
        this._configuration = configuration;
        this._certificate = certificate;
    }

    /**
     * @returns {{
     *  hostname:String,
     *  user:String,
     *  tmpdir:String,
     *  home: function,
     *  searchPaths: Array,
     *  editor: function,
     *  shell:Object
     * }}
     */
    get runtime() {
        return {
            hostname: osenv.host(),
            whoami: osenv.user(),
            tmpdir: osenv.tmpdir(),
            home: osenv.home()
        };
    }

    /**
     * @return {Identity}
     */
    get identity() {
        return this._identity;
    }

    /**
     *
     * @return {CertificateBundle}
     */
    get certificate() {
        return this._certificate;
    }

    /**
     * @property
     * @readonly
     * @returns {Object}
     */
    get configuration() {
        return this._configuration;
    }
}

export {Environment};
export default Environment;