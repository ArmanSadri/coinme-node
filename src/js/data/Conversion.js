import CoreObject from "../CoreObject";
import Utility from "../Utility";
import Stopwatch from "../Stopwatch";
import Converter from "./Converter";

class Conversion extends CoreObject {

    /**
     *
     * @param {Object} options
     * @param {*} options.input
     * @param {*} options.output
     * @param {Number} options.duration
     * @param {Stopwatch} options.stopwatch
     * @param {Converter} options.converter
     */
    constructor(options) {
        let input = Utility.take(options, 'input', true);
        let output = Utility.take(options, 'output', true);

        let stopwatch = Utility.take(options, 'stopwatch', Stopwatch, true);
        let converter = Utility.take(options, 'converter', Converter, true);
        let requestor = Utility.take(options, 'requestor');

        super(...arguments);

        this._input = input;
        this._output = output;

        this._stopwatch = stopwatch;
        this._converter = converter;
        this._requestor = requestor;
    }

    /**
     *
     * @return {Stopwatch}
     */
    get stopwatch() {
        return this._stopwatch;
    }

    /**
     * @returns {*|undefined}
     */
    get requestor() {
        return this._requestor;
    }

    /**
     * @returns {*}
     */
    get input() {
        return this._input;
    }

    /**
     * @returns {*}
     */
    get output() {
        return this._output;
    }

    /**
     * @returns {Converter}
     */
    get converter() {
        return this._converter;
    }

    /**
     *
     * @return {*}
     */
    valueOf() {
        if (Utility.isNullOrUndefined(output)) {
            return null;
        }

        if (this.output.valueOf) {
            return this.output.valueOf();
        } else {
            return this.output;
        }
    }

    /**
     * @return {String}
     */
    toString() {
        return `Conversion{ input:'${this.input}', output:'${this.output}' }`;
    }

    /**
     *
     * @return {String}
     */
    static toString() {
        return 'Conversion';
    }

}

export default Conversion;