"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton Loading Components
 *
 * Based on best practices from LogRocket's skeleton loading guide:
 * - Maintains consistent layout with final content
 * - Uses shimmer animation to indicate ongoing activity
 * - Provides visual preview of content structure
 */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/**
 * Shimmer effect skeleton with wave animation
 */
function ShimmerSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />
    </div>
  );
}

/**
 * Pulsating skeleton for more subtle loading indication
 */
function PulseSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[pulse_1.5s_ease-in-out_infinite] rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton, ShimmerSkeleton, PulseSkeleton };
