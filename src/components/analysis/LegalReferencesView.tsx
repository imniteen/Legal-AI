"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Scale, Shield, Gavel, Building2 } from "lucide-react";
import { CitationText } from "./CitationBadge";
import CollapsibleSection from "./CollapsibleSection";
import { cn } from "@/lib/utils";
import type { LegalReference } from "@/types";

interface LegalReferencesViewProps {
  legalReferences: LegalReference[];
  onCitationClick?: (page: number) => void;
}

/** Pill colour per `usedBy` value */
const USED_BY_STYLES: Record<
  LegalReference["usedBy"],
  { bg: string; text: string; label: string; Icon: typeof Scale }
> = {
  prosecution: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    label: "Prosecution",
    Icon: Scale,
  },
  defense: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    label: "Defense",
    Icon: Shield,
  },
  both: {
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    label: "Both Sides",
    Icon: Gavel,
  },
  court: {
    bg: "bg-slate-100 border-slate-300",
    text: "text-slate-700",
    label: "Court",
    Icon: Building2,
  },
};

function UsedByBadge({ usedBy }: { usedBy: LegalReference["usedBy"] }) {
  const style = USED_BY_STYLES[usedBy] ?? USED_BY_STYLES.court;
  const { Icon } = style;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap",
        style.bg,
        style.text
      )}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}

/** Group references by `act` while keeping insertion order */
function groupByAct(refs: LegalReference[]): Map<string, LegalReference[]> {
  const map = new Map<string, LegalReference[]>();
  for (const ref of refs) {
    const key = ref.act?.trim() || "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ref);
  }
  return map;
}

function ActGroup({
  act,
  references,
  onCitationClick,
  defaultOpen,
}: {
  act: string;
  references: LegalReference[];
  onCitationClick?: (page: number) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <BookOpen className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-semibold text-slate-900 text-sm flex-1">
          {act}
        </span>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">
          {references.length} {references.length === 1 ? "section" : "sections"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Entries */}
      {open && (
        <ul className="divide-y divide-slate-100">
          {references.map((ref, idx) => (
            <li key={idx} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 text-sm">
                  {ref.reference}
                </span>
                <UsedByBadge usedBy={ref.usedBy} />
              </div>
              {ref.context && (
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  <CitationText
                    text={ref.context}
                    onCitationClick={onCitationClick}
                  />
                </p>
              )}
              {ref.citations && (
                <div className="mt-2">
                  <CitationText
                    text={ref.citations}
                    onCitationClick={onCitationClick}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LegalReferencesView({
  legalReferences,
  onCitationClick,
}: LegalReferencesViewProps) {
  if (!legalReferences || legalReferences.length === 0) return null;

  const grouped = groupByAct(legalReferences);
  const totalSections = legalReferences.length;
  const totalActs = grouped.size;

  return (
    <CollapsibleSection
      header={
        <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-violet-50 to-white">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Legal References</h3>
            <p className="text-xs text-slate-500">
              {totalSections} {totalSections === 1 ? "section" : "sections"} across{" "}
              {totalActs} {totalActs === 1 ? "act" : "acts"} referenced
            </p>
          </div>
        </div>
      }
    >
      {/* Grouped references */}
      <div className="border-t border-slate-100 p-4 space-y-3">
        {[...grouped.entries()].map(([act, refs], idx) => (
          <ActGroup
            key={act}
            act={act}
            references={refs}
            onCitationClick={onCitationClick}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
}
