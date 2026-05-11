"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { brandForPath, roleForPath } from "@/lib/brand-route";

/**
 * Side-effect-only component that keeps `data-brand` and `data-role`
 * attributes on `<html>` in sync with the current route during SPA
 * navigation. Initial paint is handled by the inline init script in
 * `app/layout.tsx` so this only needs to run after Next's client
 * router updates the pathname.
 */
export function BrandSync() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.brand = brandForPath(pathname);
    root.dataset.role = roleForPath(pathname);
  }, [pathname]);
  return null;
}
