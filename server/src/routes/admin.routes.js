import express from "express"
import { adminLogin, approveCommentbyId, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.controller.js'
import protectRoute from "../middleware/auth.middleware.js";

const adminRouter = express.Router();


adminRouter.post("/login", adminLogin)
adminRouter.get("/comments", protectRoute, getAllComments);
adminRouter.get("/blogs", protectRoute, getAllBlogsAdmin);
adminRouter.get("/dashboard", protectRoute, getDashboard);
adminRouter.post("/delete-comment", protectRoute, deleteCommentById);
adminRouter.post("/approve-comment", protectRoute, approveCommentbyId);

export default adminRouter;
