import express from "express"
import { adminLogin, approveCommentbyId, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.controller.js'
import protectRoute from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminRouter = express.Router();


adminRouter.post("/login", asyncHandler(adminLogin))
adminRouter.post("/delete-comment", protectRoute, asyncHandler(deleteCommentById));
adminRouter.post("/approve-comment", protectRoute, asyncHandler(approveCommentbyId));
adminRouter.get("/comments", protectRoute, asyncHandler(getAllComments));
adminRouter.get("/blogs", protectRoute, asyncHandler(getAllBlogsAdmin));
adminRouter.get("/dashboard", protectRoute, asyncHandler(getDashboard));

export default adminRouter;
