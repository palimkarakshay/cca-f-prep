import { cn } from "@/lib/utils";

/**
 * Decorative loading shimmer. The animation is automatically suspended
 * by the prefers-reduced-motion reset in globals.css. Always paired with
 * an aria-busy or aria-live region on the surrounding container so AT
 * users get a textual cue rather than perceiving an empty box.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-(--panel-2)",
        className
      )}
    />
  );
}
