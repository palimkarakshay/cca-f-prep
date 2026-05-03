import * as React from "react";
import { cn } from "@/lib/utils";

export type CardTone = "default" | "accent" | "good" | "warn" | "bad";

const toneClasses: Record<CardTone, string> = {
  default: "border-(--border)",
  accent: "border-(--border) border-l-4 border-l-(--accent)",
  good: "border-(--border) border-l-4 border-l-(--good)",
  warn: "border-(--border) border-l-4 border-l-(--warn)",
  bad: "border-(--border) border-l-4 border-l-(--bad)",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  /** Drop the default subtle shadow when nested inside another elevated surface. */
  flat?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card({ tone = "default", flat = false, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-(--panel) p-5",
          toneClasses[tone],
          !flat && "shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("mb-3 flex flex-col gap-1", className)} {...props} />;
  }
);

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h2
        ref={ref}
        className={cn("text-base font-semibold text-(--ink)", className)}
        {...props}
      />
    );
  }
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-sm text-(--muted)", className)} {...props} />;
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />;
  }
);

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-(--border) pt-3",
          className
        )}
        {...props}
      />
    );
  }
);
