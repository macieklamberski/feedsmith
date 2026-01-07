# Explicit Modules - Mixed Package

This test validates that feedsmith works correctly in projects that use both .mts and .cts files simultaneously (dual-module pattern).

## Files

- **esm-module.mts** - ESM version using feedsmith
- **cjs-module.cts** - CJS version using feedsmith
- **shared.ts** - Shared utilities (follows package.json type)

## Pattern

This simulates packages that publish both ESM and CJS builds from the same source:

```
src/
  esm-module.mts  → dist/esm-module.mjs
  cjs-module.cts  → dist/cjs-module.cjs
  shared.ts       → dist/shared.js (follows package type)
```

## Use Cases

- Dual-module package authoring
- Libraries that need to support both module systems
- Gradual migration scenarios
- Testing both export conditions simultaneously
