"use client";

import { Scale, FileSearch, Brain, Shield, Gavel, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisLoaderProps {
  stage: "uploading" | "extracting" | "analyzing" | "prosecution" | "defense" | "complete";
  progress: number;
  totalPages?: number;
}

const stages = [
  { id: "uploading", label: "Uploading Document", icon: FileSearch },
  { id: "extracting", label: "Extracting Text", icon: FileSearch },
  { id: "analyzing", label: "Analyzing Case", icon: Brain },
  { id: "prosecution", label: "Identifying Prosecution Strengths", icon: Gavel },
  { id: "defense", label: "Identifying Defense Points", icon: Shield },
  { id: "complete", label: "Analysis Complete", icon: CheckCircle },
];

export default function AnalysisLoader({ stage, progress, totalPages }: AnalysisLoaderProps) {
  const currentStageIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Animated Logo */}
      <div className="relative mb-10">
        <div className="absolute inset-0 animate-ping rounded-3xl bg-gradient-to-br from-[var(--primary)]/20 to-indigo-500/20" />
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--primary)]/10 to-indigo-500/10 blur-xl animate-pulse" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 shadow-xl shadow-blue-500/25">
          <Scale className="h-14 w-14 text-white animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Case</h2>
      <p className="text-slate-500 mb-8">Our AI is carefully reviewing every detail</p>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-blue-500 to-indigo-500 transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-sm font-medium text-slate-600">{progress}% complete</span>
          {totalPages && (
            <span className="text-sm text-slate-500">{totalPages} pages</span>
          )}
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
        <div className="space-y-1">
          {stages.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === stage;
            const isPast = index < currentStageIndex;
            const isFuture = index > currentStageIndex;

            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                  isActive && "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200",
                  isPast && "bg-emerald-50",
                  isFuture && "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                    isActive && "bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white shadow-md",
                    isPast && "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md",
                    isFuture && "bg-slate-100 text-slate-400"
                  )}
                >
                  {isPast ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                  )}
                </div>
                <span
                  className={cn(
                    "font-semibold text-sm",
                    isActive && "text-[var(--primary)]",
                    isPast && "text-emerald-700",
                    isFuture && "text-slate-400"
                  )}
                >
                  {s.label}
                  {s.id === "extracting" && totalPages && ` (${totalPages} pages)`}
                </span>
                {isActive && (
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-medium">Processing...</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                {isPast && (
                  <div className="ml-auto">
                    <span className="text-xs text-emerald-600 font-medium">Done</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-8 text-center max-w-md">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Large documents may take longer to ensure accurate citations</span>
        </div>
      </div>
    </div>
  );
}
