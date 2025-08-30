import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Companion } from "@/lib/models/Companion";

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

    // Get companion for this user
    const companion = await Companion.getOrCreateDefault(dbUser._id);

    return NextResponse.json({
      companion: {
        id: companion._id.toString(),
        name: companion.name,
        affectionLevel: companion.affectionLevel,
        empathyLevel: companion.empathyLevel,
        curiosityLevel: companion.curiosityLevel,
        playfulness: companion.playfulness,
        humorStyle: companion.humorStyle,
        communicationStyle: companion.communicationStyle,
        userPreferredAddress: companion.userPreferredAddress,
        partnerPronouns: companion.partnerPronouns,
        avatarUrl: companion.avatarUrl,
        backStory: companion.backStory,
      },
    });
  } catch (error) {
    console.error("Error fetching companion:", error);
    return NextResponse.json(
      { error: "Failed to fetch companion data" },
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

    const companionData = await req.json();

    // Update companion
    const companion = await Companion.findOne({ userId: dbUser._id });
    if (!companion) {
      return NextResponse.json(
        { error: "Companion not found" },
        { status: 404 }
      );
    }

    // Update companion fields
    Object.assign(companion, {
      name: companionData.name,
      affectionLevel: companionData.affectionLevel,
      empathyLevel: companionData.empathyLevel,
      curiosityLevel: companionData.curiosityLevel,
      playfulness: companionData.playfulness,
      humorStyle: companionData.humorStyle,
      communicationStyle: companionData.communicationStyle,
      userPreferredAddress: companionData.userPreferredAddress,
      partnerPronouns: companionData.partnerPronouns,
      avatarUrl: companionData.avatarUrl,
      backStory: companionData.backStory,
      isDefault: false, // Mark as customized
    });

    await companion.save();

    return NextResponse.json({
      success: true,
      message: "Companion updated successfully",
    });
  } catch (error) {
    console.error("Error updating companion:", error);
    return NextResponse.json(
      { error: "Failed to update companion" },
      { status: 500 }
    );
  }
}