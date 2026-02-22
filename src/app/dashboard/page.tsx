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
  Search,
  Filter,
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

export default function DashboardPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      analyzed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      error: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const filteredCases = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
            <p className="text-slate-600">Manage and analyze your legal cases</p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
          >
            <Upload className="h-5 w-5" />
            Upload New Case
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Cases", value: cases.length, icon: FileText, color: "blue" },
            { label: "Analyzed", value: cases.filter((c) => c.status === "analyzed").length, icon: CheckCircle, color: "emerald" },
            { label: "Processing", value: cases.filter((c) => c.status === "processing").length, icon: Loader2, color: "amber" },
            { label: "Pending", value: cases.filter((c) => c.status === "pending").length, icon: Clock, color: "slate" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Cases List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Your Cases</h2>
                <p className="text-sm text-slate-500">{filteredCases.length} cases found</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-300" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-2">
                  {searchQuery ? "No cases match your search" : "No cases uploaded yet"}
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  {searchQuery ? "Try a different search term" : "Get started by uploading your first case"}
                </p>
                {!searchQuery && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline font-medium"
                  >
                    <Upload className="h-4 w-4" />
                    Upload your first case
                  </Link>
                )}
              </div>
            ) : (
              filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(caseItem.status)}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{caseItem.name}</h3>
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
                        "px-3 py-1.5 rounded-full text-xs font-medium capitalize border",
                        getStatusBadge(caseItem.status)
                      )}
                    >
                      {caseItem.status}
                    </span>

                    <Link
                      href={`/analysis/${caseItem.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                      {caseItem.hasAnalysis ? "View" : "Analyze"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete case"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Dual-Lens Analysis</h3>
            <p className="text-sm text-slate-600">
              Evaluate cases from both prosecution and defense perspectives simultaneously.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Citation Compliance</h3>
            <p className="text-sm text-slate-600">
              Every claim is backed by specific page citations from your documents.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Zero Hallucination</h3>
            <p className="text-sm text-slate-600">
              AI only references facts present in your documents. Nothing invented.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
