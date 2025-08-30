import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// GET endpoint to export chat history
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user and their conversation
    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const companion = await db.companion.findFirst({
      where: { userId: user.id },
    });
    if (!companion) {
      return new Response(JSON.stringify({ error: "Companion not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get conversation
    const conversation = await db.conversation.findFirst({
      where: { userId: user.id, companionId: companion.id },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all messages from the conversation (including deleted ones for export)
    const messages = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    // Format export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        name: user.name,
        companionName: companion.name,
      },
      conversation: {
        id: conversation.id,
        startedAt: conversation.createdAt.toISOString(),
        messageCount: messages.length,
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role.toLowerCase(),
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
        wordCount: msg.wordCount,
        characterCount: msg.characterCount,
        isDeleted: msg.isDeleted,
      })),
    };

    // Return as downloadable JSON file
    const jsonString = JSON.stringify(exportData, null, 2);

    return new Response(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="chat-history-${
          new Date().toISOString().split("T")[0]
        }.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting chat history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to export chat history" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
