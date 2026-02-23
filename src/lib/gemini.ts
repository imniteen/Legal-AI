import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "@/types";
import { LEGAL_ANALYST_SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT } from "./prompts";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Analyze a case document using Gemini 1.5 Pro
 */
export async function analyzeCase(
  documentText: string
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.1, // Low temperature for consistent, factual output
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `${LEGAL_ANALYST_SYSTEM_PROMPT}

CASE DOCUMENT TO ANALYZE:
${documentText}

Analyze the above document and provide the JSON response as specified.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim();
    }

    // Parse the JSON response
    const analysis: AnalysisResult = JSON.parse(jsonStr);

    return analysis;
  } catch (error) {
    console.error("Error analyzing case:", error);
    throw new Error(
      `Failed to analyze case: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Chat with the AI about a case
 */
export async function chatAboutCase(
  documentText: string,
  analysisJson: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 4096,
    },
  });

  // Build conversation context
  let conversationContext = "";
  for (const msg of conversationHistory.slice(-10)) {
    // Keep last 10 messages for context
    conversationContext += `${msg.role === "user" ? "USER" : "ASSISTANT"}: ${msg.content}\n\n`;
  }

  const prompt = `${CHAT_SYSTEM_PROMPT}

CASE DOCUMENT:
${documentText}

PREVIOUS ANALYSIS:
${analysisJson}

CONVERSATION HISTORY:
${conversationContext}

USER'S NEW QUESTION:
${userMessage}

Provide a helpful, citation-backed response:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error(
      `Failed to get response: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Estimate token count for a text (rough approximation)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

/**
 * Check if document is within Gemini's context window
 */
export function isWithinContextLimit(
  documentText: string,
  maxTokens: number = 1000000
): boolean {
  return estimateTokenCount(documentText) < maxTokens;
}
