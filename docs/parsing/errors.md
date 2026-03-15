# Error Handling

Feedsmith provides two error types for different failure scenarios during parsing.

## Error Types

### DetectError

Thrown when the input doesn't match the expected feed format. This happens before any XML parsing is attempted.

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

### ParseError

Thrown when XML parsing fails due to malformed content.

```typescript
import { parseRssFeed, ParseError } from 'feedsmith'

try {
  parseRssFeed('<rss><channel><title>Test</title></channel></rss>')
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.message) // "Invalid feed format"
  }
}
```

## Universal Parser

The universal `parseFeed` function throws the same error types:

```typescript
import { parseFeed, DetectError, ParseError } from 'feedsmith'

try {
  parseFeed('<not-a-feed></not-a-feed>')
} catch (error) {
  if (error instanceof DetectError) {
    // Unrecognized feed format
  } else if (error instanceof ParseError) {
    // Malformed XML
  }
}
```
