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

## Detailed Errors

By default, `ParseError` contains only a generic message. To get detailed XML error information including line and column numbers, use the `detailedErrors` option:

```typescript
import { parseRssFeed, ParseError } from 'feedsmith'

try {
  parseRssFeed('<rss><channel><title>Test</title', { detailedErrors: true })
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.message) // "Unexpected end of tag (line 1, column 35)"
    console.log(error.line)    // 1
    console.log(error.column)  // 35
    console.log(error.code)    // Error code from XML validator
  }
}
```

### ParseError Properties

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message, includes line/column when available |
| `line` | `number \| undefined` | Line number where error occurred |
| `column` | `number \| undefined` | Column number where error occurred |
| `code` | `string \| undefined` | Error code from the XML validator |

## Handling Both Error Types

```typescript
import { parseRssFeed, DetectError, ParseError } from 'feedsmith'

function safeParse(input: string) {
  try {
    return parseRssFeed(input, { detailedErrors: true })
  } catch (error) {
    if (error instanceof DetectError) {
      console.error('Not a valid RSS feed')
    } else if (error instanceof ParseError) {
      console.error(`XML error at line ${error.line}: ${error.message}`)
    }
    return null
  }
}
```

## Performance Note

The `detailedErrors` option runs additional XML validation when parsing fails, which adds overhead. For performance-critical applications, consider enabling it only in development or when debugging specific issues.
