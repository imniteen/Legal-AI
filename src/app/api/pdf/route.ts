import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json(
      { error: "Case ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch case from database
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { filePath: true, fileName: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // Check if file exists
    if (!existsSync(caseData.filePath)) {
      return NextResponse.json(
        { error: "PDF file not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(caseData.filePath);

    // Return the PDF with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${caseData.fileName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("PDF fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch PDF" },
      { status: 500 }
    );
  }
}
