'use strict';

import CoreObject from "../CoreObject";
import Utility from "../Utility";

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */
class UserDescriptor extends CoreObject {

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
        super(...arguments);

        // {
        //     username: username,
        //     requiresNewPassword: requiresNewPassword,
        //     usingTemporaryPassword: usingTemporaryPassword,
        //     usingEmail: usingEmail,
        //     usingVerifiedEmail: usingVerifiedEmail,
        //     emailToken: emailToken,
        //     exists: exists
        // }

        this._username = username;
        this._username = username;
    }

    get username() {
        return this._username;
    }

    get requiresNewPassword() {
        return this._requiresNewPassword;
    }

    get usingTemporaryPassword() {
        return this._usingTemporaryPassword;
    }

    get usingEmail() {
        return this._usingEmail;
    }

    get usingVerifiedEmail() {
        return this._usingVerifiedEmail;
    }

    get exists() {
        return this._exists;
    }

}

export default UserDescriptor;