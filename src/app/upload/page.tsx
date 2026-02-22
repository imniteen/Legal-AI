"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import DropZone from "@/components/upload/DropZone";
import { ArrowLeft, CheckCircle, Scale, Sparkles, FileText, Shield, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCaseId, setUploadedCaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File, caseName: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseName", caseName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess(true);
      setUploadedCaseId(data.caseId);

      // Redirect to analysis page after short delay
      setTimeout(() => {
        router.push(`/analysis/${data.caseId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8 font-medium transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--primary)]/10 to-indigo-500/10 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 shadow-xl shadow-blue-500/25">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Upload Case File</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Upload your legal case PDF (FIR, witness statements, evidence logs) for AI-powered analysis with dual-perspective insights.
          </p>
        </div>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto">
          {uploadSuccess ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-500/10 p-10 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Upload Successful!
              </h2>
              <p className="text-slate-600 mb-8">
                Your document is ready. Redirecting to analysis page...
              </p>
              <Link
                href={`/analysis/${uploadedCaseId}`}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[var(--primary)] to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1"
              >
                Go to Analysis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <>
              <DropZone onUpload={handleUpload} isUploading={isUploading} />

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-600 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-lg">!</span>
                  </div>
                  {error}
                </div>
              )}
            </>
          )}

          {/* Tips Section */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tips for Best Results</h3>
                <p className="text-xs text-slate-500">Optimize your document for accurate analysis</p>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white text-sm font-bold flex-shrink-0 shadow-md">1</span>
                  <div>
                    <p className="font-medium text-slate-900">Use text-based PDFs</p>
                    <p className="text-sm text-slate-500">Avoid scanned images for best text extraction accuracy.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white text-sm font-bold flex-shrink-0 shadow-md">2</span>
                  <div>
                    <p className="font-medium text-slate-900">No password protection</p>
                    <p className="text-sm text-slate-500">Ensure the PDF is not encrypted or password protected.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white text-sm font-bold flex-shrink-0 shadow-md">3</span>
                  <div>
                    <p className="font-medium text-slate-900">Combine related documents</p>
                    <p className="text-sm text-slate-500">Include all relevant documents in a single PDF if possible.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white text-sm font-bold flex-shrink-0 shadow-md">4</span>
                  <div>
                    <p className="font-medium text-slate-900">File size limit: 50MB</p>
                    <p className="text-sm text-slate-500">Large documents may take longer to analyze thoroughly.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* What You'll Get Section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-4 shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Case Synopsis</h4>
              <p className="text-xs text-slate-500">AI-generated summary with key dates and persons</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Dual Analysis</h4>
              <p className="text-xs text-slate-500">Prosecution & defense perspectives</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-md">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">AI Chat</h4>
              <p className="text-xs text-slate-500">Ask questions about your case</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
