"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PDFViewer from "@/components/pdf/PDFViewer";
import CaseSynopsis from "@/components/analysis/CaseSynopsis";
import ProsecutionView from "@/components/analysis/ProsecutionView";
import DefenseView from "@/components/analysis/DefenseView";
import LegalReferencesView from "@/components/analysis/LegalReferencesView";
import AnalysisLoader from "@/components/analysis/AnalysisLoader";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Play,
  MessageSquare,
  BarChart3,
  Scale,
  Sparkles,
} from "lucide-react";
import type {
  AnalysisResult,
  ProsecutionAnalysis,
  DefenseAnalysis,
  KeyDate,
  KeyPerson,
  LegalReference,
} from "@/types";

interface CaseData {
  status: string;
  caseName: string;
  fileName: string;
  totalPages: number;
  filePath?: string;
  analysis: AnalysisResult | null;
}

export default function AnalysisPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<
    | "uploading"
    | "extracting"
    | "analyzing"
    | "prosecution"
    | "defense"
    | "complete"
  >("analyzing");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");

  const fetchCase = useCallback(async () => {
    try {
      const response = await fetch(`/api/analyze?caseId=${caseId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch case");
      }

      setCaseData({
        status: data.status,
        caseName: data.caseName || "Untitled Case",
        fileName: data.fileName || "document.pdf",
        totalPages: data.totalPages || 0,
        analysis: data.analysis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case");
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    setAnalysisStage("extracting");

    // Simulate progress stages
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev < 20) {
          setAnalysisStage("extracting");
          return prev + 2;
        } else if (prev < 50) {
          setAnalysisStage("analyzing");
          return prev + 1;
        } else if (prev < 70) {
          setAnalysisStage("prosecution");
          return prev + 1;
        } else if (prev < 90) {
          setAnalysisStage("defense");
          return prev + 0.5;
        }
        return prev;
      });
    }, 300);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });

      const data = await response.json();

      clearInterval(progressInterval);

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisProgress(100);
      setAnalysisStage("complete");

      // Update case data with analysis
      setCaseData((prev) =>
        prev
          ? {
              ...prev,
              status: "analyzed",
              analysis: data.analysis,
            }
          : null
      );

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Analysis failed");
      setIsAnalyzing(false);
    }
  };

  const handleCitationClick = (page: number) => {
    setCurrentPdfPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 font-medium">Loading case data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Error Loading Case
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <AnalysisLoader
            stage={analysisStage}
            progress={analysisProgress}
            totalPages={caseData?.totalPages}
          />
        </div>
      </div>
    );
  }

  // No analysis yet - show start analysis button
  if (!caseData?.analysis) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-center py-16 max-w-2xl mx-auto">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-amber-900" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {caseData?.caseName}
            </h2>
            <p className="text-slate-500 mb-8">
              <span className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm">
                <FileText className="h-4 w-4" />
                {caseData?.fileName} &bull; {caseData?.totalPages} pages
              </span>
            </p>

            {error && (
              <div className="mb-8 rounded-xl bg-red-50 border border-red-100 px-5 py-4 text-red-600 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={startAnalysis}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1"
            >
              <Play className="h-6 w-6" />
              Start AI Analysis
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>

            <p className="text-sm text-slate-500 mt-6 max-w-md mx-auto">
              Our AI will analyze your document and generate comprehensive
              prosecution and defense strategies with page citations.
            </p>

            {/* Feature preview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3 mx-auto">
                  <Scale className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Prosecution View
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Key strengths & evidence
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 mx-auto">
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Defense View
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Weaknesses & gaps
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3 mx-auto">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  AI Chat
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ask questions about the case
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parse the analysis data
  const analysis = caseData.analysis;
  const prosecution: ProsecutionAnalysis = analysis.prosecution || {
    strengths: [],
    evidence: [],
    recommendations: [],
  };
  const defense: DefenseAnalysis = analysis.defense || {
    weaknesses: [],
    inconsistencies: [],
    recommendations: [],
  };
  const keyDates: KeyDate[] = analysis.keyDates || [];
  const keyPersons: KeyPerson[] = analysis.keyPersons || [];
  const legalReferences: LegalReference[] = analysis.legalReferences || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Case Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center shadow-md">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900">
                    {caseData.caseName}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {caseData.fileName} &bull; {caseData.totalPages} pages
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1.5">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "analysis"
                    ? "bg-white text-[var(--primary)] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analysis
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "chat"
                    ? "bg-white text-[var(--primary)] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"
        style={{ height: "calc(100vh - 140px)" }}
      >
        {/* Left Panel - PDF Viewer */}
        <div className="h-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
          <PDFViewer
            filePath={`/api/pdf?caseId=${caseId}`}
            currentPage={currentPdfPage}
            onPageChange={setCurrentPdfPage}
          />
        </div>

        {/* Right Panel - Analysis or Chat */}
        <div className="h-full overflow-auto">
          {activeTab === "analysis" ? (
            <div className="space-y-4">
              {/* Synopsis */}
              <CaseSynopsis
                synopsis={analysis.synopsis}
                keyDates={keyDates}
                keyPersons={keyPersons}
                onCitationClick={handleCitationClick}
              />

              {/* Legal References */}
              <LegalReferencesView
                legalReferences={legalReferences}
                onCitationClick={handleCitationClick}
              />

              {/* Dual-Lens View */}
              <div className="grid grid-cols-1 gap-4">
                <ProsecutionView
                  analysis={prosecution}
                  onCitationClick={handleCitationClick}
                />
                <DefenseView
                  analysis={defense}
                  onCitationClick={handleCitationClick}
                />
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <ChatInterface
                caseId={caseId}
                onCitationClick={handleCitationClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
