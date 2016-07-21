'use strict';

import Adapter from '../data';
import Money from './Money';
import Currency from './Currency';

class CurrencyAdapter extends Adapter {

    /**
     * @param {Money|Class<Money>|Currency|Class<Currency>} instanceOrClass
     * @return {Boolean}
     */
    supports(instanceOrClass) {
        let money = Money.isInstance(instanceOrClass);
        let currency = Currency.isInstanceOrClass(instanceOrClass);

        return money || currency;
    }

    /**
     *
     * @param {Money|Currency} instance
     * @return {Currency}
     */
    adapt(instance) {
        return Currency.optCurrency(instance);
    }
}

export {CurrencyAdapter};
export default CurrencyAdapter;