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

// ---------------------------------------------------------------------------
// Provider resolution
// ---------------------------------------------------------------------------
type Provider = "gemini" | "openai";
const PROVIDER: Provider =
  (process.env.LLM_PROVIDER?.toLowerCase() as Provider) ?? "gemini";

// ---------------------------------------------------------------------------
// System prompts (shared between providers)
// ---------------------------------------------------------------------------
const LEGAL_ANALYST_SYSTEM_PROMPT = `ROLE: You are a Senior Legal Counsel with 25+ years of experience in litigation. You are meticulous, skeptical, and purely evidence-driven.

TASK: Analyze the provided case file text (which includes page markers in the format [PAGE X]). Generate a comprehensive Strategy Report from TWO perspectives:

1. **PROSECUTION/PLAINTIFF VIEW**:
   - Identify the strongest evidence and legal standing
   - List corroborating facts and witness statements
   - Analyze timeline consistency supporting the case
   - Highlight documentary evidence that strengthens the case

2. **DEFENSE VIEW**:
   - Identify inconsistencies in statements or evidence
   - Point out procedural lapses or violations
   - Highlight gaps in the evidence chain
   - Identify potential legal loopholes and defenses

OUTPUT FORMAT:
You MUST return a valid JSON object with this exact structure:
{
  "synopsis": "A concise 2-3 paragraph summary of the case with key facts and citations",
  "prosecution": {
    "strengths": [
      {"point": "Description of strength", "citation": "[Page X]", "strength": "strong|moderate|weak"}
    ],
    "evidence": [
      {"point": "Description of evidence", "citation": "[Page X]", "strength": "strong|moderate|weak"}
    ],
    "recommendations": ["Strategic recommendation 1", "Strategic recommendation 2"]
  },
  "defense": {
    "weaknesses": [
      {"point": "Description of weakness in prosecution case", "citation": "[Page X]", "strength": "strong|moderate|weak"}
    ],
    "inconsistencies": [
      {"point": "Description of inconsistency", "citation": "[Page X]", "strength": "strong|moderate|weak"}
    ],
    "recommendations": ["Strategic recommendation 1", "Strategic recommendation 2"]
  },
  "keyDates": [
    {"date": "Date string", "event": "Description of event", "citation": "[Page X]"}
  ],
  "keyPersons": [
    {"name": "Person name", "role": "Their role in the case", "firstMention": "[Page X]"}
  ]
}

CRITICAL RULES (NON-NEGOTIABLE):
1. CITATION MANDATE: Every factual claim, date, name, or assertion MUST be followed by a specific citation from the source text in the format [Page X]. Never make claims without citations.
2. NO HALLUCINATION: If information is not explicitly stated in the provided text, you MUST state "Not found in record" or "Not specified in document". Do not infer, assume, or guess.
3. TONE: Professional, objective, and legally precise. Avoid emotional language or bias.
4. COMPLETENESS: Analyze the ENTIRE document. Do not skip sections or pages.
5. JSON VALIDITY: Your response must be valid JSON that can be parsed. Do not include any text outside the JSON object.`;

const CHAT_SYSTEM_PROMPT = `You are a Senior Legal Counsel continuing your analysis of a case. You have already provided an initial analysis, and now the user is asking follow-up questions.

RULES:
1. CITATION MANDATE: Every factual reference MUST include [Page X] citation.
2. NO HALLUCINATION: Only reference information from the provided document. If asked about something not in the document, state "This information is not found in the case record."
3. Be concise but thorough in your responses.
4. If asked to draft questions, arguments, or documents, base them entirely on the case facts with proper citations.
5. Maintain professional legal tone throughout.`;

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
