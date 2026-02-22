"use client";

import { Scale, FileSearch, Brain, Shield, Gavel, CheckCircle } from "lucide-react";
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
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)]/20" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary)]">
          <Scale className="h-12 w-12 text-white animate-pulse" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-slate-500">{progress}% complete</p>
      </div>

      {/* Stage Indicators */}
      <div className="w-full max-w-lg">
        <div className="space-y-3">
          {stages.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === stage;
            const isPast = index < currentStageIndex;
            const isFuture = index > currentStageIndex;

            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                  isActive && "bg-[var(--primary)]/10 border border-[var(--primary)]",
                  isPast && "bg-[var(--success-light)]",
                  isFuture && "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    isActive && "bg-[var(--primary)] text-white",
                    isPast && "bg-[var(--success)] text-white",
                    isFuture && "bg-slate-200 text-slate-500"
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
                    "font-medium",
                    isActive && "text-[var(--primary)]",
                    isPast && "text-[var(--success)]",
                    isFuture && "text-slate-400"
                  )}
                >
                  {s.label}
                  {s.id === "extracting" && totalPages && ` (${totalPages} pages)`}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <p className="mt-8 text-center text-sm text-slate-500 max-w-md">
        Large documents may take longer to analyze. The AI is carefully reviewing every page
        to ensure accurate citations.
      </p>
    </div>
  );
}
