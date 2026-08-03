import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res, next) => {
  const error = new ApiError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};
