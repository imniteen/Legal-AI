"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Import react-pdf styles
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  filePath: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PDFViewer({
  filePath,
  currentPage = 1,
  onPageChange,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(currentPage);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF document");
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    const newPage = Math.max(1, pageNumber - 1);
    setPageNumber(newPage);
    onPageChange?.(newPage);
  };

  const goToNextPage = () => {
    const newPage = Math.min(numPages, pageNumber + 1);
    setPageNumber(newPage);
    onPageChange?.(newPage);
  };

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(numPages, page));
    setPageNumber(validPage);
    onPageChange?.(validPage);
  };

  const zoomIn = () => setScale((s) => Math.min(2.0, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <span className="font-medium text-slate-900">Document Viewer</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4 text-slate-600" />
            </button>
            <span className="text-sm text-slate-600 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className={cn(
                "p-1.5 rounded transition-colors",
                pageNumber <= 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1 text-sm">
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => goToPage(parseInt(e.target.value, 10) || 1)}
                className="w-12 px-2 py-1 text-center border border-slate-300 rounded"
                min={1}
                max={numPages}
              />
              <span className="text-slate-500">/ {numPages}</span>
            </div>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className={cn(
                "p-1.5 rounded transition-colors",
                pageNumber >= numPages
                  ? "text-slate-300 cursor-not-allowed"
                  : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-start justify-center p-4"
      >
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] mx-auto mb-2" />
              <p className="text-slate-500">Loading document...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[var(--error)]">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <Document
          file={filePath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className={cn(isLoading && "hidden")}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
}
