import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const message = error.errors?.[0]?.message || "Validation failed";
    next(new AppError(message, 400));
  }
};