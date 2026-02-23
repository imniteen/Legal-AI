"use client";

import { Gavel, CheckCircle, FileCheck, Lightbulb, Target } from "lucide-react";
import { CitationText } from "./CitationBadge";
import CollapsibleSection from "./CollapsibleSection";
import { cn } from "@/lib/utils";
import type { ProsecutionAnalysis, AnalysisPoint } from "@/types";

interface ProsecutionViewProps {
  analysis: ProsecutionAnalysis;
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
  onCitationClick,
}: {
  point: AnalysisPoint;
  onCitationClick?: (page: number) => void;
}) {
  return (
    <li className="flex items-start gap-3 py-3 px-4 rounded-xl bg-white border border-red-100 hover:border-red-200 hover:shadow-sm transition-all">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
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

export default function ProsecutionView({ analysis, onCitationClick }: ProsecutionViewProps) {
  return (
    <CollapsibleSection
      className="bg-gradient-to-br from-red-50 via-rose-50 to-white border-red-100"
      header={
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-4 flex items-center gap-3 rounded-t-xl">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Gavel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Prosecution View</h3>
            <p className="text-red-100 text-xs">Plaintiff perspective analysis</p>
          </div>
          <Target className="h-5 w-5 text-red-200 ml-auto" />
        </div>
      }
    >
      <div className="p-5 space-y-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-red-600" />
            </div>
            <h4 className="font-bold text-slate-900">Key Strengths</h4>
            <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {analysis.strengths.length} points
            </span>
          </div>
          {analysis.strengths.length > 0 ? (
            <ul className="space-y-2">
              {analysis.strengths.map((point, index) => (
                <AnalysisPointItem key={index} point={point} onCitationClick={onCitationClick} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
              No specific strengths identified
            </p>
          )}
        </div>

        {/* Evidence */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <FileCheck className="h-4 w-4 text-red-600" />
            </div>
            <h4 className="font-bold text-slate-900">Supporting Evidence</h4>
            <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {analysis.evidence.length} items
            </span>
          </div>
          {analysis.evidence.length > 0 ? (
            <ul className="space-y-2">
              {analysis.evidence.map((point, index) => (
                <AnalysisPointItem key={index} point={point} onCitationClick={onCitationClick} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
              No specific evidence identified
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900">Strategic Recommendations</h4>
          </div>
          {analysis.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-amber-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold flex-shrink-0 shadow-sm">
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
    </CollapsibleSection>
  );
}
