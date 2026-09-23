#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/../common.sh"

LIBS=(
  "feedsmith *=bun run --cwd $SCRIPT_DIR/../.. $SCRIPT_DIR/parsing-feedsmith.ts"
  "feedjira (ruby)=ruby $SCRIPT_DIR/parsing-feedjira.rb"
  "feedparser (python)=$SCRIPT_DIR/.venv/bin/python3 $SCRIPT_DIR/parsing-feedparser.py"
  "gofeed (go)=$SCRIPT_DIR/parsing-gofeed"
  "simplepie (php)=php $SCRIPT_DIR/parsing-simplepie.php"
)

run_benchmark "rss-big" "rss" "10" "RSS feed parsing (10 files × 5MB–50MB)" "${LIBS[@]}"
run_benchmark "rss-small" "rss" "100" "RSS feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark "atom-big" "atom" "10" "Atom feed parsing (10 files × 5MB–50MB)" "${LIBS[@]}"
run_benchmark "atom-small" "atom" "100" "Atom feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
run_benchmark "rdf" "rdf" "100" "RDF feed parsing (100 files × 100KB–5MB)" "${LIBS[@]}"
