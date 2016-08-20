// "use strict";
//
// import CoreObject from "../CoreObject";
// import Converter from "./Converter";
// import Money from "./Money";
// import Currency from "./Currency";
// import Lodash from "lodash";
// import Promise from "bluebird";
// import Logger from "winston";
// import Stopwatch from "../Stopwatch"
//
// class Exchange extends CoreObject {
//
//     constructor(options) {
//         super(...arguments);
//
//         this._converters = [];
//     }
//
//     /**
//      * @returns {Array}
//      */
//     get converters() {
//         return this._converters;
//     }
//
//     /**
//      *
//      * @param {Converter} converter
//      * @returns {Exchange}
//      */
//     register(converter) {
//         this.converters.push(converter);
//
//         return this;
//     }
//
//     /**
//      *
//      * @param {Money} money
//      * @param {Class<Currency>} currency
//      * @return {Promise<Conversion<Money>>}
//      */
//     convert(money, currency) {
//         let converters = this.convertersFor(money.currency, currency);
//
//         let answers = Lodash.map(converters, function (/**@type {Converter} */ converter) {
//             return Promise.resolve(converter.convert(money, currency));
//         });
//
//         let stopwatch = new Stopwatch();
//
//         return Promise.any(answers)
//             .then((/** @type {Money} */ answer) => {
//                 Logger.debug(`Converter ${money} to ${answer}`);
//
//                 return answer;
//             });
//     }
//
//     /**
//      * @param {Class<Currency>} sourceCurrency
//      * @param {Class<Currency>} destinationCurrency
//      * @returns {Array}
//      */
//     convertersFor(sourceCurrency, destinationCurrency) {
//         Currency.shouldBeCurrency(sourceCurrency, 'sourceCurrency must be a currency');
//         Currency.shouldBeCurrency(destinationCurrency, 'destinationCurrency must be a currency');
//
//         return Lodash.filter(this.converters, function (/** @type {Converter} */converter) {
//             return converter.canConvert(sourceCurrency, destinationCurrency);
//         });
//     }
//
// }
//
// export default Exchange;
"use strict";
//# sourceMappingURL=Exchange.js.map