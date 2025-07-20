import { GoogleGenAI } from "@google/genai";
import http from "node:http";
import https from "node:https";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpAgent,
  httpsAgent,
});

async function main(prompt) {
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return response.text;
}

export default main;
