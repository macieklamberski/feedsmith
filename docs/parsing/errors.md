# Error Handling

Feedsmith provides dedicated error types for different failure scenarios during parsing.

## Error Types

### DetectError

Thrown when the input doesn't match the expected feed format. This happens before any parsing is attempted.

```typescript
import { parseRssFeed, DetectError } from 'feedsmith'

try {
  parseRssFeed('<feed>not rss</feed>')
} catch (error) {
  if (error instanceof DetectError) {
    console.log(error.message) // "Invalid feed format"
  }
}
```

### MalformedError

Thrown when the content is malformed and the underlying parser fails (e.g., invalid XML).

```typescript
import { parseRssFeed, MalformedError } from 'feedsmith'

try {
  parseRssFeed('<rss version="2.0"><channel><title>Test</title</channel></rss>')
} catch (error) {
  if (error instanceof MalformedError) {
    console.log(error.message) // "Invalid feed format"
  }
}
```

### ParseError

Thrown when the content is syntactically valid but produces an empty or invalid result.

```typescript
import { parseRssFeed, ParseError } from 'feedsmith'

try {
  parseRssFeed('<rss version="2.0"></rss>')
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.message) // "Invalid feed format"
  }
}
```

## Universal Parser

The universal `parseFeed` function throws the same error types:

```typescript
import { parseFeed, DetectError, MalformedError, ParseError } from 'feedsmith'

try {
  parseFeed('<not-a-feed></not-a-feed>')
} catch (error) {
  if (error instanceof DetectError) {
    // Unrecognized feed format.
  } else if (error instanceof MalformedError) {
    // Malformed XML.
  } else if (error instanceof ParseError) {
    // Valid XML but invalid feed structure.
  }
}
```

## Error Hierarchy

All error classes extend the built-in `Error`, so `instanceof Error` checks work as expected. This can be useful for catching any parsing error alongside other errors in a single handler:

```typescript
import { parseFeed, DetectError, MalformedError, ParseError } from 'feedsmith'

try {
  parseFeed(input)
} catch (error) {
  if (error instanceof DetectError) {
    // Unrecognized feed format.
  } else if (error instanceof MalformedError) {
    // Malformed XML.
  } else if (error instanceof ParseError) {
    // Valid XML but invalid feed structure.
  } else if (error instanceof Error) {
    // Any other error.
  }
}
```
