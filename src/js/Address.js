import Utility from './Utility';
import CoreObject from './CoreObject';
import URI from 'urijs';

/**
 * A class for uniquely identifying something.
 */
export default class Address extends CoreObject {

    constructor(options) {
        if (Utility.isString(options)) {
            let string = options;
            options = { value: string };
        }

        super(options);

        var uri = URI(options.value);

        this._scheme = uri.scheme();
    }

    toString() {

    }

    valueOf() {

    }
    
    static toString() {

    }
}