import AbstractError from "./AbstractError";
import Lodash from "lodash";
import Utility from "../Utility";

class HttpError extends AbstractError {

    /**
     *
     * @param {String|Object} options
     */
    constructor(options) {
        if (Utility.isString(options)) {
            let message = options;

            options = { message: message };
        }

        /**
         * @type {String}
         */
        let message = Utility.take(options, 'message', Utility.isString);

        super(message);

        // optional
        this._statusCode = Utility.take(options, 'statusCode', Utility.isNumber);
        this._properties = Utility.take(options, 'properties', Utility.isNotFunction);
    }

    get properties() {
        return this._properties;
    }

    /**
     * @returns {Number}
     */
    get statusCode() {
        return this._statusCode;
    }

    toJSON() {
        return Lodash.assign(super.toJSON(), {
            statusCode: this.statusCode,
            message: this.message,
            name: this.name,
            properties: this.properties
        });
    }

}

export default HttpError;