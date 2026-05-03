# 10 — Product strategy

Strategy notes about the cca-f-prep **product**, not the cca-f-prep
**content**. The 00–08 folders cover the CCA-F exam corpus; the `web/`
folder ships the swappable shell that runs it. This folder is for
analyses that span both: viability, packaging, B2B fit, content
operations, validation pipelines.

## What lives here

| File | What it is |
| --- | --- |
| [`b2b-viability-2026-05.md`](./b2b-viability-2026-05.md) | Viability writeup for the shell as a B2B learning tool across arbitrary topics. Five blockers (adoption, stickiness, SME extraction, freshness, validation) framed in change-management + behavioral-psych terms, mapped to concrete file-level interventions in this codebase. Includes Appendix A — a shippable SME extraction protocol. |

## Conventions

- **One file per analysis, dated.** Filenames carry an ISO-month suffix
  (`-YYYY-MM`) so older notes are obvious as they age.
- **Cite real files.** Every recommendation must point at a path in this
  repo, not a generic prescription. Strategy that can't be turned into a
  PR is not yet strategy.
- **Tag interventions S / M / L.** S = one PR, no backend. M = one
  sprint, may need a script or schema field. L = needs auth and/or
  backend.
- **Honest about what's not built.** No glossing over auth, tenancy,
  telemetry gaps. Capability claims must match
  [`web/`](../web/).

## Related

- [`web/content-packs/README.md`](../web/content-packs/README.md) —
  authoring and pack-swap reference.
- [`CLAUDE.md`](../CLAUDE.md) — repo-wide conventions, observed
  failure modes (`letter-bias-2026-05`, `diagnostic-01` spoiler
  regression), Coherency review log.
- [`00-academy-basics/`](../00-academy-basics/) — pedagogy framing
  (Knowles, Bloom, Cognitive Load, Bjork, Ericsson) the strategy notes
  draw on.
