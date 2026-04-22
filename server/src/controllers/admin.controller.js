import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import { AppError } from "../utils/AppError.js";

export const getAllBlogsAdmin = async (req, res, next) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json({success: true, blogs});
};

export const getAllComments = async (req, res, next) => {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.status(200).json({success: true, comments});
};

export const getDashboard = async (req, res) => {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    res.status(200).json({success: true, dashboardData});
};

export const deleteCommentById = async (req, res, next) => {
  const { id } = req.params;
    
    if(!mongoose.isValidObjectId(id)){
      throw new AppError("Invalid comment ID", 400);
    }

    const comment = await Comment.findById(id);

    if(!comment){
      throw new AppError("Comment not found", 404)
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
};

export const approveCommentbyId = async (req, res, next) => {
  const { id } = req.params;
    
    if(!mongoose.isValidObjectId(id)){
      throw new AppError("Invalid comment ID", 400)
    }

    const comment = await Comment.findById(id);

    if(!comment){
      throw new AppError("Comment not found", 404)
    }

    comment.isApproved = true;
    await comment.save();

    res.status(200).json({ success: true, message: "Comment approve successfully" });
};
