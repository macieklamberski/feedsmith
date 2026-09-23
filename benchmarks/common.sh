#!/bin/bash

COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILES_DIR="$COMMON_DIR/files"
TABULATE="$COMMON_DIR/tabulate.ts"

# Runs one hyperfine comparison over a fixture directory and prints it as a table. `unit` is
# the table unit (`ms` or `s`) and `limit` caps the number of files (empty means all). Each
# remaining argument is a "label=command" pair. The command receives the fixture directory,
# format and limit as its last three arguments.
run_benchmark() {
  local unit=$1
  local feed_dir=$2
  local feed_format=$3
  local limit=$4
  local description=$5
  shift 5

  local args=()
  for entry in "$@"; do
    args+=(--command-name "${entry%%=*}" "${entry#*=} $FILES_DIR/$feed_dir $feed_format $limit")
  done

  echo ""
  echo "⏳ Running: $description"

  local json
  json=$(mktemp)
  hyperfine --warmup 3 --min-runs 10 --export-json "$json" "${args[@]}"
  bun "$TABULATE" "$json" "$unit"
  rm -f "$json"
}
