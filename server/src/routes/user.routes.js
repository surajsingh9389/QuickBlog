import express from "express";
import {
  addComment,
  getAllBlogs,
  getBlogById,
  getBlogComments,
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.middleware.js";
import { commentSchema } from "../validations/blog.validation.js";
import auth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

// Get all blogs 
userRouter.get("/", auth, asyncHandler(getAllBlogs));

// Get single blog 
userRouter.get("/:blogId", auth, asyncHandler(getBlogById));

// Add comment to blog 
userRouter.post("/:blogId/comments", auth, validate(commentSchema), asyncHandler(addComment));

// Get comments of a blog
userRouter.get("/:blogId/comments", auth, asyncHandler(getBlogComments));

export default userRouter;
