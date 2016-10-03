import Ember from "./Ember";

class Coinme {

    /**
     *
     * @param {Object} object
     * @param {String} propertyName
     * @return {*}
     */
    static get(object, propertyName) {
        return Ember.get(object, propertyName);
    }

    /**
     *
     * @param {Object} object
     * @param {String} propertyName
     * @param {*} propertyValue
     */
    static set(object, propertyName, propertyValue) {
        return Ember.set(object, propertyName, propertyValue);
    }
}

export default Coinme;