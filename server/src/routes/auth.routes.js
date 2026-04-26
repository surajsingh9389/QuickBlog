import express from "express"
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const authRouter = express.Router()

authRouter.post("/register", validate(registerSchema), asyncHandler(register));
authRouter.post("/login", validate(loginSchema), asyncHandler(login));

export default authRouter;  