"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("No verification token provided.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus("success");
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push("/auth/signin?verified=true");
          }, 3000);
        } else {
          setVerificationStatus("error");
          setErrorMessage(
            data.error || "Verification failed. Please try again."
          );
        }
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(
          "An error occurred during verification. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token, router]);

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Verifying Your Email
              </CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-700">
                Email Verified!
              </CardTitle>
              <CardDescription>
                Your email address has been successfully verified. You can now
                sign in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Redirecting you to the sign-in page in a few seconds...
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => router.push("/auth/signin?verified=true")}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              Verification Failed
            </CardTitle>
            <CardDescription>
              We couldn't verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                The verification link may have expired or is invalid.
              </p>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/auth/signup")}
                >
                  Sign Up Again
                </Button>
                <Link
                  href="/auth/signin"
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
