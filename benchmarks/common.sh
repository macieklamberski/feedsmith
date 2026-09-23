#!/bin/bash

COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILES_DIR="$COMMON_DIR/files"
TABULATE="$COMMON_DIR/tabulate.ts"

# Runs one hyperfine comparison over a fixture directory and prints it as a table. `limit`
# caps the number of files (empty means all). Each remaining argument is a "label=command"
# pair. The command receives the fixture directory, format and limit as its last three
# arguments.
run_benchmark() {
  local feed_dir=$1
  local feed_format=$2
  local limit=$3
  local description=$4
  shift 4

  local args=()
  for entry in "$@"; do
    args+=(--command-name "${entry%%=*}" "${entry#*=} $FILES_DIR/$feed_dir $feed_format $limit")
  done

  echo ""
  echo "⏳ Running: $description"

  local json
  json=$(mktemp)
  hyperfine --warmup 3 --min-runs 10 --export-json "$json" "${args[@]}"
  bun "$TABULATE" "$json"
  rm -f "$json"
}
