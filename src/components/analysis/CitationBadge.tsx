"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationBadgeProps {
  page: number;
  onClick?: (page: number) => void;
  size?: "sm" | "md";
}

export default function CitationBadge({ page, onClick, size = "sm" }: CitationBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(page)}
      className={cn(
        "inline-flex items-center gap-1 rounded font-medium transition-all hover:scale-105",
        "bg-[var(--primary-light)] text-white hover:bg-[var(--primary)]",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm"
      )}
      title={`Go to page ${page}`}
    >
      <FileText className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      Page {page}
    </button>
  );
}

interface CitationTextProps {
  text: string;
  onCitationClick?: (page: number) => void;
}

export function CitationText({ text, onCitationClick }: CitationTextProps) {
  // Parse text and replace [Page X], [Page X-Y], [Pages X-Y], [Pages X, Y, Z] with clickable badges
  // Matches: [Page 11], [Page 11-12], [Pages 11-12], [Pages 11, 12, 13], [Page 11, 12]
  const citationPattern = /(\[PAGES?\s*[\d,\s-]+\])/gi;
  const parts = text.split(citationPattern);

  return (
    <span>
      {parts.map((part, index) => {
        // Check if this part is a citation
        const citationMatch = part.match(/\[PAGES?\s*([\d,\s-]+)\]/i);
        if (citationMatch) {
          const pageSpec = citationMatch[1].trim();
          const pages: number[] = [];

          // Parse the page specification
          // Handle comma-separated values and ranges
          const segments = pageSpec.split(/[,\s]+/).filter(s => s.length > 0);

          for (const segment of segments) {
            if (segment.includes('-')) {
              // It's a range like "11-12"
              const [start, end] = segment.split('-').map(n => parseInt(n.trim(), 10));
              if (!isNaN(start) && !isNaN(end)) {
                for (let p = start; p <= end; p++) {
                  pages.push(p);
                }
              }
            } else {
              // It's a single page number
              const pageNum = parseInt(segment, 10);
              if (!isNaN(pageNum)) {
                pages.push(pageNum);
              }
            }
          }

          // Remove duplicates and sort
          const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

          return (
            <span key={index} className="inline-flex items-center gap-1 flex-wrap">
              {uniquePages.map((pageNum, pageIndex) => (
                <CitationBadge
                  key={`${index}-${pageIndex}`}
                  page={pageNum}
                  onClick={onCitationClick}
                />
              ))}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
