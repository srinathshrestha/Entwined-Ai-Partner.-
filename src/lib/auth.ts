import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

// Helper function to get the current authenticated user
export async function getCurrentUser() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return null;
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Helper function to require authentication
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
