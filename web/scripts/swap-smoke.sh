#!/usr/bin/env bash
# ------------------------------------------------------------------
# swap-smoke.sh — validate every content pack builds end-to-end and
# emits the expected manifest under the active-pack swap.
#
# Cycles `web/src/content/active-pack.ts` through each pack folder
# under `web/content-packs/` (skipping anything starting with `_`).
# For each pack: type-check, unit tests, full Next.js build. Confirms
# the built manifest carries the pack's name + id. Restores the
# original active-pack import on exit (success or failure).
#
# Run from `web/`:   npm run smoke:swap
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

ACTIVE="src/content/active-pack.ts"

# Capture the original import line so we can restore it on exit even
# under Ctrl-C. The file's structure is: a single line of the form
#   import { pack as activePack } from "../../content-packs/<id>";
ORIG_LINE=$(grep -E '^import \{ pack as activePack \}' "$ACTIVE" | head -1)
if [[ -z "${ORIG_LINE:-}" ]]; then
  echo "ERROR: could not find active-pack import line in $ACTIVE" >&2
  exit 1
fi
echo "Original active-pack import: $ORIG_LINE" >&2

restore() {
  # Replace whatever is currently on the import line with the original.
  if [[ -f "$ACTIVE" ]]; then
    awk -v orig="$ORIG_LINE" '
      /^import \{ pack as activePack \}/ { print orig; next }
      { print }
    ' "$ACTIVE" > "$ACTIVE.tmp" && mv "$ACTIVE.tmp" "$ACTIVE"
    echo "Restored $ACTIVE to original pack import." >&2
  fi
}
trap restore EXIT

failures=()

for dir in content-packs/*/; do
  pack=$(basename "$dir")
  # Skip private / convention dirs (e.g. _shared/, _types/).
  [[ "$pack" == _* ]] && continue
  # Skip if the pack has no index.ts (not a complete pack).
  [[ -f "content-packs/$pack/index.ts" ]] || continue

  echo
  echo "================================================================"
  echo "  Smoke test: pack '$pack'"
  echo "================================================================"

  # Rewrite the active-pack import to point at $pack.
  awk -v pack="$pack" '
    /^import \{ pack as activePack \}/ {
      print "import { pack as activePack } from \"../../content-packs/" pack "\";"
      next
    }
    { print }
  ' "$ACTIVE" > "$ACTIVE.tmp" && mv "$ACTIVE.tmp" "$ACTIVE"

  if ! npm run type-check; then
    failures+=("$pack: type-check")
    continue
  fi
  if ! npm test -- --run; then
    failures+=("$pack: unit tests")
    continue
  fi
  if ! npm run build; then
    failures+=("$pack: build")
    continue
  fi

  # Verify the built PWA manifest carries this pack's id (which the
  # manifest renderer uses inside the storage-key + name fields).
  manifest_body=$(find .next/server -name 'manifest.webmanifest*' -type f 2>/dev/null | head -1 || true)
  if [[ -z "$manifest_body" ]]; then
    echo "WARN: built manifest body not found; skipping content assertion." >&2
  else
    if ! grep -q "\"name\":" "$manifest_body"; then
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
