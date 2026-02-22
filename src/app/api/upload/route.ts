import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { parsePDFWithPageMarkers, validatePDF } from "@/lib/pdf-parser";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "50", 10);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caseName = formData.get("caseName") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!caseName) {
      return NextResponse.json(
        { success: false, error: "Case name is required" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${fileSizeMB.toFixed(2)} MB) exceeds maximum allowed (${MAX_FILE_SIZE_MB} MB)`,
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.resolve(UPLOAD_DIR);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${safeFileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Validate the PDF
    const validation = await validatePDF(filePath, MAX_FILE_SIZE_MB);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Parse the PDF
    const parsedPDF = await parsePDFWithPageMarkers(filePath);

    // Create case in database
    const newCase = await prisma.case.create({
      data: {
        name: caseName,
        fileName: file.name,
        filePath: filePath,
        fileSize: file.size,
        totalPages: parsedPDF.totalPages,
        extractedText: parsedPDF.markedText,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      caseId: newCase.id,
      message: `File uploaded successfully. ${parsedPDF.totalPages} pages extracted.`,
      totalPages: parsedPDF.totalPages,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
