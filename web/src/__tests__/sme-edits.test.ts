/* ------------------------------------------------------------------
   SME edits store contract.

   Locks the surface the Adept workbench depends on:
     - read/write round-trip through localStorage
     - tolerant of malformed storage
     - upsert / approve / reject / revert flip status correctly
     - approval metadata is wiped when status drops below approved
     - deploy stamps the pack with name + ISO timestamp
     - computeApprovalStats counts every status correctly
     - "ready to deploy" requires ≥1 approved + 0 edited
     - useSyncExternalStore server snapshot is referentially stable
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  _resetAllSMEStoresForTests,
  computeApprovalStats,
  emptyEdits,
  getSMEStore,
  readEdits,
  reviewHintsForConcept,
  smeEditsStorageKey,
  writeEdits,
  type SMEEdits,
} from "@/lib/sme-edits";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  key(i: number): string | null {
    return Array.from(this.map.keys())[i] ?? null;
  }
  getItem(k: string): string | null {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, v);
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
  clear(): void {
    this.map.clear();
  }
}

const PACK_ID = "acme-onboarding";

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: new MemoryStorage(),
  };
  _resetAllSMEStoresForTests();
});

afterEach(() => {
  _resetAllSMEStoresForTests();
});

describe("smeEditsStorageKey", () => {
  it("namespaces by packId + version", () => {
    expect(smeEditsStorageKey(PACK_ID)).toBe(
      "adept:sme-edits:acme-onboarding:v1"
    );
    expect(smeEditsStorageKey("other-pack")).toBe(
      "adept:sme-edits:other-pack:v1"
    );
  });
});

describe("readEdits / writeEdits round-trip", () => {
  it("returns emptyEdits for missing key", () => {
    expect(readEdits(PACK_ID)).toEqual(emptyEdits());
  });

  it("round-trips a populated edits object", () => {
    const eds: SMEEdits = {
      smeName: "Anita",
      concepts: { c1: { status: "edited", title: "New" } },
      newConcepts: {},
      deployedAt: "2026-05-11T00:00:00.000Z",
      deployedBy: "Anita",
    };
    writeEdits(PACK_ID, eds);
    expect(readEdits(PACK_ID)).toEqual(eds);
  });

  it("tolerates malformed JSON without throwing", () => {
    window.localStorage.setItem(smeEditsStorageKey(PACK_ID), "not json {");
    expect(readEdits(PACK_ID)).toEqual(emptyEdits());
  });

  it("drops non-overlay garbage from concepts on read", () => {
    window.localStorage.setItem(
      smeEditsStorageKey(PACK_ID),
      JSON.stringify({
        concepts: {
          good: { status: "approved" },
          // Missing status: dropped on read.
          bad: { title: "no status" },
          // Wrong status value: dropped.
          worse: { status: "garbage" },
        },
      })
    );
    const out = readEdits(PACK_ID);
    expect(Object.keys(out.concepts)).toEqual(["good"]);
  });
});

describe("getSMEStore — mutation API", () => {
  it("setName persists the SME identity", () => {
    const store = getSMEStore(PACK_ID);
    store.setName("Anita Singh");
    expect(store.get().smeName).toBe("Anita Singh");
    expect(readEdits(PACK_ID).smeName).toBe("Anita Singh");
  });

  it("upsertConcept moves draft → edited", () => {
    const store = getSMEStore(PACK_ID);
    store.upsertConcept("c1", { title: "Edited title" });
    expect(store.get().concepts.c1.status).toBe("edited");
    expect(store.get().concepts.c1.title).toBe("Edited title");
  });

  it("upsertConcept on an approved concept drops it back to edited + wipes approval metadata", () => {
    const store = getSMEStore(PACK_ID);
    store.approveConcept("c1", "Anita");
    expect(store.get().concepts.c1.status).toBe("approved");
    expect(store.get().concepts.c1.approvedBy).toBe("Anita");
    store.upsertConcept("c1", { title: "Changed after approval" });
    expect(store.get().concepts.c1.status).toBe("edited");
    expect(store.get().concepts.c1.approvedBy).toBeUndefined();
    expect(store.get().concepts.c1.approvedAt).toBeUndefined();
  });

  it("approveConcept sets status approved + name + timestamp", () => {
    const store = getSMEStore(PACK_ID);
    store.approveConcept("c1", "Anita");
    const c = store.get().concepts.c1;
    expect(c.status).toBe("approved");
    expect(c.approvedBy).toBe("Anita");
    expect(c.approvedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("rejectConcept stamps rejection + reason", () => {
    const store = getSMEStore(PACK_ID);
    store.rejectConcept("c1", "Anita", "Inaccurate timeline");
    const c = store.get().concepts.c1;
    expect(c.status).toBe("rejected");
    expect(c.rejectedReason).toBe("Inaccurate timeline");
    expect(c.rejectedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("revertConcept removes the overlay entirely", () => {
    const store = getSMEStore(PACK_ID);
    store.approveConcept("c1", "Anita");
    store.revertConcept("c1");
    expect(store.get().concepts.c1).toBeUndefined();
  });

  it("addNewConcept appends to the section bucket", () => {
    const store = getSMEStore(PACK_ID);
    store.addNewConcept("s1", {
      id: "sme-1",
      title: "Escalation paths",
      paragraphs: ["When in doubt, escalate."],
      status: "draft",
    });
    store.addNewConcept("s1", {
      id: "sme-2",
      title: "Another",
      paragraphs: [],
      status: "draft",
    });
    expect(store.get().newConcepts.s1).toHaveLength(2);
    expect(store.get().newConcepts.s1.map((c) => c.title)).toEqual([
      "Escalation paths",
      "Another",
    ]);
  });

  it("deploy stamps deployedBy + deployedAt", () => {
    const store = getSMEStore(PACK_ID);
    store.deploy("Anita");
    const eds = store.get();
    expect(eds.deployedBy).toBe("Anita");
    expect(eds.deployedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("emits change to subscribers on every mutation", () => {
    const store = getSMEStore(PACK_ID);
    let calls = 0;
    const unsub = store.subscribe(() => calls++);
    store.setName("A");
    store.upsertConcept("c1", { title: "X" });
    store.approveConcept("c1", "A");
    store.deploy("A");
    unsub();
    expect(calls).toBe(4);
  });

  it("getServerSnapshot is empty + referentially stable", () => {
    const store = getSMEStore(PACK_ID);
    const snap = store.getServerSnapshot();
    expect(snap.concepts).toEqual({});
    expect(snap.newConcepts).toEqual({});
    expect(store.getServerSnapshot()).toBe(snap);
  });
});

describe("computeApprovalStats", () => {
  it("counts every status correctly", () => {
    const eds: SMEEdits = {
      ...emptyEdits(),
      concepts: {
        a: { status: "approved" },
        b: { status: "approved" },
        c: { status: "edited" },
        d: { status: "rejected" },
        // e missing → draft
      },
    };
    const stats = computeApprovalStats(["a", "b", "c", "d", "e"], eds);
    expect(stats).toEqual({
      total: 5,
      approved: 2,
      edited: 1,
      draft: 1,
      rejected: 1,
      readyToDeploy: false,
    });
  });

  it("readyToDeploy is true only with ≥1 approved + 0 edited", () => {
    expect(
      computeApprovalStats(["a"], {
        ...emptyEdits(),
        concepts: { a: { status: "approved" } },
      }).readyToDeploy
    ).toBe(true);
    expect(
      computeApprovalStats(["a", "b"], {
        ...emptyEdits(),
        concepts: {
          a: { status: "approved" },
          b: { status: "edited" },
        },
      }).readyToDeploy
    ).toBe(false);
    expect(
      computeApprovalStats(["a"], emptyEdits()).readyToDeploy
    ).toBe(false);
  });
});

describe("approval chain mutations", () => {
  it("signReviewLevel records signer + timestamp per role", () => {
    const store = getSMEStore(PACK_ID);
    store.signReviewLevel("sme", "Anita");
    let levels = store.get().reviewLevels ?? [];
    expect(levels).toHaveLength(1);
    expect(levels[0].role).toBe("sme");
    expect(levels[0].signedBy).toBe("Anita");
    expect(typeof levels[0].signedAt).toBe("string");

    store.signReviewLevel("ld-lead", "Ravi");
    levels = store.get().reviewLevels ?? [];
    expect(levels.map((l) => l.role).sort()).toEqual(["ld-lead", "sme"]);
  });

  it("re-signing a role replaces the previous signature", () => {
    const store = getSMEStore(PACK_ID);
    store.signReviewLevel("sme", "Anita");
    store.signReviewLevel("sme", "Priya");
    const levels = store.get().reviewLevels ?? [];
    expect(levels).toHaveLength(1);
    expect(levels[0].signedBy).toBe("Priya");
  });

  it("unsignReviewLevel removes one role and leaves others", () => {
    const store = getSMEStore(PACK_ID);
    store.signReviewLevel("sme", "Anita");
    store.signReviewLevel("compliance", "Helga");
    store.unsignReviewLevel("sme");
    const levels = store.get().reviewLevels ?? [];
    expect(levels.map((l) => l.role)).toEqual(["compliance"]);
  });

  it("deploy clears all previous signatures (fail-closed audit)", () => {
    const store = getSMEStore(PACK_ID);
    store.signReviewLevel("sme", "Anita");
    store.signReviewLevel("ld-lead", "Ravi");
    store.deploy("Anita");
    expect(store.get().reviewLevels ?? []).toEqual([]);
  });
});

describe("lifecycle: liveSince + expiresAt + expiryDays", () => {
  it("deploy stamps liveSince === deployedAt", () => {
    const store = getSMEStore(PACK_ID);
    store.deploy("Anita");
    const eds = store.get();
    expect(eds.liveSince).toBe(eds.deployedAt);
  });

  it("deploy computes expiresAt when expiryDays is set", () => {
    const store = getSMEStore(PACK_ID);
    store.setExpiryDays(365);
    store.deploy("Anita");
    const eds = store.get();
    const live = new Date(eds.liveSince!);
    const exp = new Date(eds.expiresAt!);
    const days = Math.round(
      (exp.getTime() - live.getTime()) / (24 * 60 * 60 * 1000)
    );
    expect(days).toBe(365);
  });

  it("setExpiryDays(undefined) clears expiresAt", () => {
    const store = getSMEStore(PACK_ID);
    store.setExpiryDays(365);
    store.deploy("Anita");
    expect(store.get().expiresAt).toBeTruthy();
    store.setExpiryDays(undefined);
    expect(store.get().expiresAt).toBeUndefined();
    expect(store.get().expiryDays).toBeUndefined();
  });

  it("setExpiryDays updates expiresAt immediately when already live", () => {
    const store = getSMEStore(PACK_ID);
    store.deploy("Anita");
    store.setExpiryDays(90);
    const eds = store.get();
    const live = new Date(eds.liveSince!);
    const exp = new Date(eds.expiresAt!);
    const days = Math.round(
      (exp.getTime() - live.getTime()) / (24 * 60 * 60 * 1000)
    );
    expect(days).toBe(90);
  });
});

describe("source documents", () => {
  it("addSource appends a record, removeSource drops it", () => {
    const store = getSMEStore(PACK_ID);
    store.addSource({
      id: "s1",
      name: "Refund policy v3",
      audience: "L1 support",
      addedAt: "2026-05-11T00:00:00.000Z",
    });
    store.addSource({
      id: "s2",
      name: "Org map",
      audience: "Everyone",
      addedAt: "2026-05-11T00:00:01.000Z",
    });
    expect((store.get().sources ?? []).map((s) => s.id)).toEqual(["s1", "s2"]);
    store.removeSource("s1");
    expect((store.get().sources ?? []).map((s) => s.id)).toEqual(["s2"]);
  });

  it("round-trips through storage including audience + notes", () => {
    const store = getSMEStore(PACK_ID);
    store.addSource({
      id: "s1",
      name: "Policy",
      audience: "Compliance team",
      notes: "rev 2026-04-17",
      addedAt: "2026-05-11T00:00:00.000Z",
      addedBy: "Anita",
    });
    const reloaded = readEdits(PACK_ID);
    expect(reloaded.sources).toEqual([
      {
        id: "s1",
        name: "Policy",
        audience: "Compliance team",
        notes: "rev 2026-04-17",
        addedAt: "2026-05-11T00:00:00.000Z",
        addedBy: "Anita",
      },
    ]);
  });

  it("drops malformed sources on read", () => {
    window.localStorage.setItem(
      smeEditsStorageKey(PACK_ID),
      JSON.stringify({
        concepts: {},
        newConcepts: {},
        sources: [
          { id: "ok", name: "fine", audience: "y", addedAt: "2026-01-01" },
          { name: "missing-id", audience: "x", addedAt: "2026-01-01" },
          { id: "no-audience", name: "x", addedAt: "2026-01-01" },
          "garbage",
          null,
        ],
      })
    );
    expect(readEdits(PACK_ID).sources?.map((s) => s.id)).toEqual(["ok"]);
  });
});

describe("reviewHintsForConcept", () => {
  it("flags a short lesson body", () => {
    const hints = reviewHintsForConcept({
      title: "t",
      lesson: { paragraphs: ["short"] },
      quiz: { questions: [{ kind: "mcq" }, { kind: "mcq" }] },
    });
    expect(hints.map((h) => h.label)).toContain("Lesson body is short");
  });

  it("flags a long lesson body", () => {
    const long = "x".repeat(2000);
    const hints = reviewHintsForConcept({
      title: "t",
      lesson: { paragraphs: [long] },
      quiz: { questions: [{ kind: "mcq" }, { kind: "mcq" }] },
    });
    expect(hints.map((h) => h.label)).toContain("Lesson body is long");
  });

  it("flags missing one-liner + a single quiz question", () => {
    const hints = reviewHintsForConcept({
      title: "t",
      lesson: { paragraphs: ["a".repeat(400)] },
      quiz: { questions: [{ kind: "mcq" }] },
    });
    expect(hints.map((h) => h.label)).toContain("No one-line summary");
    expect(hints.map((h) => h.label)).toContain("Only one quiz question");
  });

  it("always emits the 'Verify against source' anchor", () => {
    const hints = reviewHintsForConcept({
      title: "t",
      lesson: {
        paragraphs: ["a".repeat(800)],
        simplified: { oneLiner: "summary" },
      },
      quiz: { questions: [{ kind: "mcq" }, { kind: "mcq" }] },
    });
    expect(hints.map((h) => h.label)).toContain("Verify against source");
  });
});
