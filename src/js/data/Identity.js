import CoreObject from "../CoreObject";
import Address from "../Address";
import Utility from "../Utility";
import URI from "urijs";
import Lodash from "lodash";

/**
 * This class represents a User pointer.
 *
 * One user could possibly have more than 1 identity associated with them.
 *
 * It is best to use a Natural Key for an Identity
 */
class Identity extends CoreObject {

    /**
     * @type {Address}
     */
    _address;

    /**
     * @type {Object}
     */
    _attributes;

    //region constructor
    /**
     *
     * @param {String|URI|{address:Address, attributes?:Object}} options
     */
    constructor(options) {
        let address;
        let attributes = {};

        if (Utility.isObject(options)) {
            address = Utility.take(options, 'address');
            attributes = Utility.take(options, 'attributes', 'object');
        } else {
            address = Address.toAddressWithDefaultScheme(options, 'identity');
        }

        super(...arguments);

        this._address = Address.shouldBeInstance(address, 'address is required');
        this._attributes = attributes; // this is optional
    }
    //endregion

    //region properties
    /**
     *
     * @return {Address}
     */
    get address() {
        return this._address;
    }

    /**
     * Optional attributes
     *
     * @return {Object}
     */
    get attributes() {
        return this._attributes;
    }
    //endregion

    toString() {
        /** @type {URI} */
        var uri = this.address.uri.clone();

        Lodash.each(this.attributes || {}, function(value, key) {
            uri = uri.addSearch(key, value);
        });

        return uri.toString();
    }

    toJson() {
        return super.toJson({
            address: this.toString()
        });
    }
}

export {Identity};
export default Identity;