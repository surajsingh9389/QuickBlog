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

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), protectRoute, addBlog);
blogRouter.post("/delete", protectRoute, deleteBlogId);
blogRouter.post("/toggle-publish", protectRoute, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", protectRoute, generateContent);

blogRouter.get("/all", getAllBlogs);
blogRouter
  .route("/:blogId")
  .get(getBlogById)
  .all((req, res) => res.status(405).json({ error: "Method Not Allowed" }));

export default blogRouter;
