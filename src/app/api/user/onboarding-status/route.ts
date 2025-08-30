import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import UserProfile from "@/lib/models/UserProfile";
import { Companion } from "@/lib/models/Companion";

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user from database
    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create user profile
    const userProfile = await UserProfile.getOrCreate(dbUser._id.toString());

    // Check if user has a companion
    const companion = await Companion.findOne({ userId: dbUser._id });
    const hasCompanionData = !!companion;

    console.log(`User ${user.email} onboarding status:`, {
      onboardingCompleted: userProfile.onboardingCompleted,
      onboardingSkipped: userProfile.onboardingSkipped,
      hasCompanionData,
      companionName: companion?.name || null,
    });

    return NextResponse.json({
      onboardingCompleted: userProfile.onboardingCompleted,
      onboardingSkipped: userProfile.onboardingSkipped,
      onboardingCompletedAt: userProfile.onboardingCompletedAt,
      currentStep: "basic", // Simplified for now
      stepsCompleted: [],
      canSkip:
        !userProfile.onboardingCompleted && !userProfile.onboardingSkipped,
      hasCompanionData,
      companionName: companion?.name || null,
      companionGender: companion?.gender || null,
    });
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to get onboarding status" },
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

    const { action, companionData } = await req.json();

    await connectDB();

    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userProfile = await UserProfile.getOrCreate(dbUser._id.toString());

    if (action === "skip") {
      // Mark as skipped and create default companion
      userProfile.onboardingSkipped = true;
      userProfile.onboardingCompleted = false;
      await userProfile.save();

      // Create default companion for skipped onboarding
      const existingCompanion = await Companion.findOne({ userId: dbUser._id });
      if (!existingCompanion) {
        await Companion.createDefault(dbUser._id);
      }

      return NextResponse.json({
        success: true,
        message: "Onboarding skipped successfully. Default companion created.",
        onboardingSkipped: true,
      });
    }

    if (action === "complete") {
      // Mark as completed
      userProfile.onboardingCompleted = true;
      userProfile.onboardingSkipped = false;
      userProfile.onboardingCompletedAt = new Date();
      await userProfile.save();

      // Create custom companion if data provided
      if (companionData) {
        console.log("Companion data to save:", companionData);

        const existingCompanion = await Companion.findOne({
          userId: dbUser._id,
        });
        if (existingCompanion) {
          // Update existing companion
          Object.assign(existingCompanion, {
            name: companionData.name,
            gender: companionData.gender,
            affectionLevel: companionData.affectionLevel,
            empathyLevel: companionData.empathyLevel,
            curiosityLevel: companionData.curiosityLevel,
            playfulness: companionData.playfulness,
            humorStyle: companionData.humorStyle,
            communicationStyle: companionData.communicationStyle,
            userPreferredAddress: companionData.userPreferredAddress,
            partnerPronouns: companionData.partnerPronouns,
            backStory: companionData.backStory || "",
            isDefault: false,
          });
          await existingCompanion.save();
        } else {
          // Create new companion
          await Companion.create({
            userId: dbUser._id,
            name: companionData.name,
            gender: companionData.gender,
            affectionLevel: companionData.affectionLevel,
            empathyLevel: companionData.empathyLevel,
            curiosityLevel: companionData.curiosityLevel,
            playfulness: companionData.playfulness,
            humorStyle: companionData.humorStyle,
            communicationStyle: companionData.communicationStyle,
            userPreferredAddress: companionData.userPreferredAddress,
            partnerPronouns: companionData.partnerPronouns,
            backStory: companionData.backStory || "",
            isDefault: false,
          });
        }
      }

      console.log(`User onboarding marked as completed: ${user.email}`);
      return NextResponse.json({
        success: true,
        message: "Onboarding completed successfully",
        onboardingCompleted: true,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}