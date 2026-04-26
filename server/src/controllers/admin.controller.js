import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import { AppError } from "../utils/AppError.js";
import generateAnswer from "../lib/llm.js";
import imagekit from "../lib/imagekit.js";
import fs from "fs/promises";


export const addBlog = async (req, res, next) => {
  let parsedData;

  try {
    parsedData = JSON.parse(req.body.blog);
  } catch (err) {
    throw new AppError("Invalid blog data format", 400);
  }

  const { title, subTitle, description, category, isPublished } = parsedData;

  const imageFile = req.file;

  if (!title?.trim() || !description?.trim() || !category || !imageFile) {
    throw new AppError("Missing required fields!", 400);
  }

  if (!imageFile.mimetype.startsWith("image/")) {
    throw new AppError("Only images are allowed", 400);
  }

  try {
    const fileBuffer = await fs.readFile(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    // Delete temporary file
    await fs.unlink(imageFile.path);

    const blog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedUrl,
      isPublished,
    });

    res
      .status(201)
      .json({ success: true, message: "Blog added successfully", blog });
  } catch (error) {
    if (imageFile?.path) {
      await fs.unlink(imageFile.path).catch(() => {});
    }
    throw error;
  }
};

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


export const deleteBlogId = async (req, res, next) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Invalid blog ID", 400);
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  await Blog.findByIdAndDelete(blogId);
  // Delete all comments associated with the blog
  await Comment.deleteMany({ blog: blogId });

  res.status(200).json({ success: true, message: "Blog deleted successfully" });
};

export const togglePublish = async (req, res, next) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Invalid blog ID", 400);
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  blog.isPublished = !blog.isPublished;
  await blog.save();
  res.status(200).json({ success: true, message: "Blog status updated" });
};

export const generateContent = async (req, res, next) => {
  const { blogTitle } = req.body;
  const content = await generateAnswer(blogTitle);
  return res.status(200).json({ success: true, content: content.trim()});
};
