import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogId,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blog.controller.js";
import upload from "../middleware/multer.js";
import protectRoute from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { commentSchema, generateSchema } from "../validations/blog.validation.js";

const blogRouter = express.Router();

// Create blog 
blogRouter.post("/", protectRoute, upload.single("image"), asyncHandler(addBlog));

// Get all blogs 
blogRouter.get("/", asyncHandler(getAllBlogs));

// Get single blog 
blogRouter.get("/:blogId", asyncHandler(getBlogById));

// Delete blog 
blogRouter.delete("/:blogId", protectRoute, asyncHandler(deleteBlogId));

// Toggle pulish 
blogRouter.patch("/:blogId/publish", protectRoute, asyncHandler(togglePublish));

// Add comment to blog 
blogRouter.post("/:blogId/comments", validate(commentSchema), asyncHandler(addComment));

// Get comments of a blog
blogRouter.get("/:blogId/comments", asyncHandler(getBlogComments));

// Ai content generation
blogRouter.post("/generate", protectRoute, validate(generateSchema), generateContent);


export default blogRouter;
