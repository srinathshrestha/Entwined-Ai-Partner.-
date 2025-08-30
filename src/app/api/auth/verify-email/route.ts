import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Redirect to success page or login
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/signin?verified=true`
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
