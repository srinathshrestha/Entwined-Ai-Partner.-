"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OnboardingStatus {
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  hasCompanionData: boolean;
  companionName?: string;
  companionGender?: string;
  canSkip: boolean;
  currentStep: string;
}

export function useOnboardingCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (status === "loading" || !session?.user || hasCheckedOnce) return;

      try {
        console.log("Polling onboarding status for user:", session.user.email);

        const response = await fetch("/api/user/onboarding-status", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOnboardingStatus(data);
        setHasCheckedOnce(true);

        console.log("Onboarding status received:", data);

        // Decision logic based on actual database data
        if (data.onboardingCompleted && data.hasCompanionData) {
          console.log("✅ User has completed onboarding with companion data");
          return "completed";
        } else if (data.onboardingSkipped) {
          console.log("⏭️ User has skipped onboarding");
          return "skipped";
        } else {
          console.log("❌ User needs to complete onboarding");
          return "needs_onboarding";
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, assume needs onboarding to be safe
        return "needs_onboarding";
      } finally {
        setIsChecking(false);
      }
    };

    if (session?.user && !hasCheckedOnce) {
      checkOnboardingStatus().then((result) => {
        if (result) {
          // Store result but don't redirect here - let components handle it
          console.log("Onboarding check result:", result);
        }
      });
    }
  }, [session, status, hasCheckedOnce]);

  // Reset check when user changes
  useEffect(() => {
    setHasCheckedOnce(false);
    setIsChecking(true);
    setOnboardingStatus(null);
  }, [session?.user?.email]);

  return {
    onboardingStatus,
    isChecking,
    hasCheckedOnce,
    needsOnboarding: onboardingStatus
      ? !onboardingStatus.onboardingCompleted &&
        !onboardingStatus.onboardingSkipped
      : null,
    isCompleted:
      onboardingStatus?.onboardingCompleted &&
      onboardingStatus?.hasCompanionData,
    isSkipped: onboardingStatus?.onboardingSkipped,
  };
}
