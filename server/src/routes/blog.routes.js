import express from "express";
import {
  addComment,
  getAllBlogs,
  getBlogById,
  getBlogComments,
} from "../controllers/blog.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.middleware.js";
import { commentSchema } from "../validations/blog.validation.js";
import auth from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

// Get all blogs 
blogRouter.get("/", auth, asyncHandler(getAllBlogs));

// Get single blog 
blogRouter.get("/:blogId", auth, asyncHandler(getBlogById));

// Add comment to blog 
blogRouter.post("/:blogId/:userId/comments", auth, validate(commentSchema), asyncHandler(addComment));

// Get comments of a blog
blogRouter.get("/:blogId/comments", auth, asyncHandler(getBlogComments));

export default blogRouter;
