'use strict';

import Errors from "./Errors";
import AbstractError from "./AbstractError";
import PreconditionsError from "./PreconditionsError";
import HttpError from './HttpError';

export {Errors};
export {HttpError};
export {AbstractError};
export {PreconditionsError};

export default {
    Errors: Errors,
    AbstractError: AbstractError,
    HttpError: HttpError,
    PreconditionsError: PreconditionsError
}