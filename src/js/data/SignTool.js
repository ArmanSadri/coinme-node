'use strict';

import jwt from "jsonwebtoken";
import Preconditions from "../Preconditions";
import Utility from '../Utility';
import CoreObject from '../CoreObject'

/**
 * @class SignTool
 */
class SignTool extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {String} [options.secret]
     * @param {String} [options.issuer]
     */
    constructor(options) {
        let secret = Utility.take(options, 'secret', 'string', false);
        let issuer = Utility.take(options, 'issuer', 'string', false);

        super(...arguments);

        this._issuer = issuer;
        this._secret = secret;
    }

    /**
     * @readonly
     * @property
     * @type {String}
     * @return {String}
     */
    get issuer() {
        return this._issuer;
    }

    /**
     * @readonly
     * @property
     * @type {String}
     * @returns {String}
     */
    get secret() {
        return this._secret;
    }

    /**
     *
     * @param {String} token
     * @param {Object} options
     * @param {boolean|String} [options.issuer]
     * @param {boolean|String} [options.subject]
     * @param {boolean|String} [options.audience]
     * @static
     */
    containsHeaders(token, options) {
        // Will crash if not valid

        let decodedObject = jwt.decode(token, {
            complete: true
        });

        // let result = decodedObject.payload;
        let payload = decodedObject.payload;

        {
            let requiresAudience = Utility.isTrue(options.audience);
            let hasAudience = !Utility.isBlank(payload.aud);

            if (requiresAudience && !hasAudience) {
                return null;
            }
        }

        {
            let requiresIssuer = Utility.isTrue(options.issuer);
            let hasIssuer = !Utility.isBlank(payload.iss);

            if (requiresIssuer && !hasIssuer) {
                return null;
            }
        }

        {
            let requiredSubject = Utility.isTrue(options.subject);
            let hasSubject = !Utility.isBlank(payload.sub);

            if (requiredSubject && !hasSubject) {
                return null;
            }
        }

        // TODO: verify the signature somehow?

        return true;
    }

    /**
     *
     * @param {String} token
     * @param {Object} options
     * @param {String} [options.issuer]
     * @param {String} [options.subject]
     * @param {String} [options.audience]
     * @static
     */
    read(token, options) {
        let secret = this.secret;

        // Will crash if not valid
        jwt.verify(token, secret, options);

        return jwt.decode(token, secret);
    }

    /**
     *
     * @param {Object} object
     * @param {Object} options
     * @param {String} [options.issuer]
     * @param {String} [options.subject]
     * @param {String} [options.audience]
     * @param {String} [options.secret]
     * @return {String} token
     * @static
     */
    write(object, options) {
        let secret = Utility.defaultValue(options.secret, this.secret);

        Preconditions.shouldBeObject(object);

        return jwt.sign(object, secret, options);
    }
}

export {SignTool};
export default SignTool;