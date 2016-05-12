import CoreObject from "~/CoreObject";
import User from "~/data/User";
import Lodash from "lodash";

let SPEC_VERSION_8 = {
    'DBA': 'expirationDate',
    'DAC': 'firstName',
    'DCS': 'lastName',
    'DAD': 'middleName',
    'DBB': 'birthDate',
    'DCB': 'gender',
    'DAG': 'addressLine1',
    'DAH': 'addressLine2',
    'DAI': 'addressCity',
    'DAJ': 'addressState',
    'DAK': 'addressZipcode',
    'DAQ': 'username',
    'DCG': 'addressCountry',
    'DCL': 'race'
};

class UserBuilder extends CoreObject {
    
    static get SPEC_VERSION_8() {
        return SPEC_VERSION_8;
    }

    /**
     *
     * @param {Object} options
     * @param {String} options.DBA expirationDate
     * @param {String} options.DAC firstName
     * @param {String} options.DCS lastName
     * @param {String} options.DAD middleName
     * @param {String} options.DBB birthDate
     * @param {String} options.DCB gender
     * @param {String} options.DAG addressLine1
     * @param {String} options.DAH addressLine2
     * @param {String} options.DAI addressCity
     * @param {String} options.DAJ addressState
     * @param {String} options.DAK addressZipcode
     * @param {String} options.DAQ username
     * @param {String} options.DCG addressCountry
     * @param {String} options.DCL race
     *
     * @returns {User}
     */
    static fromVersion8(options) {
        return UserBuilder.fromSpec(UserBuilder.SPEC_VERSION_8, options);
    }

    static fromSpec(spec, options) {
        var object = {};

        Lodash.forEach(spec, function(value, key) {
            object[value] = options[key];
        });

        return new User(object);
    }
}

export default UserBuilder;