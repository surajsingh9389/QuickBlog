import { xid, z } from "zod"


// Patterns that suggest prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(previous|above|prior|all)\s+(instructions?|prompts?|rules?)/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(a|an)?/i,
  /forget\s+(everything|all|your|previous)/i,
  /new\s+instruction/i,
  /system\s*:/i,
  /\[INST\]/i,
  /<\s*system\s*>/i,
  /jailbreak/i,
  /pretend\s+(you|to)/i,
  /override\s+(your|the)\s+(instructions?|settings?|rules?)/i,
  /disregard\s+(your|previous|all)/i,
];

// Patterns that are clearly NOT blog titles
const NON_BLOG_PATTERNS = [
  /^[\d\s\+\-\*\/\=\(\)\.]+$/, // pure math expression e.g. "2 + 2 = 4"
  /^[^a-zA-Z]+$/,               // no alphabetic characters at all
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b/i, // SQL injection
  /<script[\s>]/i,              // XSS attempt
  /javascript:/i,
];

// At least 2 real words (not just symbols or single chars)
const hasMeaningfulWords = (title) => {
  const words = title.trim().split(/\s+/).filter((w) => /[a-zA-Z]{2,}/.test(w));
  return words.length >= 2;
};

const hasNoInjection = (title) => {
  return !INJECTION_PATTERNS.some((pattern) => pattern.test(title));
};

const isBlogLikeTitle = (title) => {
  return !NON_BLOG_PATTERNS.some((pattern) => pattern.test(title));
};

// Validation schema for comments
export const commentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    content: z.string().min(2, "Content is required")
});

// Validation schema for blog content generation
export const generateSchema = z.object({
  blogTitle: z
    .string({ required_error: "Blog title is required" })
    // Step 1: Normalize — trim and collapse internal spaces
    .transform((val) => val.trim().replace(/\s+/g, " "))
    // Step 2: Length check
    .pipe(
      z
        .string()
        .min(10, "Blog title is too short — please be more descriptive (min 10 characters)")
        .max(150, "Blog title is too long (max 150 characters)")
        // Step 3: No pure special-character or numeric-only titles
        .refine(isBlogLikeTitle, {
          message: "Blog title doesn't look valid — please enter a proper blog topic",
        })
        // Step 4: Require at least 2 real words
        .refine(hasMeaningfulWords, {
          message: "Blog title must contain at least 2 meaningful words",
        })
        // Step 5: Block prompt injection attempts
        .refine(hasNoInjection, {
          message: "Invalid input detected — please enter a valid blog title",
        })
    ),
});
