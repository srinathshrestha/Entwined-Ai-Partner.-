"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isChecking, isCompleted, isSkipped } = useOnboardingCheck();

  useEffect(() => {
    if (status === "loading" || isChecking) return;

    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    if (status === "authenticated" && session && !isChecking) {
      if (isCompleted || isSkipped) {
        console.log("✅ Onboarding already completed, redirecting to chat");
        router.replace("/chat/simplified");
        return;
      }

      console.log("❌ Redirecting to simplified onboarding");
      router.replace("/onboarding/simplified");
    }
  }, [status, session, router, isChecking, isCompleted, isSkipped]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {status === "loading"
                  ? "Loading..."
                  : "Checking your progress..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}