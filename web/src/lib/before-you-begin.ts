/* ------------------------------------------------------------------
   Before-you-begin self-check store — pack-aware.

   Tracks which prerequisite items the learner has self-checked and
   whether the card is in expanded or collapsed state. Storage shape:

     <pack-id>:before-you-begin:v1
       → { items: Record<string, boolean>, open: boolean, dismissed: boolean }

   Implementation: delegates to a `local-only` StorageDriver per
   pack id. Public API is unchanged from the pre-driver
   implementation.
------------------------------------------------------------------ */

import type { StorageDriver } from "./storage/driver";
import { createLocalDriver } from "./storage/local-driver";

export interface BeforeYouBeginState {
  items: Record<string, boolean>;
  open: boolean;
  /**
   * True once the learner has manually dismissed the card after
   * completing the self-check. When set, the card renders as a
   * compact one-line summary instead of the full panel, but the
   * learner can still re-expand it to see what they ticked.
   */
  dismissed: boolean;
}

const DEFAULT_STATE: BeforeYouBeginState = {
  items: {},
  open: true,
  dismissed: false,
};

function storageKey(packId: string): string {
  return `${packId}:before-you-begin:v1`;
}

function sanitize(raw: unknown): BeforeYouBeginState {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_STATE };
  const obj = raw as Partial<BeforeYouBeginState>;
  return {
    items:
      obj.items && typeof obj.items === "object"
        ? (obj.items as Record<string, boolean>)
        : {},
    open: typeof obj.open === "boolean" ? obj.open : true,
    dismissed: typeof obj.dismissed === "boolean" ? obj.dismissed : false,
  };
}

const drivers = new Map<string, StorageDriver<BeforeYouBeginState>>();
const listeners = new Set<() => void>();

function driverFor(packId: string): StorageDriver<BeforeYouBeginState> {
  let d = drivers.get(packId);
  if (!d) {
    d = createLocalDriver<BeforeYouBeginState>({
      storageKey: storageKey(packId),
      initial: () => ({ ...DEFAULT_STATE }),
      sanitize,
    });
    // Bubble per-pack driver notifications up to the global
    // subscribers — consumers subscribe once for any pack.
    d.subscribe(notify);
    drivers.set(packId, d);
  }
  return d;
}

function notify(): void {
  for (const l of listeners) l();
}

export function getBeforeYouBeginState(packId: string): BeforeYouBeginState {
  return driverFor(packId).getSnapshot();
}

export function toggleBeforeYouBeginItem(
  packId: string,
  key: string
): void {
  const d = driverFor(packId);
  const current = d.getSnapshot();
  d.setSnapshot({
    open: current.open,
    dismissed: current.dismissed,
    items: { ...current.items, [key]: !current.items[key] },
  });
}

export function setBeforeYouBeginOpen(packId: string, open: boolean): void {
  const d = driverFor(packId);
  const current = d.getSnapshot();
  d.setSnapshot({
    items: current.items,
    dismissed: current.dismissed,
    open,
  });
}

export function setBeforeYouBeginDismissed(
  packId: string,
  dismissed: boolean
): void {
  const d = driverFor(packId);
  const current = d.getSnapshot();
  d.setSnapshot({
    items: current.items,
    open: dismissed ? false : current.open,
    dismissed,
  });
}

export function subscribeBeforeYouBegin(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getServerSnapshot(): BeforeYouBeginState {
  return DEFAULT_STATE;
}
