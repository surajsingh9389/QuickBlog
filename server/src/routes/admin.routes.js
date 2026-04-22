import express from "express"
import { approveCommentbyId, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.controller.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import auth from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { generateSchema } from "../validations/blog.validation.js";
import { addBlog, deleteBlogId, generateContent, togglePublish } from "../controllers/user.controller.js";

const adminRouter = express.Router();

// Create blog 
adminRouter.post("/", auth, authorize("admin"), upload.single("image"), asyncHandler(addBlog));

// Dashboard
adminRouter.get("/dashboard", auth, authorize("admin"), asyncHandler(getDashboard));

// Get all blogs (admin view)
adminRouter.get("/blogs", auth, authorize("admin"), asyncHandler(getAllBlogsAdmin));

// Get all comments 
adminRouter.get("/comments", auth, authorize("admin"), asyncHandler(getAllComments));

// delete comment
adminRouter.delete("/comments/:id", auth, authorize("admin"), asyncHandler(deleteCommentById));

// Delete blog 
adminRouter.delete("/:blogId", auth, authorize("admin"), asyncHandler(deleteBlogId));

// Toggle pulish 
adminRouter.patch("/:blogId/publish", auth, authorize("admin"), asyncHandler(togglePublish));

// Approve comment
adminRouter.patch("/comments/:id/approve", auth, authorize("admin"), asyncHandler(approveCommentbyId));

// Ai content generation
adminRouter.post("/generate", auth, authorize("admin"), validate(generateSchema), generateContent);


export default adminRouter;
