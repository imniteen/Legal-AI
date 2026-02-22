"use client";

import { Shield, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { CitationText } from "./CitationBadge";
import { cn } from "@/lib/utils";
import type { DefenseAnalysis, AnalysisPoint } from "@/types";

interface DefenseViewProps {
  analysis: DefenseAnalysis;
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
  icon: Icon,
  onCitationClick,
}: {
  point: AnalysisPoint;
  icon: typeof AlertTriangle;
  onCitationClick?: (page: number) => void;
}) {
  return (
    <li className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-[var(--defense)] mt-0.5 flex-shrink-0" />
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

export default function DefenseView({ analysis, onCitationClick }: DefenseViewProps) {
  return (
    <div className="defense-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--defense)] px-4 py-3 flex items-center gap-3">
        <Shield className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Defense View</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Weaknesses in Prosecution Case */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-[var(--defense)]" />
            <h4 className="font-semibold text-slate-900">Prosecution Weaknesses</h4>
          </div>
          {analysis.weaknesses.length > 0 ? (
            <ul className="space-y-1">
              {analysis.weaknesses.map((point, index) => (
                <AnalysisPointItem
                  key={index}
                  point={point}
                  icon={AlertTriangle}
                  onCitationClick={onCitationClick}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No specific weaknesses identified</p>
          )}
        </div>

        {/* Inconsistencies */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
            <h4 className="font-semibold text-slate-900">Inconsistencies & Gaps</h4>
          </div>
          {analysis.inconsistencies.length > 0 ? (
            <ul className="space-y-1">
              {analysis.inconsistencies.map((point, index) => (
                <AnalysisPointItem
                  key={index}
                  point={point}
                  icon={AlertCircle}
                  onCitationClick={onCitationClick}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No inconsistencies identified</p>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-[var(--accent)]" />
            <h4 className="font-semibold text-slate-900">Defense Strategies</h4>
          </div>
          {analysis.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--defense)] text-white text-xs font-bold flex-shrink-0">
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
