"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import DropZone from "@/components/upload/DropZone";
import { ArrowLeft, CheckCircle, Scale } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] shadow-lg">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Upload Case File</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Upload your legal case PDF (FIR, witness statements, evidence logs) for AI-powered analysis.
          </p>
        </div>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto">
          {uploadSuccess ? (
            <div className="text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/10 mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-[var(--success)]" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Upload Successful!
              </h2>
              <p className="text-slate-600 mb-6">
                Redirecting to analysis page...
              </p>
              <Link
                href={`/analysis/${uploadedCaseId}`}
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Go to Analysis
              </Link>
            </div>
          ) : (
            <>
              <DropZone onUpload={handleUpload} isUploading={isUploading} />

              {error && (
                <div className="mt-6 rounded-lg bg-[var(--error-light)] border border-[var(--error)]/30 px-4 py-3 text-[var(--error)]">
                  {error}
                </div>
              )}
            </>
          )}

          {/* Tips */}
          <div className="mt-12 card">
            <div className="card-body">
              <h3 className="font-semibold text-slate-900 mb-4">Tips for Best Results</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold flex-shrink-0">1</span>
                  <span>Use text-based PDFs (not scanned images) for best text extraction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold flex-shrink-0">2</span>
                  <span>Ensure the PDF is not password protected or encrypted.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold flex-shrink-0">3</span>
                  <span>Include all relevant documents in a single PDF if possible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold flex-shrink-0">4</span>
                  <span>Maximum file size is 50MB. Large documents may take longer to analyze.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
