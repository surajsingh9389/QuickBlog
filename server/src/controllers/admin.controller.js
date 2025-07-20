import { generateToken } from "../lib/utils.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    const token = generateToken(email);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error in admin controller', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.log("Error in getAllBlogsAdmin controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in getAllComments controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
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

    res.status(201).json(dashboardData);
  } catch (error) {
    console.error("Error in getDashboard controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCommentById = async (req, res) => {
  const { id } = req.body;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCommentById controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const approveCommentbyId = async (req, res) => {
  const { id } = req.body;
  try {
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({ message: "Comment approve successfully" });
  } catch (error) {
    console.log("Error in approveCommentbyId controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
