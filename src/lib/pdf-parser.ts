import pdf from "pdf-parse";
import * as fs from "fs";
import * as path from "path";
import type { ExtractedPage, ParsedPDF } from "@/types";

/**
 * Parse a PDF file and extract text with page markers
 * Each page's content is prefixed with [PAGE X] marker for citation tracking
 */
export async function parsePDFWithPageMarkers(
  filePath: string
): Promise<ParsedPDF> {
  // Read the PDF file
  const absolutePath = path.resolve(filePath);
  const dataBuffer = fs.readFileSync(absolutePath);
  const stats = fs.statSync(absolutePath);

  // Parse the PDF
  const data = await pdf(dataBuffer);

  // Split by page breaks (pdf-parse uses form feed characters between pages)
  const rawPages = data.text.split("\f");

  // Build marked text with page indicators
  let markedText = "";
  const pages: ExtractedPage[] = [];

  rawPages.forEach((pageText, index) => {
    const pageNumber = index + 1;
    const trimmedText = pageText.trim();

    if (trimmedText) {
      const startIndex = markedText.length;
      const pageMarker = `\n\n[PAGE ${pageNumber}]\n`;
      markedText += pageMarker + trimmedText;

      pages.push({
        pageNumber,
        content: trimmedText,
        startIndex,
        endIndex: markedText.length,
      });
    }
  });

  return {
    markedText: markedText.trim(),
    pages,
    totalPages: pages.length,
    originalFileName: path.basename(filePath),
    fileSize: stats.size,
  };
}

/**
 * Get text content for a specific page
 */
export function getPageContent(
  parsedPDF: ParsedPDF,
  pageNumber: number
): string | null {
  const page = parsedPDF.pages.find((p) => p.pageNumber === pageNumber);
  return page ? page.content : null;
}

/**
 * Search for text across all pages and return matching pages
 */
export function searchInDocument(
  parsedPDF: ParsedPDF,
  searchTerm: string
): { pageNumber: number; snippet: string }[] {
  const results: { pageNumber: number; snippet: string }[] = [];
  const lowerSearchTerm = searchTerm.toLowerCase();

  for (const page of parsedPDF.pages) {
    const lowerContent = page.content.toLowerCase();
    const index = lowerContent.indexOf(lowerSearchTerm);

    if (index !== -1) {
      // Extract a snippet around the match
      const start = Math.max(0, index - 50);
      const end = Math.min(page.content.length, index + searchTerm.length + 50);
      const snippet = page.content.slice(start, end);

      results.push({
        pageNumber: page.pageNumber,
        snippet: (start > 0 ? "..." : "") + snippet + (end < page.content.length ? "..." : ""),
      });
    }
  }

  return results;
}

/**
 * Validate if a file is a valid PDF
 */
export function isPDFFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".pdf";
}

/**
 * Get file size in MB
 */
export function getFileSizeMB(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Validate PDF file before processing
 */
export async function validatePDF(
  filePath: string,
  maxSizeMB: number = 50
): Promise<{ valid: boolean; error?: string }> {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return { valid: false, error: "File not found" };
  }

  // Check file extension
  if (!isPDFFile(filePath)) {
    return { valid: false, error: "File must be a PDF" };
  }

  // Check file size
  const sizeMB = getFileSizeMB(filePath);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size (${sizeMB.toFixed(2)} MB) exceeds maximum allowed (${maxSizeMB} MB)`,
    };
  }

  // Try to read PDF header
  try {
    const buffer = Buffer.alloc(5);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    const header = buffer.toString("utf8");
    if (!header.startsWith("%PDF-")) {
      return { valid: false, error: "Invalid PDF file format" };
    }
  } catch {
    return { valid: false, error: "Unable to read file" };
  }

  return { valid: true };
}
