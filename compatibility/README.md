# Compatibility

Test suite validating correct module resolution and type definitions across all common consumer environments.

## Purpose

This test suite validates that feedsmith's dual ESM/CJS package exports work correctly across:
- Different TypeScript configurations (`moduleResolution`, `module` settings)
- Different package contexts (`"type": "module"` vs `"type": "commonjs"`)
- Pure JavaScript runtime (without TypeScript)
- Build tools (Vite)

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Run all tests
./test.sh
```

## Test Coverage: 16 Scenarios

### TypeScript - 9 scenarios

**modern-esm** (`"type": "module"`) - 4 configs
- `moduleResolution: "node"` (legacy)
- `moduleResolution: "node16"`
- `moduleResolution: "nodenext"`
- `moduleResolution: "bundler"`

**modern-cjs** (`"type": "commonjs"`) - 4 configs
- `module: "commonjs"` + `moduleResolution: "node"`
- `module: "node16"` + `moduleResolution: "node16"`
- `module: "nodenext"` + `moduleResolution: "nodenext"`
- `module: "esnext"` + `moduleResolution: "bundler"`

**legacy-cjs** (`"type": "commonjs"`) - 1 config
- `module: "commonjs"` + `moduleResolution: "node"` with `require()` syntax

### Explicit Module Extensions - 3 scenarios

- **esm-package**: `.mts` and `.cts` files in ESM package context
- **cjs-package**: `.mts` and `.cts` files in CJS package context
- **mixed-package**: `.ts`, `.mts`, and `.cts` coexisting

### JavaScript Runtime - 2 scenarios

- **esm**: runs both `index.js` (follows package type) and `index.mjs` (explicit ESM)
- **cjs**: runs both `index.js` (follows package type) and `index.cjs` (explicit CJS)

### Bundler - 2 scenarios

- **Vite ESM**: TypeScript entry (`index.ts`) with `import` syntax
- **Vite CJS**: CommonJS entry (`index.cjs`) with `require()` syntax

## Real-World Coverage

These scenarios cover common consumer setups:
- **NestJS, Express, Next.js**: `modern-cjs` configs
- **Modern ESM projects**: `modern-esm` configs
- **Vite, webpack, Rollup**: `bundler` configs
- **Pure JavaScript**: `javascript` configs
- **Dual-module packages**: `explicit` configs
