import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import User from "../models/user.model.js";


export const getAllBlogs = async (req, res, next) => {
  const blogs = await Blog.find({ isPublished: true }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, blogs });
};

export const getBlogById = async (req, res, next) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Blog not found", 404);
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError("Blog not found", 404);
  }
  res.status(200).json({ success: true, blog });
};


export const addComment = async (req, res, next) => {
  const { content } = req.body;
  const { blogId, userId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Invalid blog ID", 400);
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const blog = await Blog.findById(blogId);
  const user = await User.findById(userId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const comment = await Comment.create({
    blog: blogId,
    user: userId,
    name: user.name,
    content,
    isApproved: false,
  });

  res
    .status(201)
    .json({ success: true, message: "Comment added for review", comment });
};

export const getBlogComments = async (req, res, next) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Invalid blog ID", 400);
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  const comments = await Comment.find({
    blog: blogId,
    isApproved: true,
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, comments });
};
