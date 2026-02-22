import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { analyzeCase, isWithinContextLimit, estimateTokenCount } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId } = body;

    if (!caseId) {
      return NextResponse.json(
        { success: false, error: "Case ID is required" },
        { status: 400 }
      );
    }

    // Fetch the case
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { analysis: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    // Check if already analyzed
    if (caseData.analysis) {
      return NextResponse.json({
        success: true,
        message: "Case already analyzed",
        analysis: {
          synopsis: caseData.analysis.synopsis,
          prosecution: JSON.parse(caseData.analysis.prosecutionJson),
          defense: JSON.parse(caseData.analysis.defenseJson),
          keyDates: JSON.parse(caseData.analysis.keyDatesJson),
          keyPersons: JSON.parse(caseData.analysis.keyPersonsJson),
        },
      });
    }

    // Check document size
    if (!isWithinContextLimit(caseData.extractedText)) {
      return NextResponse.json(
        {
          success: false,
          error: "Document exceeds maximum context window size",
        },
        { status: 400 }
      );
    }

    // Update status to processing
    await prisma.case.update({
      where: { id: caseId },
      data: { status: "processing" },
    });

    try {
      // Analyze the case using Gemini
      const analysis = await analyzeCase(caseData.extractedText);
      const tokensUsed = estimateTokenCount(caseData.extractedText);

      // Save analysis to database
      await prisma.analysis.create({
        data: {
          caseId: caseId,
          synopsis: analysis.synopsis,
          prosecutionJson: JSON.stringify(analysis.prosecution),
          defenseJson: JSON.stringify(analysis.defense),
          keyDatesJson: JSON.stringify(analysis.keyDates),
          keyPersonsJson: JSON.stringify(analysis.keyPersons),
          modelUsed: "gemini-1.5-pro",
          tokensUsed: tokensUsed,
        },
      });

      // Update case status
      await prisma.case.update({
        where: { id: caseId },
        data: { status: "analyzed" },
      });

      return NextResponse.json({
        success: true,
        message: "Analysis complete",
        analysis: analysis,
      });
    } catch (analysisError) {
      // Update status to error
      await prisma.case.update({
        where: { id: caseId },
        data: { status: "error" },
      });

      throw analysisError;
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch existing analysis
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json(
      { success: false, error: "Case ID is required" },
      { status: 400 }
    );
  }

  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { analysis: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    if (!caseData.analysis) {
      return NextResponse.json({
        success: true,
        status: caseData.status,
        analysis: null,
      });
    }

    return NextResponse.json({
      success: true,
      status: caseData.status,
      caseName: caseData.name,
      fileName: caseData.fileName,
      totalPages: caseData.totalPages,
      analysis: {
        synopsis: caseData.analysis.synopsis,
        prosecution: JSON.parse(caseData.analysis.prosecutionJson),
        defense: JSON.parse(caseData.analysis.defenseJson),
        keyDates: JSON.parse(caseData.analysis.keyDatesJson),
        keyPersons: JSON.parse(caseData.analysis.keyPersonsJson),
      },
    });
  } catch (error) {
    console.error("Fetch analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch analysis",
      },
      { status: 500 }
    );
  }
}
