#!/bin/bash
set -e

run_test() {
  eval "$2" > /dev/null 2>&1 && echo "✅ $1" || echo "❌ $1"
}

# TypeScript
for type in modern-esm modern-cjs; do
  for config in node node16 nodenext bundler; do
    run_test "$type/$config" "bunx tsc --project typescript/$type/tsconfig.$config.json --noEmit"
  done
done

# Legacy CJS
run_test "legacy-cjs" "bunx tsc --project typescript/legacy-cjs/tsconfig.json --noEmit"

# Explicit modules
for pkg in esm-package cjs-package mixed-package; do
  run_test "explicit/$pkg" "bunx tsc --project explicit-modules/$pkg/tsconfig.json --noEmit"
done

# JavaScript
for type in esm cjs; do
  ext=$([ "$type" = "esm" ] && echo "mjs" || echo "cjs")
  run_test "javascript/$type" "node javascript/$type/index.js && node javascript/$type/index.$ext"
done

# Vite bundler
for type in esm cjs; do
  run_test "vite/$type" "bunx vite build bundler/$type"
done
