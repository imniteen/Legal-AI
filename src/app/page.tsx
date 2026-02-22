"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import {
  FileText,
  Upload,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Scale,
} from "lucide-react";
import { cn, formatFileSize, formatDate } from "@/lib/utils";

interface CaseItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  status: string;
  createdAt: string;
  hasAnalysis: boolean;
}

export default function HomePage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/cases");
      const data = await response.json();
      if (data.success) {
        setCases(data.cases);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to load cases");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = async (caseId: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;

    try {
      const response = await fetch(`/api/cases?caseId=${caseId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setCases((prev) => prev.filter((c) => c.id !== caseId));
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to delete case");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analyzed":
        return <CheckCircle className="h-5 w-5 text-[var(--success)]" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-[var(--info)] animate-spin" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-[var(--error)]" />;
      default:
        return <Clock className="h-5 w-5 text-[var(--warning)]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] shadow-lg">
              <Scale className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to JurisAI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AI-powered legal case analysis platform. Upload your case files and receive
            comprehensive dual-lens analysis from both prosecution and defense perspectives.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-12">
          <Link
            href="/upload"
            className="flex items-center gap-3 bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-xl"
          >
            <Upload className="h-6 w-6" />
            Upload New Case
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Cases List */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
              <span>Your Cases</span>
            </div>
            <span className="text-sm text-slate-500">{cases.length} cases</span>
          </div>

          <div className="card-body">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-[var(--error)]">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{error}</p>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No cases uploaded yet</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                >
                  <Upload className="h-4 w-4" />
                  Upload your first case
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[var(--primary)] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(caseItem.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900">{caseItem.name}</h3>
                        <p className="text-sm text-slate-500">
                          {caseItem.fileName} &bull; {formatFileSize(caseItem.fileSize)} &bull;{" "}
                          {caseItem.totalPages} pages
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Uploaded {formatDate(caseItem.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium capitalize",
                          caseItem.status === "analyzed" &&
                            "bg-[var(--success-light)] text-[var(--success)]",
                          caseItem.status === "processing" &&
                            "bg-[var(--info-light)] text-[var(--info)]",
                          caseItem.status === "pending" &&
                            "bg-[var(--warning-light)] text-[var(--warning)]",
                          caseItem.status === "error" &&
                            "bg-[var(--error-light)] text-[var(--error)]"
                        )}
                      >
                        {caseItem.status}
                      </span>

                      <Link
                        href={`/analysis/${caseItem.id}`}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
                      >
                        {caseItem.hasAnalysis ? "View Analysis" : "Analyze"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(caseItem.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
                        title="Delete case"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--prosecution-light)] mx-auto mb-4">
                <Scale className="h-6 w-6 text-[var(--prosecution)]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Dual-Lens Analysis</h3>
              <p className="text-sm text-slate-600">
                Evaluate cases from both prosecution and defense perspectives simultaneously.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--info-light)] mx-auto mb-4">
                <FileText className="h-6 w-6 text-[var(--info)]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Citation Compliance</h3>
              <p className="text-sm text-slate-600">
                Every claim is backed by specific page citations from your documents.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--success-light)] mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-[var(--success)]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Zero Hallucination</h3>
              <p className="text-sm text-slate-600">
                AI only references facts present in your documents. Nothing invented.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
