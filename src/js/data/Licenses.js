import CoreObject from "../CoreObject";
import Errors from "../errors/Errors";
import Preconditions from "../Preconditions";

/********************************************************
 * @DESCRIPTION: validation for the format of a driver's
 *   license list as of 2012 US Driver's Licenses formats
 * @author: Adam Bullmer
 * @date: 04/04/2013
 *
 * @PARAM: $string, automatic input from form_validation()
 * @EXPECTED-INPUT: alpha-numeric, trimmed
 *
 * @REQUIREMENTS: It is required to validate the DL State
 * field FIRST in order for us to choose which regex rules
 * we will use.
 * @FIELD: 'dl_state'
 * @FIELD-VALUE: 2 uppercase character state abbreviation
 ********************************************************/
let format = {
    'AL': /^[0-9]{1,7}$/, //1-7Numbers
    'AK': /^[0-9]{1,7}$/, //1-7Numbers
    'AZ': /(^[a-zA-Z]{1}[0-9]{8}$)|(^[a-zA-Z]{2}[0-9]{2,5}$)|(^[0-9]{9}$)/, //1Alpha+1-8Numeric or 2Alpha+2-5Numeric or 9Numeric
    'AR': /^[0-9]{4,9}$/, //4-9Numeric
    'CA': /^[a-zA-Z]{1}[0-9]{7}$/, //1Alpha+7Numeric
    'CO': /(^[0-9]{9}$)|(^[a-zA-Z]{1}[0-9]{3,6}$)|(^[a-zA-Z]{2}[0-9]{2,5}$)/, //9Numeric or 1Alpha+3-6Numeric or 2Alpha+2-5Numeric
    'CT': /^[0-9]{9}$/, //9Numeric
    'DE': /^[0-9]{1,7}$/, //1-7Numeric
    'DC': /(^[0-9]{7}$)|(^[0-9]{9}$)/, //7Numeric or 9Numeric
    'FL': /^[a-zA-Z]{1}[0-9]{12}$/, //1Alpha+12Numeric
    'GA': /^[0-9]{7,9}$/, //7-9Numeric
    'HI': /(^[a-zA-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/, //1Alpha+8Numeric or 9Numeric
    'ID': /(^[a-zA-Z]{2}[0-9]{6}[a-zA-Z]{1}$)|(^[0-9]{9}$)/, //2Alpha+6Numeric+1Alpha or 9Numeric
    'IL': /^[a-zA-Z]{1}[0-9]{11,12}$/, //1Alpha+11-12Numeric
    'IN': /(^[a-zA-Z]{1}[0-9]{9}$)|(^[0-9]{9,10}$)/, //1Alpha+9Numeric or 9-10Numeric
    'IA': /^[0-9]{9}|([0-9]{3}[a-zA-Z]{2}[0-9]{4}$)/, //9Numeric or 3Numeric+2Alpha+4Numeric
    'KS': /(^([a-zA-Z]{1}[0-9]{1}){2}[a-zA-Z]{1}$)|(^[a-zA-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/, //1Alpha+1Numeric+1Alpha+1Numeric+1Alpha or 1Alpha+8Numeric or 9Numeric
    'KY': /(^[a-zA_Z]{1}[0-9]{8,9}$)|(^[0-9]{9}$)/, //1Alpha+8-9Numeric or 9Numeric
    'LA': /^[0-9]{1,9}$/, //1-9Numeric
    'ME': /(^[0-9]{7,8}$)|(^[0-9]{7}[a-zA-Z]{1}$)/, //7-8Numeric or 7Numeric+1Alpha
    'MD': /^[a-zA-Z]{1}[0-9]{12}$/, //1Alpha+12Numeric
    'MA': /(^[a-zA-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/, //1Alpha+8Numeric or 9Numeric
    'MI': /(^[a-zA-Z]{1}[0-9]{10}$)|(^[a-zA-Z]{1}[0-9]{12}$)/, //1Alpha+10Numeric or 1Alpha+12Numeric
    'MN': /^[a-zA-Z]{1}[0-9]{12}$/, //1Alpha+12Numeric
    'MS': /^[0-9]{9}$/, //9Numeric
    'MO': /(^[a-zA-Z]{1}[0-9]{5,9}$)|(^[a-zA-Z]{1}[0-9]{6}[R]{1}$)|(^[0-9]{8}[a-zA-Z]{2}$)|(^[0-9]{9}[a-zA-Z]{1}$)|(^[0-9]{9}$)/, //1Alpha+5-9Numeric or 1Alpha+6Numeric+R or 8Numeric+2Alpha or 9Numeric+1Alpha or 9Numeric
    'MT': /(^[a-zA-Z]{1}[0-9]{8}$)|(^[0-9]{13}$)|(^[0-9]{9}$)|(^[0-9]{14}$)/, //1Alpha+8Numeric or 13Numeric or 9Numeric or 14Numeric
    'NE': /^[0-9]{1,7}$/, //1-7Numeric
    'NV': /(^[0-9]{9,10}$)|(^[0-9]{12}$)|(^[X]{1}[0-9]{8}$)/, //9Numeric or 10Numeric or 12Numeric or X+8Numeric
    'NH': /^[0-9]{2}[a-zA-Z]{3}[0-9]{5}$/, //2Numeric+3Alpha+5Numeric
    'NJ': /^[a-zA-Z]{1}[0-9]{14}$/, //1Alpha+14Numeric
    'NM': /^[0-9]{8,9}$/, //8Numeric or 9Numeric
    'NY': /(^[a-zA-Z]{1}[0-9]{7}$)|(^[a-zA-Z]{1}[0-9]{18}$)|(^[0-9]{8}$)|(^[0-9]{9}$)|(^[0-9]{16}$)|(^[a-zA-Z]{8}$)/, //1Alpha+7Numeric or 1Alpha+18Numeric or 8Numeric or 9Numeric or 16 Numeric or 8Alpha
    'NC': /^[0-9]{1,12}$/, //1-12Numeric
    'ND': /(^[a-zA-Z]{3}[0-9]{6}$)|(^[0-9]{9}$)/, //3Alpha+6Numeric or 9Numeric
    'OH': /(^[a-zA-Z]{1}[0-9]{4,8}$)|(^[a-zA-Z]{2}[0-9]{3,7}$)|(^[0-9]{8}$)/, //1Alpha+4-8Numeric or 2Alpha+3-7Numeric or 8Numeric
    'OK': /(^[a-zA-Z]{1}[0-9]{9}$)|(^[0-9]{9}$)/, //1Alpha+9Numeric or 9Numeric
    'OR': /^[0-9]{1,9}$/, //1-9Numeric
    'PA': /^[0-9]{8}$/, //8Numeric
    'RI': /^([0-9]{7}$)|(^[a-zA-Z]{1}[0-9]{6}$)/, //7Numeric or 1Alpha+6Numeric
    'SC': /^[0-9]{5,11}$/, //5-11Numeric
    'SD': /(^[0-9]{6,10}$)|(^[0-9]{12}$)/, //6-10Numeric or 12Numeric
    'TN': /^[0-9]{7,9}$/, //7-9Numeric
    'TX': /^[0-9]{7,8}$/, //7-8Numeric
    'UT': /^[0-9]{4,10}$/, //4-10Numeric
    'VT': /(^[0-9]{8}$)|(^[0-9]{7}[A]$)/, //8Numeric or 7Numeric+A
    'VA': /(^[a-zA-Z]{1}[0-9]{9,11}$)|(^[0-9]{9}$)/, //1Alpha+9Numeric or 1Alpha+10Numeric or 1Alpha+11Numeric or 9Numeric
    'WA': /^(?=.{12}$)[a-zA-Z]{1,7}[a-zA-Z0-9\*]{4,11}$/, //1-7Alpha+any combination of Alpha, Numeric, or * for a total of 12 characters
    'WV': /(^[0-9]{7}$)|(^[a-zA-Z]{1,2}[0-9]{5,6}$)/, //7Numeric or 1-2Alpha+5-6Numeric
    'WI': /^[a-zA-Z]{1}[0-9]{13}$/, //1Alpha+13Numeric
    'WY': /^[0-9]{9,10}$/ //9-10Numeric
};

class Licenses extends CoreObject {

    constructor() {
        super(...arguments);

        // throw new TypeError('Licenses is abstract');

        Preconditions.shouldBeAbstract(Licenses);
    }

    static detectStateFromDriverLicense(string) {
    var match = false;
    var matchingState = '';

    if (string && string.length > 5) {
        // For performance
        Ember.$.each(format, function(state, regex) {
            if (!match && regex.test(string)) {
                match = true;
                matchingState = state;
            }
        });
    }

    if (!match) {
        return undefined;
    }

    Ember.Logger.warn('Did an expensive query for ' + string);
    return {state: matchingState};
}


}