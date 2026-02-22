// JurisAI Type Definitions

/**
 * Extracted page content from PDF
 */
export interface ExtractedPage {
  pageNumber: number;
  content: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Result of PDF parsing
 */
export interface ParsedPDF {
  markedText: string;
  pages: ExtractedPage[];
  totalPages: number;
  originalFileName: string;
  fileSize: number;
}

/**
 * Case status enum
 */
export type CaseStatus = "pending" | "processing" | "analyzed" | "error";

/**
 * Case entity
 */
export interface Case {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  totalPages: number;
  extractedText: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  analysis?: Analysis;
}

/**
 * Prosecution/Defense analysis point
 */
export interface AnalysisPoint {
  point: string;
  citation: string;
  strength?: "strong" | "moderate" | "weak";
}

/**
 * Prosecution analysis structure
 */
export interface ProsecutionAnalysis {
  strengths: AnalysisPoint[];
  evidence: AnalysisPoint[];
  recommendations: string[];
}

/**
 * Defense analysis structure
 */
export interface DefenseAnalysis {
  weaknesses: AnalysisPoint[];
  inconsistencies: AnalysisPoint[];
  recommendations: string[];
}

/**
 * Key date with citation
 */
export interface KeyDate {
  date: string;
  event: string;
  citation: string;
}

/**
 * Key person involved in case
 */
export interface KeyPerson {
  name: string;
  role: string;
  firstMention: string;
}

/**
 * Full analysis result from AI
 */
export interface AnalysisResult {
  synopsis: string;
  prosecution: ProsecutionAnalysis;
  defense: DefenseAnalysis;
  keyDates: KeyDate[];
  keyPersons: KeyPerson[];
}

/**
 * Analysis entity from database
 */
export interface Analysis {
  id: string;
  caseId: string;
  synopsis: string;
  prosecutionJson: string;
  defenseJson: string;
  keyDatesJson: string;
  keyPersonsJson: string;
  modelUsed: string;
  tokensUsed?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  caseId: string;
  role: "user" | "assistant";
  content: string;
  citations?: number[];
  createdAt: Date;
}

/**
 * Chat request payload
 */
export interface ChatRequest {
  caseId: string;
  message: string;
}

/**
 * Upload response
 */
export interface UploadResponse {
  success: boolean;
  caseId?: string;
  message: string;
  error?: string;
}

/**
 * Analysis API response
 */
export interface AnalysisResponse {
  success: boolean;
  analysis?: AnalysisResult;
  message: string;
  error?: string;
}

/**
 * Loading state for analysis
 */
export interface AnalysisLoadingState {
  isLoading: boolean;
  stage:
    | "idle"
    | "uploading"
    | "extracting"
    | "analyzing"
    | "prosecution"
    | "defense"
    | "complete"
    | "error";
  progress: number;
  message: string;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}
