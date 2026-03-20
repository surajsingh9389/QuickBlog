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

const blogRouter = express.Router();

blogRouter.post("/add", protectRoute, upload.single("image"), asyncHandler(addBlog));
blogRouter.post("/delete", protectRoute, asyncHandler(deleteBlogId));
blogRouter.post("/toggle-publish", protectRoute, asyncHandler(togglePublish));
blogRouter.post("/add-comment", asyncHandler(addComment));
blogRouter.post("/comments", asyncHandler(getBlogComments));
blogRouter.post("/generate", protectRoute, asyncHandler(generateContent));

blogRouter.get("/all", asyncHandler(getAllBlogs));
blogRouter
  .route("/:blogId")
  .get(asyncHandler(getBlogById))
  .all((req, res) => res.status(405).json({ error: "Method Not Allowed" }));

export default blogRouter;
