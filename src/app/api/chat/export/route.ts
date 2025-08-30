import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Companion } from "@/lib/models/Companion";
import { Conversation } from "@/lib/models/Conversation";
import { Message, IMessage } from "@/lib/models/Message";

// GET endpoint to export chat history
export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    // Get user's companion
    const companion = await Companion.findOne({ userId: user._id });
    if (!companion) {
      return new Response(JSON.stringify({ error: "Companion not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get conversation
    const conversation = await Conversation.findOne({
      userId: user._id,
      companionId: companion._id,
    });

    if (!conversation) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all messages from the conversation (including deleted ones for export)
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    // Format export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        name: user.name,
        companionName: companion.name,
      },
      conversation: {
        id: conversation._id.toString(),
        startedAt: conversation.createdAt.toISOString(),
        messageCount: messages.length,
      },
      messages: messages.map((msg: IMessage) => ({
        id: msg._id.toString(),
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
