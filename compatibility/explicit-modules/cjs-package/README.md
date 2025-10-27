# Explicit Modules - CJS Package

This test validates that feedsmith works correctly with explicit TypeScript module extensions in a CommonJS package context.

## Files

- **test.cts** - Explicitly CommonJS file (natural in CJS package)
  - Uses `import` syntax (compiled to require)
  - Tests feedsmith's "require" export condition
  - Should load `index.d.cts` types

- **test.mts** - Explicitly ESM file (overrides package type)
  - Uses `import` syntax
  - Tests feedsmith's "import" export condition
  - Should load `index.d.ts` types

## Use Case

This pattern is used in:
- Legacy CJS projects adopting ESM gradually
- Projects that need to support both module types
- Build tool configuration files that need specific module types
