import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { chatAboutCase } from "@/lib/gemini";
import { parseCitations } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, message } = body;

    if (!caseId || !message) {
      return NextResponse.json(
        { success: false, error: "Case ID and message are required" },
        { status: 400 }
      );
    }

    // Fetch the case with analysis and chat history
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        analysis: true,
        chatMessages: {
          orderBy: { createdAt: "asc" },
          take: 20, // Get last 20 messages for context
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    if (!caseData.analysis) {
      return NextResponse.json(
        { success: false, error: "Case has not been analyzed yet" },
        { status: 400 }
      );
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        caseId: caseId,
        role: "user",
        content: message,
      },
    });

    // Prepare conversation history
    const conversationHistory = caseData.chatMessages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Get AI response
    const analysisJson = JSON.stringify({
      synopsis: caseData.analysis.synopsis,
      prosecution: JSON.parse(caseData.analysis.prosecutionJson),
      defense: JSON.parse(caseData.analysis.defenseJson),
    });

    const response = await chatAboutCase(
      caseData.extractedText,
      analysisJson,
      conversationHistory,
      message
    );

    // Extract citations from response
    const citations = parseCitations(response);

    // Save assistant response
    const savedMessage = await prisma.chatMessage.create({
      data: {
        caseId: caseId,
        role: "assistant",
        content: response,
        citations: JSON.stringify(citations),
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: savedMessage.id,
        role: "assistant",
        content: response,
        citations: citations,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Chat failed",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch chat history
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
    const messages = await prisma.chatMessage.findMany({
      where: { caseId: caseId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        citations: msg.citations ? JSON.parse(msg.citations) : [],
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch chat",
      },
      { status: 500 }
    );
  }
}
