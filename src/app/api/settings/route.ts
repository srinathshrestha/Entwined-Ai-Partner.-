import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET endpoint to load user settings
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // TODO: Implement MongoDB user settings retrieval
    return new Response(
      JSON.stringify({ error: "User settings temporarily unavailable during migration" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Settings GET error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST endpoint to save user settings
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // TODO: Implement MongoDB user settings save
    return new Response(
      JSON.stringify({ error: "User settings save temporarily unavailable during migration" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Settings POST error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}