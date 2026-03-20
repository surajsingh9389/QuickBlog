import express from "express"
import { adminLogin, approveCommentbyId, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.controller.js'
import protectRoute from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminRouter = express.Router();

// Admin login 
adminRouter.post("/login", asyncHandler(adminLogin))

// Dashboard
adminRouter.get("/dashboard", protectRoute, asyncHandler(getDashboard));

// Get all blogs (admin view)
adminRouter.get("/blogs", protectRoute, asyncHandler(getAllBlogsAdmin));

// Get all comments 
adminRouter.get("/comments", protectRoute, asyncHandler(getAllComments));

// delete comment
adminRouter.delete("/comments/:id", protectRoute, asyncHandler(deleteCommentById));

// Approve comment
adminRouter.patch("/comments/:id/approve", protectRoute, asyncHandler(approveCommentbyId));




export default adminRouter;
