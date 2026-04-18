import { HfInference } from "@huggingface/inference";
import { AppError } from "../utils/AppError.js";
 
// Initialize with your API token
const hf = new HfInference(process.env.TOKEN);

async function generateAnswer(userPrompt) {

  try {
    // Make API call with system prompt (guardrails) and user prompt
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are a professional blog writer. Write engaging, informative blog posts in Markdown format.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 1500, // Increased for better blog posts
      temperature: 0.7,
      top_p: 0.9
    });
 
    const generatedContent = response.choices[0].message.content;
    return generatedContent;
  } catch (error) {
    throw new AppError("Failed to generate content, please try again!", 500);
  }
}
 
export default generateAnswer;