'use strict';

import CoreObject from "../CoreObject";
import Utility from "../Utility";

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */
class UserExistenceToken extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {String} options.username
     * @param {Boolean} options.requiresNewPassword
     * @param {Boolean} options.usingTemporaryPassword
     * @param {Boolean} options.usingVerifiedEmail
     * @param {Boolean} options.usingEmail
     * @param {String} options.emailToken
     * @param {Boolean} options.exists
     */
    constructor(options) {
        let username = Utility.take(options, 'username', 'string', true);
        let requiresNewPassword = Utility.take(options, 'requiresNewPassword', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        let usingTemporaryPassword = Utility.take(options, 'usingTemporaryPassword', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        let usingVerifiedEmail = Utility.take(options, 'usingVerifiedEmail', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        let usingEmail = Utility.take(options, 'usingEmail', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });
        let emailToken = Utility.take(options, 'emailToken', 'string', false);
        let exists = Utility.take(options, 'exists', {
            type: 'boolean',
            defaultValue: false,
            required: false
        });

        super(...arguments);

        this._requiresNewPassword = requiresNewPassword;
        this._usingVerifiedEmail = usingVerifiedEmail;
        this._usingEmail = usingEmail;
        this._usingTemporaryPassword = usingTemporaryPassword;
        this._emailToken = emailToken;
        this._exists = exists;
        this._username = username;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|String}
     * @return {undefined|String}
     */
    get emailToken() {
        return this._emailToken;
    }

    /**
     * @property
     * @readonly
     * @type {String}
     * @return {String}
     */
    get username() {
        return this._username;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Boolean}
     * @return {undefined|Boolean}
     */
    get requiresNewPassword() {
        return this._requiresNewPassword;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Boolean}
     * @return {undefined|Boolean}
     */
    get usingTemporaryPassword() {
        return this._usingTemporaryPassword;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Boolean}
     * @return {undefined|Boolean}
     */
    get usingEmail() {
        return this._usingEmail;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Boolean}
     * @return {undefined|Boolean}
     */
    get usingVerifiedEmail() {
        return this._usingVerifiedEmail;
    }

    /**
     * @property
     * @readonly
     * @type {undefined|Boolean}
     * @return {undefined|Boolean}
     */
    get exists() {
        return this._exists;
    }

    toJson() {
        return super.toJson({
            username: this.username,
            requiresNewPassword: this.requiresNewPassword,
            usingTemporaryPassword: this.usingTemporaryPassword,
            usingEmail: this.usingEmail,
            usingVerifiedEmail: this.usingVerifiedEmail,
            emailToken: this.emailToken,
            exists: this.exists
        });
    }

}

export {UserExistenceToken};
export default UserExistenceToken;