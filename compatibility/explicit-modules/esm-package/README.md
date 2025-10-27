# Explicit Modules - ESM Package

This test validates that feedsmith works correctly with explicit TypeScript module extensions in an ESM package context.

## Files

- **test.mts** - Explicitly ESM file (natural in ESM package)
  - Uses `import` syntax
  - Tests feedsmith's "import" export condition
  - Should load `index.d.ts` types

- **test.cts** - Explicitly CommonJS file (overrides package type)
  - Uses `import` syntax (compiled to require)
  - Tests feedsmith's "require" export condition
  - Should load `index.d.cts` types

## Use Case

This pattern is used in:
- Projects with mixed ESM/CJS files
- Gradual ESM migration scenarios
- Packages that need both module types available
