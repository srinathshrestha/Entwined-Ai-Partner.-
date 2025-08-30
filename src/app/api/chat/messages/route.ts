import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models/Message";
import { Conversation } from "@/lib/models/Conversation";
import { NextRequest } from "next/server";

// DELETE endpoint to delete a message or clear all chat history
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      // Clear all messages for the user
      const conversations = await Conversation.find({ userId: user._id });
      const conversationIds = conversations.map((c) => c._id);

      const deleteResult = await Message.updateMany(
        { conversationId: { $in: conversationIds } },
        {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: "USER",
        }
      );

      // Update conversation statistics
      await Conversation.updateMany(
        { userId: user._id },
        {
          $inc: { deletedMessages: deleteResult.modifiedCount },
          lastActivity: new Date(),
        }
      );

      console.log(
        `✅ Cleared ${deleteResult.modifiedCount} messages for user ${user.email}`
      );

      return new Response(
        JSON.stringify({
          success: true,
          deletedCount: deleteResult.modifiedCount,
          message: "All messages cleared successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (messageId) {
      // Delete specific message
      console.log(
        `🗑️ Delete request - messageId: ${messageId}, user: ${user.email}`
      );

      const message = await Message.findById(messageId);

      if (!message) {
        return new Response(JSON.stringify({ error: "Message not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify the message belongs to the user's conversation
      const conversation = await Conversation.findById(message.conversationId);
      if (
        !conversation ||
        conversation.userId.toString() !== user._id.toString()
      ) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to delete this message" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      // Soft delete the message
      await Message.findByIdAndUpdate(messageId, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: "USER",
      });

      // Update conversation statistics
      await Conversation.findByIdAndUpdate(conversation._id, {
        $inc: { deletedMessages: 1 },
        lastActivity: new Date(),
      });

      console.log(`✅ Deleted message ${messageId} for user ${user.email}`);

      console.log(
        `🗑️ Delete request - messageId: ${messageId}, user: ${user.email}`
      );

      return new Response(
        JSON.stringify({
          success: true,
          messageId: messageId,
          message: "Message deleted successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "No messageId or clearAll parameter provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}