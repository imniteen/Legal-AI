import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Extract page number from citation string like [Page 12] or [PAGE 12]
 */
export function extractPageNumber(citation: string): number | null {
  const match = citation.match(/\[PAGE?\s*(\d+)\]/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Parse citations from text and return array of page numbers
 */
export function parseCitations(text: string): number[] {
  const regex = /\[PAGE?\s*(\d+)\]/gi;
  const citations: number[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const pageNum = parseInt(match[1], 10);
    if (!citations.includes(pageNum)) {
      citations.push(pageNum);
    }
  }

  return citations.sort((a, b) => a - b);
}

/**
 * Highlight citations in text by wrapping them with a span
 */
export function highlightCitations(text: string): string {
  return text.replace(
    /\[PAGE?\s*(\d+)\]/gi,
    '<span class="citation-badge" data-page="$1">[Page $1]</span>'
  );
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a unique case ID
 */
export function generateCaseId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `case_${timestamp}_${randomPart}`;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
