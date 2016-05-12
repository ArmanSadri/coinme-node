'use strict';

import CoreObject from "~/CoreObject";

/**
 * This is the base class for all classes in our architecture.
 *
 * @abstract
 * @class
 */
class User extends CoreObject {

    /**
     *
     * @param {Object} config
     * @param {String} config.phoneNumber
     * @param {String} config.username
     * @param {String} config.firstName
     * @param {String} config.middleName
     * @param {String} config.lastName
     * @param {String} config.race
     * @param {String} config.gender
     * @param {String} config.addressLine1
     * @param {String} config.addressLine2
     * @param {String} config.addressCity
     * @param {String} config.addressState
     * @param {String} config.addressZipcode
     * @param {String} config.addressCountry
     * @param {String} config.birthDate
     * @param {String} config.expirationDate
     */
    constructor(config) {
        super(config);

        /** @type {String} */
        this.firstName = config.firstName;

        /** @type {String} */
        this.lastName = config.lastName;

        /** @type {String} */
        this.middleName = config.middleName;

        /** @type {String} */
        this.addressLine1 = config.addressLine1;

        /** @type {String} */
        this.addressLine2 = config.addressLine2;

        /** @type {String} */
        this.addressCity = config.addressCity;

        /** @type {String} */
        this.addressState = config.addressState;

        /** @type {String} */
        this.addressCountry = config.addressCountry;

        /** @type {String} */
        this.expirationDate = config.expirationDate;

        /** @type {String} */
        this.birthDate = config.birthDate;

        /** @type {String} */
        this.gender = config.gender;

        /** @type {String} */
        this.race = config.race;

        /** @type {String} */
        this.addressZipcode = config.addressZipcode;

        /** @type {String} */
        this.username = config.username;

        /** @type {String} */
        this.phoneNumber = config.phoneNumber;
    }
}

export default User;