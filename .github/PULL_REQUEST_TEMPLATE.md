<!-- Plan section reference (e.g., PR2.3 — Goals + Concepts panels). -->
## Plan ref
<!-- Link to the section of /root/.claude/plans/improve-visual-ux-aspect-elegant-hamming.md (or successor) this PR implements. -->


## Summary
<!-- 1–3 bullets. What changed and why. -->


## Done means
<!-- Verbatim "Done means" bullets from the plan section. Reviewer ticks each. -->
- [ ]
- [ ]
- [ ]


## Drift checklist (sober tone + pack-safety)
- [ ] No XP / level visuals introduced
- [ ] No leaderboards
- [ ] No confetti / mascots / "you're on fire!" copy
- [ ] Streaks shown as numeric chips only
- [ ] All new motion gated by `prefers-reduced-motion`
- [ ] Components under `ui/`, `primitives/`, `games/`, and the new `section/` panels do NOT import `@/content/curriculum*`, `@/content/section-meta`, `@/content/domain-map`, `@/content/domains`
- [ ] No raw `localStorage.setItem("<id>:progress:v1" | ":theme" | ":games:v1" | ":lesson-depth:v1", ...)` outside the typed stores in `lib/`
- [ ] Tap targets ≥ 44 px on mobile


## Test plan
- [ ] `cd web && npm run lint`
- [ ] `cd web && npm run type-check`
- [ ] `cd web && npm run test`
- [ ] `cd web && npm run build`
- [ ] `cd web && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:e2e`
- [ ] Manual smoke at the live preview URL


https://claude.ai/code/session_01NCHDDhAxrF6bonNg6UuqU8
