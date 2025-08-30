import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Memory } from "@/lib/models/Memory";
import { SimplifiedMemory } from "@/lib/models/SimplifiedMemory";

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get both Memory and SimplifiedMemory records for this user
    const [legacyMemories, simplifiedMemories] = await Promise.all([
      Memory.find({
        userId: dbUser._id,
        status: "active",
      })
        .sort({ createdAt: -1 })
        .limit(50),

      SimplifiedMemory.find({
        userId: dbUser._id,
        isVisible: true,
      })
        .sort({ createdAt: -1 })
        .limit(50),
    ]);

    // Combine and format memories
    const allMemories = [
      ...legacyMemories.map((memory) => ({
        id: memory._id.toString(),
        content: memory.content,
        importance: memory.importance,
        tags: memory.tags,
        category: memory.category,
        type: memory.type,
        userCreated: memory.type === "manual",
        createdAt: memory.createdAt,
        emotionalContext: memory.context?.emotionalTone,
      })),
      ...simplifiedMemories.map((memory) => ({
        id: memory._id.toString(),
        content: memory.content,
        importance: memory.importance,
        tags: memory.tags,
        category: "personal", // SimplifiedMemory doesn't have category field
        type: memory.userCreated ? "manual" : "auto",
        userCreated: memory.userCreated,
        createdAt: memory.createdAt,
        emotionalContext: memory.emotionalContext,
      })),
    ];

    // Sort all memories by creation date (newest first)
    allMemories.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      memories: allMemories.slice(0, 100), // Limit to 100 total memories
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { content, importance, tags, category } = await req.json();

    // Create manual memory
    const memory = await Memory.create({
      userId: dbUser._id,
      companionId: null, // Will be set when we have an active conversation
      conversationId: null, // Will be set when we have an active conversation
      content,
      importance: importance || 5,
      tags: tags || [],
      category: category || "personal",
      type: "manual",
      status: "active",
    });

    return NextResponse.json({
      success: true,
      memory: {
        id: memory._id.toString(),
        content: memory.content,
        importance: memory.importance,
        tags: memory.tags,
        category: memory.category,
        createdAt: memory.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating memory:", error);
    return NextResponse.json(
      { error: "Failed to create memory" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const memoryId = url.searchParams.get("id");

    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to delete from both Memory and SimplifiedMemory collections
    const [legacyMemory, simplifiedMemory] = await Promise.all([
      Memory.findOneAndUpdate(
        { _id: memoryId, userId: dbUser._id },
        { status: "deleted" },
        { new: true }
      ),
      SimplifiedMemory.findOneAndUpdate(
        { _id: memoryId, userId: dbUser._id },
        { isVisible: false },
        { new: true }
      ),
    ]);

    if (!legacyMemory && !simplifiedMemory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
      { status: 500 }
    );
  }
}
