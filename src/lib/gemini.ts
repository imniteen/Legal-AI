import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "@/types";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt for legal analysis - hardcoded as per requirements
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

/**
 * Analyze a case document using Gemini 1.5 Pro
 */
export async function analyzeCase(
  documentText: string
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
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

// Chat system prompt for follow-up questions
const CHAT_SYSTEM_PROMPT = `You are a Senior Legal Counsel continuing your analysis of a case. You have already provided an initial analysis, and now the user is asking follow-up questions.

RULES:
1. CITATION MANDATE: Every factual reference MUST include [Page X] citation.
2. NO HALLUCINATION: Only reference information from the provided document. If asked about something not in the document, state "This information is not found in the case record."
3. Be concise but thorough in your responses.
4. If asked to draft questions, arguments, or documents, base them entirely on the case facts with proper citations.
5. Maintain professional legal tone throughout.`;

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
    model: "gemini-1.5-pro",
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
