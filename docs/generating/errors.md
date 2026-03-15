# Error Handling

Feedsmith provides a dedicated error type for generation failures.

## GenerateError

Thrown when feed generation fails due to invalid input.

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
