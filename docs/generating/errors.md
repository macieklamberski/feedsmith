# Error Handling

Feedsmith provides a dedicated error type for generation failures.

## GenerateError

Thrown when feed generation fails due to invalid input. Applies to all generators: `generateRssFeed`, `generateAtomFeed`, `generateJsonFeed`, and `generateOpml`.

```typescript
import { generateRssFeed, GenerateError } from 'feedsmith'

try {
  generateRssFeed({})
} catch (error) {
  if (error instanceof GenerateError) {
    console.log(error.message) // "Invalid input RSS"
  }
}
```

## Error Hierarchy

All error classes extend the built-in `Error`, so `instanceof Error` checks work as expected. This can be useful for catching any generation error alongside other errors in a single handler:

```typescript
import { generateJsonFeed, GenerateError } from 'feedsmith'

try {
  generateJsonFeed(data)
} catch (error) {
  if (error instanceof GenerateError) {
    // Feedsmith-specific generation failure.
  } else if (error instanceof Error) {
    // Any other error.
  }
}
```
