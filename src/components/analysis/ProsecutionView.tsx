"use client";

import { Gavel, CheckCircle, FileCheck, Lightbulb } from "lucide-react";
import { CitationText } from "./CitationBadge";
import { cn } from "@/lib/utils";
import type { ProsecutionAnalysis, AnalysisPoint } from "@/types";

interface ProsecutionViewProps {
  analysis: ProsecutionAnalysis;
  onCitationClick?: (page: number) => void;
}

function StrengthIndicator({ strength }: { strength?: "strong" | "moderate" | "weak" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        strength === "strong" && "bg-green-100 text-green-800",
        strength === "moderate" && "bg-yellow-100 text-yellow-800",
        strength === "weak" && "bg-orange-100 text-orange-800",
        !strength && "bg-slate-100 text-slate-600"
      )}
    >
      {strength || "N/A"}
    </span>
  );
}

function AnalysisPointItem({
  point,
  onCitationClick,
}: {
  point: AnalysisPoint;
  onCitationClick?: (page: number) => void;
}) {
  return (
    <li className="flex items-start gap-3 py-2">
      <CheckCircle className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-slate-700">
          <CitationText text={`${point.point} ${point.citation}`} onCitationClick={onCitationClick} />
        </p>
        {point.strength && (
          <div className="mt-1">
            <StrengthIndicator strength={point.strength} />
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProsecutionView({ analysis, onCitationClick }: ProsecutionViewProps) {
  return (
    <div className="prosecution-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--prosecution)] px-4 py-3 flex items-center gap-3">
        <Gavel className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Prosecution / Plaintiff View</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-[var(--prosecution)]" />
            <h4 className="font-semibold text-slate-900">Key Strengths</h4>
          </div>
          {analysis.strengths.length > 0 ? (
            <ul className="space-y-1">
              {analysis.strengths.map((point, index) => (
                <AnalysisPointItem key={index} point={point} onCitationClick={onCitationClick} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No specific strengths identified</p>
          )}
        </div>

        {/* Evidence */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="h-5 w-5 text-[var(--prosecution)]" />
            <h4 className="font-semibold text-slate-900">Supporting Evidence</h4>
          </div>
          {analysis.evidence.length > 0 ? (
            <ul className="space-y-1">
              {analysis.evidence.map((point, index) => (
                <AnalysisPointItem key={index} point={point} onCitationClick={onCitationClick} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No specific evidence identified</p>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-[var(--accent)]" />
            <h4 className="font-semibold text-slate-900">Strategic Recommendations</h4>
          </div>
          {analysis.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--prosecution)] text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-slate-700">{rec}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No recommendations provided</p>
          )}
        </div>
      </div>
    </div>
  );
}
