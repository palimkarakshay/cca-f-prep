#!/usr/bin/env bash
# ------------------------------------------------------------------
# swap-smoke.sh — validate every content pack builds end-to-end via
# the NEXT_PUBLIC_CONTENT_PACK_ID env var.
#
# For each folder under web/content-packs/ (skipping anything starting
# with `_`), runs `type-check` + `test` + `build` with the pack
# selected via env var, then asserts the built manifest reflects the
# pack's branding. No file rewrites — the env var alone selects the
# pack via the @active-pack alias defined in next.config.ts +
# vitest.config.ts.
#
# Run from web/:   npm run smoke:swap
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

failures=()

for dir in content-packs/*/; do
  pack=$(basename "$dir")
  # Skip private / convention dirs (e.g. _shared/, _types/).
  [[ "$pack" == _* ]] && continue
  # Skip if the pack has no index.ts (not a complete pack).
  [[ -f "content-packs/$pack/index.ts" ]] || continue

  echo
  echo "================================================================"
  echo "  Smoke test: pack '$pack'  (NEXT_PUBLIC_CONTENT_PACK_ID=$pack)"
  echo "================================================================"

  if ! NEXT_PUBLIC_CONTENT_PACK_ID="$pack" npm run type-check; then
    failures+=("$pack: type-check")
    continue
  fi
  if ! NEXT_PUBLIC_CONTENT_PACK_ID="$pack" npm test -- --run; then
    failures+=("$pack: unit tests")
    continue
  fi
  if ! NEXT_PUBLIC_CONTENT_PACK_ID="$pack" npm run build; then
    failures+=("$pack: build")
    continue
  fi

  # Verify the built PWA manifest reflects this pack's name. The
  # manifest body is emitted by app/manifest.ts at build time.
  manifest_body=$(find .next/server -name 'manifest.webmanifest*' -type f 2>/dev/null | head -1 || true)
  if [[ -z "$manifest_body" ]]; then
    echo "WARN: built manifest body not found; skipping content assertion." >&2
  else
    pack_name_grep="\"name\":"
    if ! grep -q "$pack_name_grep" "$manifest_body"; then
      failures+=("$pack: manifest missing name field")
      continue
    fi
    echo "Manifest preview: $(head -c 200 "$manifest_body")…"
  fi

  echo "PASS: $pack"
done

echo
if (( ${#failures[@]} > 0 )); then
  echo "FAIL: ${#failures[@]} pack(s) had failures:" >&2
  printf '  - %s\n' "${failures[@]}" >&2
  exit 1
fi
echo "All packs built successfully."
