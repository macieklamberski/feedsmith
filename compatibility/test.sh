#!/bin/bash
set -e

FAILED=0

run_test() {
  local output
  if output=$(eval "$2" 2>&1); then
    echo "✅ $1"
  else
    echo "❌ $1"
    echo "$output"
    FAILED=1
  fi
}

# Type-check ESM and CJS projects under each module resolution.
for type in modern-esm modern-cjs; do
  for config in node node16 nodenext bundler; do
    run_test "$type/$config" "bunx tsc --project typescript/$type/tsconfig.$config.json --noEmit"
  done
done

# Type-check a CJS project with the legacy node module resolution.
run_test "legacy-cjs" "bunx tsc --project typescript/legacy-cjs/tsconfig.json --noEmit"

# Type-check .mts and .cts files in ESM, CJS and mixed packages.
for pkg in esm-package cjs-package mixed-package; do
  run_test "explicit/$pkg" "bunx tsc --project explicit-modules/$pkg/tsconfig.json --noEmit"
done

# Run ESM and CJS files through Node.
for type in esm cjs; do
  ext=$([ "$type" = "esm" ] && echo "mjs" || echo "cjs")
  run_test "javascript/$type" "node javascript/$type/index.js && node javascript/$type/index.$ext"
done

# Run them again without the fallbacks older Node versions lack: syntax detection, which loads
# ESM files Node would otherwise treat as CommonJS, and require() of ESM files.
for type in esm cjs; do
  ext=$([ "$type" = "esm" ] && echo "mjs" || echo "cjs")
  node="node --no-experimental-detect-module --no-experimental-require-module"
  run_test "javascript/$type (no ESM fallbacks)" "$node javascript/$type/index.js && $node javascript/$type/index.$ext"
done

# Build ESM and CJS projects with Vite.
for type in esm cjs; do
  run_test "vite/$type" "bunx vite build bundler/$type"
done

exit $FAILED
