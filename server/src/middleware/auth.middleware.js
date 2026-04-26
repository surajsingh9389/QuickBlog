import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized - No Token Provided", 401));
    }

    // Extract the token (removes "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized - No Token Provided", 401));
    }

    // jwt.verify throws error automatically if expired or invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Passing {id, role} to the request object
    req.user = decoded;
    next();
  } catch (error) {
    // Default for tampered or malformed tokens
    next(new AppError("Unauthorized - Invalid Token", 401));
  }
};

export default auth;
