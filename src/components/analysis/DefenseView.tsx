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
  const styles = {
    strong: "bg-emerald-100 text-emerald-700 border-emerald-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    weak: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
        strength ? styles[strength] : "bg-slate-100 text-slate-600 border-slate-200"
      )}
    >
      {strength || "N/A"}
    </span>
  );
}

function AnalysisPointItem({
  point,
  icon: Icon,
  iconColor,
  onCitationClick,
}: {
  point: AnalysisPoint;
  icon: typeof AlertTriangle;
  iconColor: string;
  onCitationClick?: (page: number) => void;
}) {
  return (
    <li className="flex items-start gap-3 py-3 px-4 rounded-xl bg-white border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", iconColor)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-700 text-sm leading-relaxed">
          <CitationText text={`${point.point} ${point.citation}`} onCitationClick={onCitationClick} />
        </p>
        {point.strength && (
          <div className="mt-2">
            <StrengthIndicator strength={point.strength} />
          </div>
        )}
      </div>
    </li>
  );
}

export default function DefenseView({ analysis, onCitationClick }: DefenseViewProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Defense View</h3>
          <p className="text-blue-100 text-xs">Defendant perspective analysis</p>
        </div>
        <Shield className="h-5 w-5 text-blue-200 ml-auto" />
      </div>

      <div className="p-5 space-y-6">
        {/* Weaknesses in Prosecution Case */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900">Prosecution Weaknesses</h4>
            <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {analysis.weaknesses.length} points
            </span>
          </div>
          {analysis.weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {analysis.weaknesses.map((point, index) => (
                <AnalysisPointItem
                  key={index}
                  point={point}
                  icon={AlertTriangle}
                  iconColor="bg-blue-100 text-blue-600"
                  onCitationClick={onCitationClick}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
              No specific weaknesses identified
            </p>
          )}
        </div>

        {/* Inconsistencies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900">Inconsistencies & Gaps</h4>
            <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {analysis.inconsistencies.length} items
            </span>
          </div>
          {analysis.inconsistencies.length > 0 ? (
            <ul className="space-y-2">
              {analysis.inconsistencies.map((point, index) => (
                <AnalysisPointItem
                  key={index}
                  point={point}
                  icon={AlertCircle}
                  iconColor="bg-amber-100 text-amber-600"
                  onCitationClick={onCitationClick}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
              No inconsistencies identified
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900">Defense Strategies</h4>
          </div>
          {analysis.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-emerald-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    {index + 1}
                  </span>
                  <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
              No recommendations provided
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
