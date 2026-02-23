"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  /** The header content (icon + title area) rendered inside the clickable bar */
  header: ReactNode;
  children: ReactNode;
  /** Whether the section starts expanded (default: false = collapsed) */
  defaultOpen?: boolean;
  /** Optional extra classes on the outer wrapper */
  className?: string;
}

export default function CollapsibleSection({
  header,
  children,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white", className)}>
      {/* Clickable header bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 text-left cursor-pointer select-none transition-colors hover:bg-slate-50/60"
      >
        <div className="flex-1 min-w-0">{header}</div>
        <div className="pr-4 flex-shrink-0">
          <ChevronDown
            className={cn(
              "h-5 w-5 text-slate-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Collapsible body */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          open ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
