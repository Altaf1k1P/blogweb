import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  // If error is not an instance of ApiError, convert it
  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
    errors = [];
  }

  logger.error(`Error handler: ${message}`, {
    stack: err.stack,
    errors
  });

  res.status(statusCode || 500).json({
    status: "error",
    statusCode: statusCode || 500,
    message,
    errors
  });
};
