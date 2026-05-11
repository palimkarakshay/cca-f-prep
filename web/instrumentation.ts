/* ------------------------------------------------------------------
   Next.js instrumentation entry point.

   `register()` is invoked once per server runtime at boot
   (https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation).
   We use it only to call `initObservability()`, which itself
   no-ops until NEXT_PUBLIC_SENTRY_DSN is set and the Sentry SDK
   is installed (v0.1).

   Keeping this file at the project root (next to next.config.ts)
   is the convention for `src/`-based projects per the Next 16
   docs.
------------------------------------------------------------------ */

import { initObservability } from "./src/lib/observability";

export function register(): void {
  initObservability();
}
