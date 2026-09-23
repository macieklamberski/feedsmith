#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNNER="$SCRIPT_DIR/runner.ts"

source "$SCRIPT_DIR/../common.sh"

# Libraries that parse RSS/Atom/RDF feeds, in the same order as the previous benchmark.
RSS_LIBS=(
  "rss-parser=bun $RUNNER rss-parser"
  "@gaphub/feed=bun $RUNNER @gaphub/feed"
  "@rowanmanning/feed-parser=bun $RUNNER @rowanmanning/feed-parser"
  "feedme.js=bun $RUNNER feedme"
  "@extractus/feed-extractor=bun $RUNNER @extractus/feed-extractor"
  "@ulisesgascon/rss-feed-parser=bun $RUNNER @ulisesgascon/rss-feed-parser"
  "feedparser=bun $RUNNER feedparser"
  "podcast-feed-parser=bun $RUNNER podcast-feed-parser"
  "feedsmith *=bun $RUNNER feedsmith"
)

# Atom and RDF: @ulisesgascon/rss-feed-parser and podcast-feed-parser do not support them.
ATOM_LIBS=(
  "rss-parser=bun $RUNNER rss-parser"
  "@gaphub/feed=bun $RUNNER @gaphub/feed"
  "@rowanmanning/feed-parser=bun $RUNNER @rowanmanning/feed-parser"
  "feedme.js=bun $RUNNER feedme"
  "@extractus/feed-extractor=bun $RUNNER @extractus/feed-extractor"
  "feedparser=bun $RUNNER feedparser"
  "feedsmith *=bun $RUNNER feedsmith"
)

OPML_LIBS=(
  "@gaphub/feed=bun $RUNNER @gaphub/feed"
  "node-opml-parser=bun $RUNNER node-opml-parser"
  "opml-to-json=bun $RUNNER opml-to-json"
  "opml=bun $RUNNER opml"
  "opmlparser=bun $RUNNER opmlparser"
  "feedsmith *=bun $RUNNER feedsmith"
)

run_benchmark ms "rss-big" "rss" "10" "RSS feed parsing (10 files × 5MB–50MB)" "${RSS_LIBS[@]}"
run_benchmark ms "rss-small" "rss" "100" "RSS feed parsing (100 files × 100KB–5MB)" "${RSS_LIBS[@]}"
run_benchmark ms "atom-big" "atom" "10" "Atom feed parsing (10 files × 5MB–50MB)" "${ATOM_LIBS[@]}"
run_benchmark ms "atom-small" "atom" "100" "Atom feed parsing (100 files × 100KB–5MB)" "${ATOM_LIBS[@]}"
run_benchmark ms "rdf" "rdf" "100" "RDF feed parsing (100 files × 100KB–5MB)" "${ATOM_LIBS[@]}"
run_benchmark ms "opml" "opml" "100" "OPML parsing (100 files × 100KB–500KB)" "${OPML_LIBS[@]}"

# JSON Feed: only feedsmith is benchmarked (other parsers do not support the format), so
# this reports an absolute timing rather than a comparison.
run_benchmark ms "json" "json" "100" "JSON feed parsing (100 files × 100KB–5MB)" "feedsmith *=bun $RUNNER feedsmith"
