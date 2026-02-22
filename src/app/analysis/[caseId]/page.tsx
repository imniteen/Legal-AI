"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PDFViewer from "@/components/pdf/PDFViewer";
import CaseSynopsis from "@/components/analysis/CaseSynopsis";
import ProsecutionView from "@/components/analysis/ProsecutionView";
import DefenseView from "@/components/analysis/DefenseView";
import AnalysisLoader from "@/components/analysis/AnalysisLoader";
import ChatInterface from "@/components/chat/ChatInterface";
import { ArrowLeft, FileText, AlertCircle, Play } from "lucide-react";
import type { AnalysisResult, ProsecutionAnalysis, DefenseAnalysis, KeyDate, KeyPerson } from "@/types";

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
  const [analysisStage, setAnalysisStage] = useState<"uploading" | "extracting" | "analyzing" | "prosecution" | "defense" | "complete">("analyzing");
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
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <AnalysisLoader stage="extracting" progress={10} />
        </div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-[var(--error)] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Error</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
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
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)]/10 mx-auto mb-6">
              <FileText className="h-10 w-10 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {caseData?.caseName}
            </h2>
            <p className="text-slate-600 mb-6">
              {caseData?.fileName} &bull; {caseData?.totalPages} pages
            </p>

            {error && (
              <div className="mb-6 rounded-lg bg-[var(--error-light)] border border-[var(--error)]/30 px-4 py-3 text-[var(--error)]">
                {error}
              </div>
            )}

            <button
              onClick={startAnalysis}
              className="inline-flex items-center gap-3 bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-lg"
            >
              <Play className="h-6 w-6" />
              Start AI Analysis
            </button>

            <p className="text-sm text-slate-500 mt-4">
              The AI will analyze your document and generate prosecution and defense strategies with citations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Parse the analysis data
  const analysis = caseData.analysis;
  const prosecution: ProsecutionAnalysis = analysis.prosecution || { strengths: [], evidence: [], recommendations: [] };
  const defense: DefenseAnalysis = analysis.defense || { weaknesses: [], inconsistencies: [], recommendations: [] };
  const keyDates: KeyDate[] = analysis.keyDates || [];
  const keyPersons: KeyPerson[] = analysis.keyPersons || [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Case Header */}
      <div className="bg-white border-b border-[var(--border)] px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="font-semibold text-slate-900">{caseData.caseName}</h1>
              <p className="text-sm text-slate-500">
                {caseData.fileName} &bull; {caseData.totalPages} pages
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "analysis"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="split-panel p-4" style={{ height: "calc(100vh - 130px)" }}>
        {/* Left Panel - PDF Viewer */}
        <div className="h-full overflow-hidden rounded-lg">
          <PDFViewer
            filePath={`/api/pdf?caseId=${caseId}`}
            currentPage={currentPdfPage}
            onPageChange={setCurrentPdfPage}
          />
        </div>

        {/* Right Panel - Analysis or Chat */}
        <div className="h-full overflow-auto">
          {activeTab === "analysis" ? (
            <div className="space-y-6">
              {/* Synopsis */}
              <CaseSynopsis
                synopsis={analysis.synopsis}
                keyDates={keyDates}
                keyPersons={keyPersons}
                onCitationClick={handleCitationClick}
              />

              {/* Dual-Lens View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <div className="h-full bg-white rounded-lg overflow-hidden">
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
