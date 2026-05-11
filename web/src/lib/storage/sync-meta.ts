/* ------------------------------------------------------------------
   Sync metadata — forward-compat type for the server-sync driver.

   Today's `local-only` driver does not use these fields. They are
   documented here so the future `local-first-server-sync` and
   `server-of-record` drivers (per plans/v2-scaled-b2b-plan.md §5–6)
   land with a stable shape, and so consumers writing migration
   shims can rely on the fields existing.

   The fields are deliberately optional so adding them to any
   store's payload type is a non-breaking change today (the
   `local-only` driver simply round-trips them as `undefined`).
------------------------------------------------------------------ */

export interface SyncMeta {
  /**
   * ISO-8601 timestamp of the last successful server sync. Absent
   * means the row has never been pushed (or has been mutated
   * locally since the last push).
   */
  serverSyncedAt?: string;

  /**
   * Tenant the row is scoped to. Always set for server-stored rows
   * once Phase 2 multi-tenancy lands. Left `undefined` for personal
   * accounts and for any pre-tenant local row.
   */
  tenantId?: string;

  /**
   * When the local cache was last fetched from the server. Drives
   * stale-while-revalidate logic in the future server-sync driver.
   */
  lastFetchedAt?: string;
}

/**
 * Helper for store payload types that want to opt into the sync
 * metadata shape without rewriting their structure.
 *
 *   interface LearningGoal extends WithSyncMeta { ... }
 *
 * Mixing in a `_sync` block keeps the metadata out of the way of
 * the business fields, so existing code that destructures the
 * payload doesn't have to ignore unfamiliar properties.
 */
export interface WithSyncMeta {
  _sync?: SyncMeta;
}
