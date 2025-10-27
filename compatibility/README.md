# @feedsmith/compatibility

Compatibility test suite for the [feedsmith](../feedsmith) package, validating correct module resolution and type definitions across all common consumer environments.

## Purpose

This test suite validates that feedsmith's dual ESM/CJS package exports work correctly across:
- Different TypeScript configurations (`moduleResolution`, `module` settings)
- Different package contexts (`"type": "module"` vs `"type": "commonjs"`)
- Pure JavaScript runtime (without TypeScript)
- Build tools (Vite)

## Quick Start

```bash
# Install dependencies
bun install

# Run all tests
./test.sh
```

## Test Coverage: 22 Scenarios

### TypeScript - 9 scenarios

**modern-esm** (`"type": "module"`) - 4 configs
- `moduleResolution: "node"` (legacy)
- `moduleResolution: "node16"`
- `moduleResolution: "nodenext"`
- `moduleResolution: "bundler"`

**modern-cjs** (`"type": "commonjs"`) - 4 configs
- `module: "commonjs"` + `moduleResolution: "node"` ⭐ (fixes [#126](https://github.com/macieklamberski/feedsmith/issues/126))
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

- **esm**: `index.js` (follows package type) and `index.mjs` (explicit ESM)
- **cjs**: `index.js` (follows package type) and `index.cjs` (explicit CJS)

### Bundler - 2 scenarios

- **Vite ESM**: TypeScript entry with `import` syntax
- **Vite CJS**: JavaScript entry with `require()` syntax

## What Each Test Validates

Each test imports and uses:
- **Functions**: `parseFeed()`, `generateRssFeed()`
- **Types**: `Rss.Feed<Date>` (modern), `RssFeed<Date>` (legacy)

This validates:
1. ✅ Package exports resolve correctly
2. ✅ TypeScript finds the right `.d.ts` / `.d.cts` files
3. ✅ Both modern and legacy import patterns work
4. ✅ Functions execute without runtime errors

**Note:** This is a **package compatibility test suite**, not comprehensive feature testing. If these minimal imports work, the package exports are configured correctly.

## Real-World Coverage

These scenarios cover common consumer setups:
- **NestJS, Express, Next.js**: `modern-cjs` configs
- **Modern ESM projects**: `modern-esm` configs
- **Vite, webpack, Rollup**: `bundler` configs
- **Pure JavaScript**: `javascript` configs
- **Dual-module packages**: `explicit` configs

## CI/CD Integration

```bash
cd feedsmith-tests
bun install
./test.sh
```

All tests must pass before releasing.

## Architecture

Uses Bun workspaces for efficient dependency management:
- Shared dependencies (TypeScript, Vite) hoisted to root
- Each test is an isolated workspace package
- feedsmith linked from parent directory

## License

MIT
