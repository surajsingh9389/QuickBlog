import { xid, z } from "zod"

// // Create Blog 
// export const createBlogSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   subTitle: z.string().optional(),
//   description: z.string().min(10, "Description too short"),
//   category: z.string().min(1, "Category is required"),
//   isPublished: z.boolean().optional(),
// });

// Add Comment 
export const commentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    content: z.string().min(2, "Content is required")
});

// Generate Content 
export const generateSchema = z.object({
    prompt: z.string().min(3, "Prompt is required"),
    part: z.number().optional(),
})
