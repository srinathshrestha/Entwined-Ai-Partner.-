"use client";

import { ShimmerSkeleton, PulseSkeleton } from "@/components/ui/skeleton";

/**
 * Chat Message Skeleton Components
 *
 * These components provide visual placeholders while chat messages
 * are loading, improving perceived performance as outlined in the
 * LogRocket skeleton loading best practices.
 */

/**
 * Skeleton for user messages (right-aligned)
 */
export function UserMessageSkeleton() {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-xs lg:max-w-md">
        <div className="flex flex-col space-y-2">
          {/* Message bubble skeleton */}
          <ShimmerSkeleton className="h-12 w-48 rounded-2xl rounded-br-md bg-rose-100" />
          {/* Timestamp skeleton */}
          <ShimmerSkeleton className="h-3 w-16 self-end" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for AI assistant messages (left-aligned)
 */
export function AssistantMessageSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex space-x-3 max-w-xs lg:max-w-md">
        {/* Avatar skeleton */}
        <PulseSkeleton className="w-8 h-8 rounded-full flex-shrink-0" />

        <div className="flex flex-col space-y-2 flex-1">
          {/* Message content skeleton - multiple lines for longer responses */}
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-full rounded-2xl bg-muted" />
            <ShimmerSkeleton className="h-4 w-4/5 rounded-2xl bg-muted" />
            <ShimmerSkeleton className="h-4 w-3/4 rounded-2xl bg-muted" />
          </div>
          {/* Timestamp skeleton */}
          <ShimmerSkeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Typing indicator skeleton - shows when AI is actively generating response
 */
export function TypingIndicatorSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex space-x-3 max-w-xs lg:max-w-md">
        {/* Avatar skeleton */}
        <PulseSkeleton className="w-8 h-8 rounded-full flex-shrink-0" />

        <div className="bg-muted rounded-2xl rounded-bl-md p-4">
          <div className="flex space-x-1">
            {/* Animated dots for typing indicator */}
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for chat history
 */
export function ChatHistorySkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Mix of user and assistant message skeletons */}
      <AssistantMessageSkeleton />
      <UserMessageSkeleton />
      <AssistantMessageSkeleton />
      <UserMessageSkeleton />
      <AssistantMessageSkeleton />
    </div>
  );
}

/**
 * Skeleton for the chat header/companion info
 */
export function ChatHeaderSkeleton() {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Companion avatar skeleton */}
          <PulseSkeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            {/* Companion name skeleton */}
            <ShimmerSkeleton className="h-5 w-32" />
            {/* Status skeleton */}
            <ShimmerSkeleton className="h-3 w-16" />
          </div>
        </div>
        {/* Settings button skeleton */}
        <PulseSkeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Comprehensive chat page skeleton
 */
export function ChatPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Header skeleton */}
      <ChatHeaderSkeleton />

      {/* Messages skeleton */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] overflow-y-auto">
        <ChatHistorySkeleton />
      </div>

      {/* Input area skeleton */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto flex items-end space-x-2">
          <ShimmerSkeleton className="flex-1 h-11 rounded-2xl" />
          <PulseSkeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
