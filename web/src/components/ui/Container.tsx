import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerWidth = "narrow" | "prose" | "wide" | "widest";

const widthClasses: Record<ContainerWidth, string> = {
  // Single-purpose focus column — quiz / question-per-screen.
  narrow: "max-w-2xl",
  // Reading column — lessons, section detail (default; matches legacy max-w-3xl).
  prose: "max-w-3xl",
  // Dashboard with grid + optional aside on lg.
  wide: "max-w-3xl lg:max-w-5xl",
  // Lesson with TOC rail at xl.
  widest: "max-w-3xl lg:max-w-5xl xl:max-w-6xl",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: "div" | "section" | "article" | "main";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    { width = "prose", as: Tag = "div", className, ...props },
    ref
  ) {
    return (
      <Tag
        ref={ref as never}
        className={cn("mx-auto w-full", widthClasses[width], className)}
        {...props}
      />
    );
  }
);
