"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
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
          "relative rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer",
          isDragActive
            ? "border-[var(--primary)] bg-[var(--primary-light)]/10"
            : "border-slate-300 hover:border-[var(--primary)] hover:bg-slate-50",
          isUploading && "pointer-events-none opacity-50",
          selectedFile && "border-solid border-[var(--success)] bg-[var(--success-light)]"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10">
              <FileText className="h-8 w-8 text-[var(--success)]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Upload className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {isDragActive ? "Drop your PDF here" : "Drag & drop your case file"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                or click to browse (PDF files only, max 50MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Case Name Input */}
      {selectedFile && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="caseName" className="block text-sm font-medium text-slate-700 mb-2">
              Case Name
            </label>
            <input
              type="text"
              id="caseName"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              placeholder="Enter a descriptive name for this case"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              disabled={isUploading}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-[var(--error-light)] border border-[var(--error)]/30 px-4 py-3 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile || !caseName.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition-all",
              isUploading || !selectedFile || !caseName.trim()
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading & Extracting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Analyze Case
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
