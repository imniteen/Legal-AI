/**
 * Unified LLM provider module.
 *
 * Switch providers by setting LLM_PROVIDER in your .env.local:
 *   LLM_PROVIDER=gemini   (default) — uses GEMINI_API_KEY
 *   LLM_PROVIDER=openai           — uses OPENAI_API_KEY
 *
 * Optional model overrides:
 *   GEMINI_MODEL=gemini-2.0-flash  (default)
 *   OPENAI_MODEL=gpt-4o            (default)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import type { AnalysisResult } from "@/types";
import { LEGAL_ANALYST_SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT } from "./prompts";

// ---------------------------------------------------------------------------
// Provider resolution
// ---------------------------------------------------------------------------
type Provider = "gemini" | "openai";
const PROVIDER: Provider =
  (process.env.LLM_PROVIDER?.toLowerCase() as Provider) ?? "gemini";

// ---------------------------------------------------------------------------
// Helper: extract JSON from a model response that may wrap it in markdown
// ---------------------------------------------------------------------------
function extractJson(text: string): string {
  if (text.includes("```json")) {
    return text.split("```json")[1].split("```")[0].trim();
  }
  if (text.includes("```")) {
    return text.split("```")[1].split("```")[0].trim();
  }
  return text.trim();
}

// ---------------------------------------------------------------------------
// Gemini implementation
// ---------------------------------------------------------------------------
async function analyzeCaseGemini(documentText: string): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `${LEGAL_ANALYST_SYSTEM_PROMPT}\n\nCASE DOCUMENT TO ANALYZE:\n${documentText}\n\nAnalyze the above document and provide the JSON response as specified.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(extractJson(text)) as AnalysisResult;
}

async function chatAboutCaseGemini(
  documentText: string,
  analysisJson: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 4096,
    },
  });

  const conversationContext = conversationHistory
    .slice(-10)
    .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`)
    .join("\n\n");

  const prompt = `${CHAT_SYSTEM_PROMPT}\n\nCASE DOCUMENT:\n${documentText}\n\nPREVIOUS ANALYSIS:\n${analysisJson}\n\nCONVERSATION HISTORY:\n${conversationContext}\n\nUSER'S NEW QUESTION:\n${userMessage}\n\nProvide a helpful, citation-backed response:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ---------------------------------------------------------------------------
// OpenAI implementation
// ---------------------------------------------------------------------------

/**
 * Reasoning models (o1, o3, o4-mini, etc.) have a different API surface:
 *  - No `temperature` parameter
 *  - `max_completion_tokens` instead of `max_tokens`
 *  - `developer` role instead of `system`
 */
function isReasoningModel(model: string): boolean {
  return /^o\d/i.test(model); // matches o1, o3, o4-mini, o1-mini, etc.
}

async function analyzeCaseOpenAI(documentText: string): Promise<AnalysisResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const reasoning = isReasoningModel(model);

  const systemRole = reasoning ? "developer" : "system";

  const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    model,
    max_completion_tokens: 8192,
    response_format: { type: "json_object" },
    messages: [
      { role: systemRole as "system", content: LEGAL_ANALYST_SYSTEM_PROMPT },
      {
        role: "user",
        content: `CASE DOCUMENT TO ANALYZE:\n${documentText}\n\nAnalyze the above document and provide the JSON response as specified.`,
      },
    ],
  };

  // temperature is not supported on reasoning models
  if (!reasoning) {
    params.temperature = 0.1;
  }

  const completion = await openai.chat.completions.create(params);
  const text = completion.choices[0]?.message?.content ?? "";
  return JSON.parse(extractJson(text)) as AnalysisResult;
}

async function chatAboutCaseOpenAI(
  documentText: string,
  analysisJson: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const reasoning = isReasoningModel(model);

  const systemRole = reasoning ? "developer" : "system";

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: systemRole as "system",
      content: `${CHAT_SYSTEM_PROMPT}\n\nCASE DOCUMENT:\n${documentText}\n\nPREVIOUS ANALYSIS:\n${analysisJson}`,
    },
    ...conversationHistory.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    model,
    max_completion_tokens: 4096,
    messages,
  };

  if (!reasoning) {
    params.temperature = 0.3;
  }

  const completion = await openai.chat.completions.create(params);
  return completion.choices[0]?.message?.content ?? "";
}

// ---------------------------------------------------------------------------
// Public API — provider-agnostic exports
// ---------------------------------------------------------------------------

/**
 * Analyze a case document using the configured LLM provider.
 */
export async function analyzeCase(
  documentText: string
): Promise<AnalysisResult> {
  try {
    if (PROVIDER === "openai") {
      return await analyzeCaseOpenAI(documentText);
    }
    return await analyzeCaseGemini(documentText);
  } catch (error) {
    console.error(`[LLM:${PROVIDER}] analyzeCase error:`, error);
    throw new Error(
      `Failed to analyze case (provider=${PROVIDER}): ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Chat with the AI about a case using the configured LLM provider.
 */
export async function chatAboutCase(
  documentText: string,
  analysisJson: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  try {
    if (PROVIDER === "openai") {
      return await chatAboutCaseOpenAI(
        documentText,
        analysisJson,
        conversationHistory,
        userMessage
      );
    }
    return await chatAboutCaseGemini(
      documentText,
      analysisJson,
      conversationHistory,
      userMessage
    );
  } catch (error) {
    console.error(`[LLM:${PROVIDER}] chatAboutCase error:`, error);
    throw new Error(
      `Failed to get response (provider=${PROVIDER}): ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Returns the currently active provider name (useful for logging/UI display).
 */
export function getActiveProvider(): string {
  return PROVIDER;
}

/**
 * Returns the model name being used for the active provider.
 */
export function getActiveModel(): string {
  if (PROVIDER === "openai") {
    return process.env.OPENAI_MODEL || "gpt-4o";
  }
  return process.env.GEMINI_MODEL || "gemini-2.0-flash";
}

/**
 * Estimate token count for a text (rough approximation: ~4 chars per token).
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Check if document is within the configured provider's context window.
 * Gemini 1.5/2.0: 1M tokens. GPT-4o: 128k tokens.
 */
export function isWithinContextLimit(
  documentText: string,
  maxTokens?: number
): boolean {
  const limit =
    maxTokens ??
    (PROVIDER === "openai"
      ? 120_000 // conservative limit for GPT-4o (128k context)
      : 1_000_000); // Gemini 1.5/2.0 flash
  return estimateTokenCount(documentText) < limit;
}
