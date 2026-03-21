import fs from "fs/promises";
import imagekit from "../lib/imagekit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../lib/gemini.js";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

const PROMPT_SECTIONS = [
  {
    label: "Introduction",
    instr:
      "Write a 4–6 sentence engaging intro that hooks the reader in simple text format.",
  },
  {
    label: "Main Section 1",
    instr:
      "Write strictly in 100 words at maximum with a subheading explaining the first key point in simple text format.",
  },
  {
    label: "Main Section 2",
    instr:
      "Write strictly in 100 words at maximum under a subheading covering the second key point in simple text format.",
  },
  {
    label: "Main Section 3",
    instr:
      "Write strictly in 100 words at maximum under a subheading covering the third key point in simple text format.",
  },
  {
    label: "Conclusion",
    instr:
      "Write strictly between a 2–3 sentence concluding paragraph with a call-to-action in simple text format.",
  },
];

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

export const addComment = async (req, res, next) => {
  const { name, content } = req.body;
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new AppError("Invalid blog ID", 400);
  }

  if (!name?.trim() || !content) {
    throw new AppError("Missing required fields!", 400);
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  const comment = await Comment.create({
    blog: blogId,
    name,
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

export const generateContent = async (req, res, next) => {
  const { prompt, part = 0 } = req.body;

  if (!prompt?.trim()) {
    throw new AppError("Prompt is required", 400);
  }

  const { label, instr } = PROMPT_SECTIONS[part] || {};

  if (!instr) {
    throw new AppError("Invalid content section", 400);
  }
  const fullPrompt = `${prompt}\n\nInstruction: ${instr}`;
  const content = await main(fullPrompt);
  return res.status(200).json({ success: true, content: content.trim(), part });
};
