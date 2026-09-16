#!/bin/bash
# Syncs homepage-next's static export into site/, the actual Vercel deploy
# root. Clears every path Next's out/ owns first (so stale fingerprinted
# _next/ chunks and removed routes don't accumulate), without touching
# hand-authored content that lives in site/ alongside it: blog/, glossary/,
# dashboard/, depin/, funding/, assets/, robots.txt, llms.txt, sitemap.xml,
# the real favicons, README.md, vercel.json, .gitignore, .vercel/.
set -euo pipefail

cd "$(dirname "$0")"
OUT_DIR="homepage-next/out"
SITE_DIR="site"

if [ ! -d "$OUT_DIR" ]; then
  echo "error: $OUT_DIR does not exist -- run 'npm run build' in homepage-next/ first" >&2
  exit 1
fi

# Remove every top-level path that Next's out/ owns, if present in site/,
# before copying -- this is what actually prevents stale-chunk buildup.
for entry in "$OUT_DIR"/*; do
  name="$(basename "$entry")"
  rm -rf "${SITE_DIR:?}/${name:?}"
done

cp -r "$OUT_DIR"/. "$SITE_DIR"/
echo "synced $(find "$OUT_DIR" -maxdepth 1 | wc -l | tr -d ' ') top-level paths from $OUT_DIR into $SITE_DIR"
