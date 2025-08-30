"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  MessageCircle,
  ArrowLeft,
  Heart,
  Bot,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="relative"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse" />

          {/* 404 Number */}
          <div className="relative z-10 text-8xl md:text-9xl font-bold text-primary tracking-tight">
            4
            <motion.span
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mx-2"
            >
              <Bot className="w-16 h-16 md:w-20 md:h-20 text-primary" />
            </motion.span>
            4
          </div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 800),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 600),
                opacity: 0,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {i % 3 === 0 && <Heart className="w-4 h-4 text-primary/30" />}
              {i % 3 === 1 && <Sparkles className="w-4 h-4 text-primary/30" />}
              {i % 3 === 2 && (
                <MessageCircle className="w-4 h-4 text-primary/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Looks like this page wandered off to chat with another AI. Let's
              get you back to your companion!
            </p>
          </div>

          {/* Fun message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Bot className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground mb-1">
                      Your AI Companion says:
                    </p>
                    "I searched through all my memories, but I couldn't find
                    this page anywhere. How about we create some new memories
                    together instead?"
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Link href="/chat/simplified">
              <MessageCircle className="w-4 h-4" />
              Back to Chat
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Footer suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="pt-8 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Popular destinations:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/settings">Settings</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/memories">Memories</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/onboarding/simplified">Setup</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </motion.div>

        {/* Fun easter egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="pt-4"
        >
          <p className="text-xs text-muted-foreground/60">
            Error 404: Companion not found. But you found something even better
            – a beautiful error page! ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}
