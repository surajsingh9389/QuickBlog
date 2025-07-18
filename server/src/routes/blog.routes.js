import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogId,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blog.controller.js";
import upload from "../middleware/multer.js";
import protectRoute from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), protectRoute, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", protectRoute, deleteBlogId);
blogRouter.post("/toggle-publish", protectRoute, togglePublish);

blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);

export default blogRouter;
