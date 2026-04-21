import { AppError } from "./AppError.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_WORDS = 600;
const MAX_WORDS = 1200;
const MIN_H2_SECTIONS = 2;       // At least 2 H2 sections
const MIN_PARAGRAPHS = 4;        // At least 4 paragraphs total

// ─── Refusal Detector ─────────────────────────────────────────────────────────
// Catches cases where the LLM broke character instead of writing a blog

const REFUSAL_PATTERNS = [
  /as an ai( language model)?[,\s]/i,
  /i('m| am) (not able|unable) to/i,
  /i can'?t (help|write|do|create|generate)/i,
  /i (will|won't|cannot|can't) (help|write|do|create|generate)/i,
  /i('m| am) designed to/i,
  /my (purpose|goal|job) is (not|to only)/i,
  /this (request|topic|content) (is|seems) (inappropriate|harmful|against)/i,
  /i (must|need to) (refuse|decline)/i,
  /that (falls|goes) outside (my|the)/i,
  /i (apologize|am sorry),? but/i,
];

const detectRefusal = (content) => {
  return REFUSAL_PATTERNS.some((pattern) => pattern.test(content));
};

// ─── Off-Task Detector ────────────────────────────────────────────────────────
// Catches cases where the LLM produced something that is clearly NOT a blog
// e.g. returned raw code, a math solution, a Q&A answer, a recipe list only, etc.

const OFF_TASK_PATTERNS = [
  /^```[\w]*\n[\s\S]+\n```$/m,           // Response is primarily a code block
  /def\s+\w+\(.*\):/,                    // Python function
  /function\s+\w+\s*\(.*\)\s*\{/,       // JS function
  /SELECT\s+\*\s+FROM/i,                 // SQL query
  /^\s*Q:\s+.+\n\s*A:\s+/m,            // Q&A format
  /^\s*\d+\.\s+.+\n\s*\d+\.\s+.+\n\s*\d+\.\s+/m, // Pure numbered list with no prose
];

const detectOffTask = (content) => {
  // If more than 40% of the content is inside code blocks, it's off-task
  const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
  const codeCharCount = codeBlockMatches.reduce((acc, block) => acc + block.length, 0);
  const codeRatio = codeCharCount / content.length;

  if (codeRatio > 0.4) return true;

  return OFF_TASK_PATTERNS.some((pattern) => pattern.test(content));
};

// ─── Word Count Validator ─────────────────────────────────────────────────────

const countWords = (content) => {
  // Strip markdown symbols before counting for accuracy
  const stripped = content
    .replace(/#+\s/g, "")       // headings
    .replace(/\*\*?|__?/g, "")  // bold/italic
    .replace(/\[.*?\]\(.*?\)/g, "") // links
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // inline/block code
    .replace(/[-*+]\s/g, "")    // list bullets
    .trim();

  return stripped.split(/\s+/).filter(Boolean).length;
};

const validateWordCount = (content) => {
  const count = countWords(content);
  if (count < MIN_WORDS) {
    return { valid: false, reason: `Blog too short (${count} words). Minimum is ${MIN_WORDS}.` };
  }
  if (count > MAX_WORDS) {
    return { valid: false, reason: `Blog too long (${count} words). Maximum is ${MAX_WORDS}.` };
  }
  return { valid: true, count };
};

// ─── Structure Validator ──────────────────────────────────────────────────────

const validateStructure = (content) => {
  // Must have exactly one H1
  const h1Matches = content.match(/^#\s+.+/m);
  if (!h1Matches) {
    return { valid: false, reason: "Blog is missing a title (H1 heading)." };
  }

  // Must have at least MIN_H2_SECTIONS H2 sections
  const h2Matches = content.match(/^##\s+.+/gm) || [];
  if (h2Matches.length < MIN_H2_SECTIONS) {
    return {
      valid: false,
      reason: `Blog needs at least ${MIN_H2_SECTIONS} sections (H2 headings). Found ${h2Matches.length}.`,
    };
  }

  // Must have enough paragraph breaks (prose content)
  const paragraphs = content
    .split(/\n{2,}/)
    .filter((block) => block.trim().length > 40 && !block.trim().startsWith("#"));

  if (paragraphs.length < MIN_PARAGRAPHS) {
    return {
      valid: false,
      reason: `Blog lacks enough paragraph content. Found ${paragraphs.length}, need at least ${MIN_PARAGRAPHS}.`,
    };
  }

  return { valid: true };
};

// ─── Main Validator ───────────────────────────────────────────────────────────

export const validateOutput = (content) => {
  const results = {
    passed: false,
    wordCount: 0,
    issues: [],
  };

  // Guard: empty or non-string output
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    results.issues.push("LLM returned empty or invalid output.");
    return results;
  }

  const trimmed = content.trim();

  // Check 1: Refusal
  if (detectRefusal(trimmed)) {
    results.issues.push("LLM refused to generate blog content.");
    return results; // No need to check further
  }

  // Check 2: Off-task content
  if (detectOffTask(trimmed)) {
    results.issues.push("LLM generated off-task content (code, Q&A, etc.) instead of a blog.");
    return results;
  }

  // Check 3: Structure
  const structureCheck = validateStructure(trimmed);
  if (!structureCheck.valid) {
    results.issues.push(structureCheck.reason);
  }

  // Check 4: Word count
  const wordCheck = validateWordCount(trimmed);
  if (!wordCheck.valid) {
    results.issues.push(wordCheck.reason);
  } else {
    results.wordCount = wordCheck.count;
  }

  // All checks passed
  if (results.issues.length === 0) {
    results.passed = true;
  }

  return results;
};