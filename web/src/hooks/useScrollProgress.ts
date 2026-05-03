"use client";

import { useEffect, useState } from "react";

/**
 * Returns the document scroll progress as a percentage (0-100). Updates
 * via passive scroll + resize listeners. Decorative — do not surface to
 * assistive tech (use aria-hidden on the visual progress element).
 */
export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function compute() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) {
        setPct(0);
        return;
      }
      const next = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
      setPct(next);
    }
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return pct;
}
