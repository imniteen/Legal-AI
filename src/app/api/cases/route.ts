import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all cases
export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        fileName: true,
        fileSize: true,
        totalPages: true,
        status: true,
        createdAt: true,
        analysis: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cases: cases.map((c) => ({
        ...c,
        hasAnalysis: !!c.analysis,
      })),
    });
  } catch (error) {
    console.error("Fetch cases error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch cases",
      },
      { status: 500 }
    );
  }
}

// DELETE a case
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json(
      { success: false, error: "Case ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete the case (cascades to analysis and chat messages)
    await prisma.case.delete({
      where: { id: caseId },
    });

    return NextResponse.json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("Delete case error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete case",
      },
      { status: 500 }
    );
  }
}
