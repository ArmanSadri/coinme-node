'use strict';

import Errors from "./Errors";
import AbstractError from "./AbstractError";
import PreconditionsError from "./PreconditionsError";
import HttpError from './HttpError';
import NotImplementedError from './NotImplementedError';

export {Errors};
export {HttpError};
export {AbstractError};
export {PreconditionsError};
export {NotImplementedError};

export default {
    Errors: Errors,
    HttpError: HttpError,
    AbstractError: AbstractError,
    PreconditionsError: PreconditionsError,
    NotImplementedError: NotImplementedError
}