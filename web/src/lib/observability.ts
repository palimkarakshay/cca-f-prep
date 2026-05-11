/* ------------------------------------------------------------------
   Observability shim — single seam for error capture + breadcrumbs.

   Today: every function below is a no-op. Production is
   pre-commercial; there is no user-facing error surface to
   monitor, and installing Sentry's full SDK now adds bundle
   weight without value.

   When v0.1 lands and a Sentry DSN is set, this file becomes the
   only place that imports @sentry/nextjs — call sites stay
   untouched. The "single seam" pattern mirrors the LLM router
   (src/lib/ai/router.ts) and the storage driver
   (src/lib/storage/driver.ts).

   Wire pattern:
     - On the server: `instrumentation.ts` calls `initObservability()`
       once at boot.
     - In a component: `captureException(err)` inside an error
       boundary; `addBreadcrumb({...})` for high-signal events.

   Without a DSN, every function silently no-ops — failures are
   still logged to console.error by the caller's own error
   handling, which is the right local-dev behaviour anyway.
------------------------------------------------------------------ */

export interface Breadcrumb {
  category: string;
  message: string;
  level?: "info" | "warn" | "error";
  data?: Record<string, unknown>;
}

let initialized = false;

export function initObservability(): void {
  if (initialized) return;
  initialized = true;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    // No DSN configured. Stay quiet — instrumenting console here
    // would spam every dev refresh.
    return;
  }

  // Sentry init lands when @sentry/nextjs is installed (v0.1 of
  // the roadmap). Keeping the conditional here so a `pnpm add
  // @sentry/nextjs` + an env var flip is enough to light it up.
  // Intentionally no dynamic import yet — the dependency isn't
  // pulled into node_modules and tsc would resolve it as missing.
  //
  // TODO(v0.1): swap to `(await import("@sentry/nextjs")).init({...})`.
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  // Pre-commercial: log to console so devs see it; once Sentry is
  // wired, forward to Sentry.captureException as well.
  if (typeof console !== "undefined") {
    console.error("[observability] captured", err, context);
  }
}

export function addBreadcrumb(crumb: Breadcrumb): void {
  // Pre-commercial: silent. When Sentry is wired the breadcrumb
  // joins the failure context that lands in the dashboard.
  void crumb;
}

/** Test-only — reset the initialised flag between cases. */
export function __resetObservabilityForTests(): void {
  initialized = false;
}
