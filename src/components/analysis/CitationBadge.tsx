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
  // Parse text and replace [Page X] with clickable badges
  const parts = text.split(/(\[PAGE?\s*\d+\])/gi);

  return (
    <span>
      {parts.map((part, index) => {
        const match = part.match(/\[PAGE?\s*(\d+)\]/i);
        if (match) {
          const pageNum = parseInt(match[1], 10);
          return (
            <CitationBadge
              key={index}
              page={pageNum}
              onClick={onCitationClick}
            />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
