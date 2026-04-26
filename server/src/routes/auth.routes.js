import express from "express"
import { login, register, verifyToken } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import auth from "../middleware/auth.middleware.js";


const authRouter = express.Router()

authRouter.post("/register", validate(registerSchema), asyncHandler(register));
authRouter.post("/login", validate(loginSchema), asyncHandler(login));
authRouter.get("/verify", auth, asyncHandler(verifyToken));

export default authRouter;  