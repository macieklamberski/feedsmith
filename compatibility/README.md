# Compatibility

Test suite validating correct module resolution and type definitions across all common consumer environments.

## Purpose

This test suite validates that feedsmith's dual ESM/CJS package exports work correctly across:
- Different TypeScript configurations (`moduleResolution`, `module` settings)
- Different package contexts (`"type": "module"` vs `"type": "commonjs"`)
- Pure JavaScript runtime (without TypeScript), on every Node.js version from 14 up
- Build tools (Vite)

feedsmith is installed with `npm install --install-links`, which packs it the way npm publishes it, so the tests see only the files that get published.

## Quick Start

```bash
# 1. Build the package, in the repository root
bun run build

# 2. Install the dependencies, then feedsmith as npm would publish it
bun install
npm install --install-links --no-save --no-package-lock --ignore-scripts ..

# 3. Run all tests
./test.sh
```

## Test Coverage: 18 Scenarios

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

### JavaScript Runtime - 4 scenarios

- **esm**: runs both `index.js` (follows package type) and `index.mjs` (explicit ESM)
- **cjs**: runs both `index.js` (follows package type) and `index.cjs` (explicit CJS)
- **esm and cjs without ESM fallbacks**: runs the same files with syntax detection and `require()` of ESM turned off, as older Node.js versions behave

In CI, the JavaScript files also run on Node.js 14, 16, 18, 20, 22 and 26. The full suite runs on 24.

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
