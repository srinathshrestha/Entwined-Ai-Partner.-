"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to simplified chat
    router.push("/chat/simplified");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to chat...</p>
      </div>
    </div>
  );
}
