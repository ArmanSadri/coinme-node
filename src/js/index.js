'use strict';

import Coinme from "./Coinme";
import Ember from "./Ember";
import CoreObject from "./CoreObject";
import Functions from "./Functions";
import Preconditions from "./Preconditions";
import Utility from "./Utility";
import Address from "./Address";

import errors from "./errors/index";
import slack from "./slack/index";
import data from "./data/index";
import cache from "./cache/index";
import money from "./money/index";

export {slack}
export {data}
export {errors}
export {cache}
export {money}

export {Ember};
export {Coinme};
export {CoreObject};
export {Functions};
export {Preconditions};
export {Utility};
export {Address};

export default {
    slack,
    data,
    errors,
    cache,
    money,

    Ember,
    Coinme,
    CoreObject,
    Functions,
    Preconditions,
    Utility,
    Address
};