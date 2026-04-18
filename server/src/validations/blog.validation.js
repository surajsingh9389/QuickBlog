import { xid, z } from "zod"

// Add Comment 
export const commentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    content: z.string().min(2, "Content is required")
});

// Generate Content 
export const generateSchema = z.object({
    blogTitle: z
    .string()
    .min(3, "Blog Title too short")
    .max(150, "Blog Title too long")
})
