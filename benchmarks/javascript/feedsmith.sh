#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILES_DIR="$SCRIPT_DIR/../files"
RUNNER="$SCRIPT_DIR/runner.ts"

# Compares the local feedsmith source against the published release for one fixture
# directory. `limit` caps the number of files (empty means all).
run_benchmark() {
  local feed_dir=$1
  local feed_format=$2
  local limit=$3
  local description=$4

  echo ""
  echo "⏳ Running: $description"

  hyperfine --warmup 3 --min-runs 10 \
    --command-name 'feedsmith (released)' "bun $RUNNER feedsmith-released $FILES_DIR/$feed_dir $feed_format $limit" \
    --command-name 'feedsmith (local)' "bun $RUNNER feedsmith $FILES_DIR/$feed_dir $feed_format $limit"
}

run_benchmark "rss-small" "rss" "" "RSS feed parsing (100 files × 100KB–5MB)"
run_benchmark "rss-big" "rss" "10" "RSS feed parsing (10 files × 5MB–50MB)"
run_benchmark "atom-small" "atom" "" "Atom feed parsing (100 files × 100KB–5MB)"
run_benchmark "atom-big" "atom" "10" "Atom feed parsing (10 files × 5MB–50MB)"
run_benchmark "rdf" "rdf" "" "RDF feed parsing (97 files × 100KB–5MB)"
run_benchmark "json" "json" "" "JSON feed parsing (32 files × 100KB–5MB)"
run_benchmark "opml" "opml" "" "OPML parsing (50 files × 100KB–500KB)"
