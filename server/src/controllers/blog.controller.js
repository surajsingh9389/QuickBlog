import fs from "fs/promises";
import imagekit from "../lib/imagekit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../lib/gemini.js";
import connectDB from "../lib/db.js";
import mongoose from "mongoose";

await connectDB();

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

export const addBlog = async (req, res) => {
  const { title, subTitle, description, category, isPublished } = JSON.parse(
    req.body.blog
  );
  const imageFile = req.file;

  if (!title || !description || !category || !imageFile) {
    return res.status(400).json({ message: "Missing required fields!" });
  }
  if (!imageFile.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Only images are allowed" });
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

    res.status(201).json({ message: "Blog added successfully", blog });
  } catch (error) {
    console.error("Error in blog controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.log("Error in getAllBlogs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(404).json({ error: "Blog not found" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log("Error in getById controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const deleteBlogId = async (req, res) => {
  const { blogId } = req.body;
  try {
    await Blog.findByIdAndDelete(blogId);
    // Delete all comments associated with the blog
    await Comment.deleteMany({ blog: blogId });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log("Error in deleteBlogId controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const togglePublish = async (req, res) => {
  const { blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.status(200).json({ message: "Blog status updated" });
  } catch (error) {
    console.log("Error in togglePublish controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const addComment = async (req, res) => {
  const { blog, name, content } = req.body;
  try {
    if (!blog || !name || !content) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const comment = await Comment.create({
      blog,
      name,
      content,
      isApproved: false,
    });

    res.status(201).json({ message: "Comment added for review", comment });
  } catch (error) {
    console.error("Error in addComment controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in getBlogComment controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const generateContent = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const content = await main(
//       prompt + " Generate a blog content for this topic in simple text format"
//     );
//     res.status(201).json({ message: "Content generated", content });
//   } catch (error) {
//     console.error("Error in generateContent controller:", error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const generateContent = async (req, res) => {
  console.log("Size of request body:", JSON.stringify(req.body).length);
  const { prompt, part = 0 } = req.body;
  const { label, instr } = PROMPT_SECTIONS[part];
  try {
    const fullPrompt = `${prompt}\n\nInstruction: ${instr}`;
    const content = await main(fullPrompt);
    return res.status(200).json({ content: content.trim(), part });
  } catch (err) {
    console.error("Error generating", label, err);
    res.status(500).json({ message: `Error generating section ${label}` });
  }
};
