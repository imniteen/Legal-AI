"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface DropZoneProps {
  onUpload: (file: File, caseName: string) => Promise<void>;
  isUploading: boolean;
}

export default function DropZone({ onUpload, isUploading }: DropZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caseName, setCaseName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted");
        return;
      }
      setSelectedFile(file);
      // Auto-generate case name from filename
      const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
      setCaseName(nameWithoutExt);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    if (!caseName.trim()) {
      setError("Please enter a case name");
      return;
    }
    setError(null);
    await onUpload(selectedFile, caseName.trim());
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCaseName("");
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer bg-white shadow-sm overflow-hidden",
          isDragActive
            ? "border-[var(--primary)] bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02]"
            : "border-slate-200 hover:border-[var(--primary)] hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50/30",
          isUploading && "pointer-events-none opacity-60",
          selectedFile && "border-solid border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50"
        )}
      >
        <input {...getInputProps()} />

        {/* Background decoration */}
        {isDragActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-indigo-500/5 animate-pulse" />
        )}

        {selectedFile ? (
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 text-lg">{selectedFile.name}</p>
              <p className="text-sm text-emerald-600 font-medium mt-1">{formatFileSize(selectedFile.size)} - Ready to upload</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors font-medium"
            >
              <X className="h-4 w-4" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[var(--primary)]/10 to-indigo-500/10 blur-lg animate-pulse" />
              <div className={cn(
                "relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all",
                isDragActive
                  ? "bg-gradient-to-br from-[var(--primary)] to-indigo-600 shadow-lg shadow-blue-500/25 scale-110"
                  : "bg-gradient-to-br from-slate-100 to-slate-200"
              )}>
                <Upload className={cn(
                  "h-10 w-10 transition-colors",
                  isDragActive ? "text-white" : "text-slate-500"
                )} />
              </div>
              {isDragActive && (
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md animate-bounce">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className={cn(
                "text-xl font-bold transition-colors",
                isDragActive ? "text-[var(--primary)]" : "text-slate-900"
              )}>
                {isDragActive ? "Drop your PDF here" : "Drag & drop your case file"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                or <span className="text-[var(--primary)] font-medium hover:underline">click to browse</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PDF files only, max 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Case Name Input */}
      {selectedFile && (
        <div className="mt-6 space-y-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div>
            <label htmlFor="caseName" className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
              <FileText className="h-4 w-4 text-[var(--primary)]" />
              Case Name
            </label>
            <input
              type="text"
              id="caseName"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              placeholder="Enter a descriptive name for this case"
              className="w-full rounded-xl border border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 transition-all bg-slate-50 focus:bg-white"
              disabled={isUploading}
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-sm font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile || !caseName.trim()}
            className={cn(
              "group w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold transition-all",
              isUploading || !selectedFile || !caseName.trim()
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[var(--primary)] to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading & Extracting...</span>
                <div className="flex gap-1 ml-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Analyze Case
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
