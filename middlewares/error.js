const { status } = require("http-status");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (err.code && err.message) {
    const statusCode =
      err.code === "auth/invalid-argument" ||
      err.code === "auth/invalid-credential"
        ? status.BAD_REQUEST
        : status.INTERNAL_SERVER_ERROR;

    const message = err.message || status[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR;
    const message = error.message || status[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[status.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }
  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
