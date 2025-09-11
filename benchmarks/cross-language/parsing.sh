#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILES_DIR="$SCRIPT_DIR/../files"

run_benchmark() {
  local feed_dir=$1
  local feed_format=$2
  local description=$3

  echo ""
  echo "⏳ Running: $description"

  hyperfine --warmup 3 --min-runs 10 \
    --command-name 'feedsmith *' "bun run --cwd $SCRIPT_DIR/../.. $SCRIPT_DIR/parsing-feedsmith.ts $FILES_DIR/$feed_dir $feed_format" \
    --command-name 'feedjira (ruby)' "ruby $SCRIPT_DIR/parsing-feedjira.rb $FILES_DIR/$feed_dir $feed_format" \
    --command-name 'feedparser (python)' "python3 $SCRIPT_DIR/parsing-feedparser.py $FILES_DIR/$feed_dir $feed_format" \
    --command-name 'gofeed (go)' "$SCRIPT_DIR/parsing-gofeed $FILES_DIR/$feed_dir $feed_format" \
    --command-name 'simplepie (php)' "php $SCRIPT_DIR/parsing-simplepie.php $FILES_DIR/$feed_dir $feed_format"
}

run_benchmark "rss-small" "rss" "RSS feed parsing (100 files × 100KB–5MB)"
run_benchmark "rss-big" "rss" "RSS feed parsing (10 files × 5MB–50MB)"
run_benchmark "atom-small" "atom" "Atom feed parsing (100 files × 100KB–5MB)"
run_benchmark "atom-big" "atom" "Atom feed parsing (10 files × 5MB–50MB)"
run_benchmark "rdf" "rdf" "RDF feed parsing (100 files × 100KB–5MB)"
