import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return empty data - TODO: Implement with MongoDB
    return NextResponse.json(
      {
        error: "No companion found. Please complete onboarding first.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching companion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await request.json();

    // For now, just acknowledge the update - TODO: Implement with MongoDB
    console.log("Companion update:", updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating companion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
