#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILES_DIR="$SCRIPT_DIR/../files"
RUNNER="$SCRIPT_DIR/runner.ts"

# Runs one hyperfine comparison for a fixture directory. `limit` caps the number of files
# (empty means all). Each remaining argument is a "key:label" pair, where `key` is the
# runner identifier and `label` is the display name.
run_benchmark() {
  local feed_dir=$1
  local feed_format=$2
  local limit=$3
  local description=$4
  shift 4

  local args=()
  for entry in "$@"; do
    local key="${entry%%:*}"
    local label="${entry#*:}"
    args+=(--command-name "$label" "bun $RUNNER $key $FILES_DIR/$feed_dir $feed_format $limit")
  done

  echo ""
  echo "⏳ Running: $description"

  hyperfine --warmup 3 --min-runs 10 "${args[@]}"
}

# Libraries that parse RSS/Atom/RDF feeds, in the same order as the previous benchmark.
RSS_LIBS=(
  "rss-parser:rss-parser"
  "@gaphub/feed:@gaphub/feed"
  "@rowanmanning/feed-parser:@rowanmanning/feed-parser"
  "feedme:feedme.js"
  "@extractus/feed-extractor:@extractus/feed-extractor"
  "@ulisesgascon/rss-feed-parser:@ulisesgascon/rss-feed-parser"
  "feedparser:feedparser"
  "podcast-feed-parser:podcast-feed-parser"
  "feedsmith:feedsmith *"
)

# Atom and RDF: @ulisesgascon/rss-feed-parser and podcast-feed-parser do not support them.
ATOM_LIBS=(
  "rss-parser:rss-parser"
  "@gaphub/feed:@gaphub/feed"
  "@rowanmanning/feed-parser:@rowanmanning/feed-parser"
  "feedme:feedme.js"
  "@extractus/feed-extractor:@extractus/feed-extractor"
  "feedparser:feedparser"
  "feedsmith:feedsmith *"
)

OPML_LIBS=(
  "@gaphub/feed:@gaphub/feed"
  "node-opml-parser:node-opml-parser"
  "opml-to-json:opml-to-json"
  "opml:opml"
  "opmlparser:opmlparser"
  "feedsmith:feedsmith *"
)

run_benchmark "rss-small" "rss" "" "RSS feed parsing (100 files × 100KB–5MB)" "${RSS_LIBS[@]}"
run_benchmark "rss-big" "rss" "10" "RSS feed parsing (10 files × 5MB–50MB)" "${RSS_LIBS[@]}"
run_benchmark "atom-small" "atom" "" "Atom feed parsing (100 files × 100KB–5MB)" "${ATOM_LIBS[@]}"
run_benchmark "atom-big" "atom" "10" "Atom feed parsing (10 files × 5MB–50MB)" "${ATOM_LIBS[@]}"
run_benchmark "rdf" "rdf" "" "RDF feed parsing (97 files × 100KB–5MB)" "${ATOM_LIBS[@]}"
run_benchmark "opml" "opml" "" "OPML parsing (50 files × 100KB–500KB)" "${OPML_LIBS[@]}"

# JSON Feed: only feedsmith is benchmarked (other parsers do not support the format), so
# this reports an absolute timing rather than a comparison.
run_benchmark "json" "json" "" "JSON feed parsing (32 files × 100KB–5MB)" "feedsmith:feedsmith *"
