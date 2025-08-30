import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message, MessageRole } from "@/lib/models/Message";
import { Conversation } from "@/lib/models/Conversation";
import { Companion } from "@/lib/models/Companion";
import { getCharacterAgent } from "@/lib/ai/character-agent";
import { createMemoryFromMessage } from "@/lib/ai/memory-generator";
import mongoose from "mongoose";

// GET: Retrieve chat messages for a conversation
export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get or create default companion for user
    const companion = await Companion.getOrCreateDefault(user._id);

    // Get or create active conversation
    let conversation = await Conversation.findOne({
      userId: user._id,
      companionId: companion._id,
      isActive: true,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        companionId: companion._id,
        title: "New Conversation",
        isActive: true,
        lastActivity: new Date(),
        messageCount: 0,
        userMessages: 0,
        aiMessages: 0,
        deletedMessages: 0,
        editedMessages: 0,
      });
    }

    // Retrieve messages for this conversation (not deleted, ordered by creation time)
    const messages = await Message.find({
      conversationId: conversation._id,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(50); // Last 50 messages

    // Format messages for frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      content: msg.content,
      role: msg.role.toLowerCase(), // Convert to lowercase for frontend
      createdAt: msg.createdAt.toISOString(),
      replyToId: msg.replyToId?.toString(),
      isEdited: msg.isEdited,
    }));

    return NextResponse.json({
      messages: formattedMessages,
      conversationId: conversation._id.toString(),
      companion: {
        id: companion._id.toString(),
        name: companion.name,
        gender: companion.gender,
        avatarUrl: companion.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    return NextResponse.json(
      { error: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}

// POST: Send a new message and get AI response
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, replyToId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get or create default companion for user
    const companion = await Companion.getOrCreateDefault(user._id);

    // Get or create active conversation
    let conversation = await Conversation.findOne({
      userId: user._id,
      companionId: companion._id,
      isActive: true,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        companionId: companion._id,
        title: "New Conversation",
        isActive: true,
        lastActivity: new Date(),
        messageCount: 0,
        userMessages: 0,
        aiMessages: 0,
        deletedMessages: 0,
        editedMessages: 0,
      });
    }

    // Handle reply context if provided
    let replyContext = undefined;
    if (replyToId) {
      const originalMessage = await Message.findById(replyToId);
      if (originalMessage) {
        replyContext = {
          originalMessage,
          replyMessage: message,
        };
      }
    }

    // Save user message to database
    const userMessage = await Message.create({
      conversationId: conversation._id,
      content: message.trim(),
      role: MessageRole.USER,
      replyToId: replyToId ? new mongoose.Types.ObjectId(replyToId) : undefined,
      wordCount: message.trim().split(" ").length,
      characterCount: message.trim().length,
    });

    // Create memory from user message if it contains personal information
    try {
      await createMemoryFromMessage(
        message.trim(),
        user._id,
        companion._id,
        userMessage._id
      );
    } catch (error) {
      console.error("Error creating memory from message:", error);
      // Don't fail the chat if memory creation fails
    }

    // Get recent conversation history for context (last 20 messages)
    const recentMessages = await Message.find({
      conversationId: conversation._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // Reverse to get chronological order for AI context
    recentMessages.reverse();

    // Generate AI response using our character agent
    const characterAgent = getCharacterAgent();

    const aiResponse = await characterAgent.generateResponse({
      companion,
      recentMessages,
      userMessage: message.trim(),
      replyContext,
    });

    // Save AI response to database
    const aiMessage = await Message.create({
      conversationId: conversation._id,
      content: aiResponse,
      role: MessageRole.ASSISTANT,
      replyToId: userMessage._id, // AI message replies to user message
      wordCount: aiResponse.split(" ").length,
      characterCount: aiResponse.length,
    });

    // Update conversation statistics
    await Conversation.findByIdAndUpdate(conversation._id, {
      $inc: {
        messageCount: 2, // User + AI message
        userMessages: 1,
        aiMessages: 1,
      },
      lastActivity: new Date(),
    });

    // Update companion's reply tracking
    if (replyToId) {
      await Message.findByIdAndUpdate(replyToId, {
        hasReplies: true,
      });
    }

    // Format response for frontend
    const response = {
      userMessage: {
        id: userMessage._id.toString(),
        content: userMessage.content,
        role: userMessage.role.toLowerCase(), // Convert to lowercase for frontend
        createdAt: userMessage.createdAt.toISOString(),
        replyToId: userMessage.replyToId?.toString(),
      },
      aiMessage: {
        id: aiMessage._id.toString(),
        content: aiMessage.content,
        role: aiMessage.role.toLowerCase(), // Convert to lowercase for frontend
        createdAt: aiMessage.createdAt.toISOString(),
        replyToId: aiMessage.replyToId?.toString(),
      },
      conversationId: conversation._id.toString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
