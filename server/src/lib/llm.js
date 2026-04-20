import { HfInference } from "@huggingface/inference";
import { AppError } from "../utils/AppError.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { validateOutput } from "../utils/outputValidator.js"; // 👈 import

const hf = new HfInference(process.env.TOKEN);

// Separated so retry can call it cleanly
const callLLM = async (systemPrompt, userPrompt) => {
  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt  },
    ],
    max_tokens: 1500,
    temperature: 0.7,
    top_p: 0.9,
  });
  return response.choices[0].message.content;
};

async function generateAnswer(blogTitle) {
  try {
    const { systemPrompt, userPrompt } = buildPrompt(blogTitle);

    // ── Attempt 1 ────────────────────────────────────────────────────────────
    let content = await callLLM(systemPrompt, userPrompt);
    let validation = validateOutput(content);

    // ── Retry once if validation failed ──────────────────────────────────────
    if (!validation.passed) {
      console.warn(
        `[OUTPUT VALIDATION] Attempt 1 failed for title: "${blogTitle}" | Issues: ${validation.issues.join(" | ")}`
      );

      // Slightly stricter retry prompt — reminds the model of what went wrong
      const retryUserPrompt = `
${userPrompt}

IMPORTANT REMINDER: Your previous attempt did not meet the required format.
Make sure your response:
- Starts with a single H1 title
- Has at least 3 H2 section headings
- Contains at least 600 words of prose
- Is ONLY the blog post in Markdown — no explanations, no refusals, no code
      `.trim();

      content = await callLLM(systemPrompt, retryUserPrompt);
      validation = validateOutput(content);
    }

    // ── Final check after retry ───────────────────────────────────────────────
    if (!validation.passed) {
      console.error(
        `[OUTPUT VALIDATION] Attempt 2 also failed for title: "${blogTitle}" | Issues: ${validation.issues.join(" | ")}`
      );
      throw new AppError(
        "We were unable to generate a valid blog post. Please try a more descriptive title.",
        422
      );
    }

    console.info(
      `[OUTPUT VALIDATION] Passed | Title: "${blogTitle}" | Words: ${validation.wordCount}`
    );

    return content;

  } catch (error) {
    // Rethrow AppErrors as-is, wrap anything else
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to generate content, please try again!", 500);
  }
}

export default generateAnswer;