#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNNER="$SCRIPT_DIR/runner.ts"

source "$SCRIPT_DIR/../common.sh"

# Compares the local feedsmith source against the published release.
LIBS=(
  "feedsmith (released)=bun $RUNNER feedsmith-released"
  "feedsmith (local)=bun $RUNNER feedsmith"
)

run_benchmark ms "rss-big" "rss" "10" "RSS feed parsing (10 files × 5MB–50MB)" "${LIBS[@]}"
run_benchmark ms "rss-small" "rss" "100" "RSS feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark ms "atom-big" "atom" "10" "Atom feed parsing (10 files × 5MB–50MB)" "${LIBS[@]}"
run_benchmark ms "atom-small" "atom" "100" "Atom feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark ms "rdf" "rdf" "100" "RDF feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark ms "json" "json" "100" "JSON feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark ms "opml" "opml" "100" "OPML parsing (100 files × 100KB–500KB)" "${LIBS[@]}"
