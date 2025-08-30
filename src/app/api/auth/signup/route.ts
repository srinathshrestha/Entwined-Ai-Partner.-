import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { sendEmail, generateVerificationEmailHTML } from "@/lib/mailgun";
import { z } from "zod";
import crypto from "crypto";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      emailVerificationToken,
      emailVerified: false,
    });

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${emailVerificationToken}`;

    const emailResult = await sendEmail({
      to: email,
      subject: "Verify Your Email - Entwined",
      html: generateVerificationEmailHTML(name, verificationLink, email),
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail the signup, but log the error
    }

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully. Please check your email to verify your account.",
      userId: user._id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
