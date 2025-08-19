import httpStatus from 'http-status';
// import mongoose from 'mongoose';
import { MongoError } from 'mongodb';
// import config from '../../../config/config.js';
// import { logger } from '../config/logger.js';
import ApiError from '../utils/apiError.js';
import { getEnvironment } from '../../config/environment.js';

const errorConverter = (err, req, res, next) => {
    let error = err;

    // Handle MongoDB specific errors
    if (err instanceof MongoError) {
        // MongoDB driver error handling
        let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        let message = 'MongoDB Error';

        switch (err.code) {
        case 11000: // Duplicate key error
            statusCode = httpStatus.CONFLICT;
            message = 'Duplicate Key Error';
            break;
            // Add more cases for other MongoDB error codes as needed
        default:
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = 'Server Error';
            break;
        }

        error = new ApiError(statusCode, message, true, err.stack);
    } else if (!(error instanceof ApiError)) {
        // Handle other unexpected errors
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }

    next(error);
};

const errorHandler = (err, req, res, next) => {
    const environment = getEnvironment();
    let { statusCode, message } = err;
    if (environment === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        hasRoleAccess: err.hasRoleAccess,
        ...(environment === 'development' && { stack: err.stack }),
    };

    //   if (config.env === 'development' || config.env === 'production') {
    //     logger.error(err);
    //   }

    res.status(statusCode).send(response);
};

export {
    errorConverter,
    errorHandler,
};
