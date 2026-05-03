import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas)",
  {
    variants: {
      variant: {
        default:
          "border border-(--accent) bg-(--accent) text-white hover:bg-(--accent-2) hover:border-(--accent-2)",
        secondary:
          "border border-(--border) bg-(--panel-2) text-(--ink) hover:border-(--accent)",
        ghost:
          "border border-transparent bg-transparent text-(--ink) hover:border-(--border) hover:bg-(--panel-2)",
        link: "border-0 bg-transparent text-(--accent-2) underline-offset-4 hover:underline px-0 py-0",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

export { buttonVariants };
