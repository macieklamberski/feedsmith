---
title: "Reference: Universal Functions"
---

# Universal Functions

Universal functions that work across all feed formats.

## Functions

### `parseAnyFeed()`

Universal parser that automatically detects feed format and parses accordingly.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The feed content to parse (XML or JSON) |
| `options` | `object` | Optional parsing settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | - | Limit the number of items/entries parsed. Use `0` to skip items entirely, useful when only feed metadata is needed |

#### Returns
`object` - Object containing:
- `format: 'rss' | 'atom' | 'rdf' | 'json'` - Detected feed format
- `feed: object` - Parsed feed with all fields optional and dates as strings

#### Example
```typescript
import { parseAnyFeed } from 'feedsmith'

const { format, feed } = parseAnyFeed(feedContent)

// Limit number of items parsed
const { format, feed } = parseAnyFeed(feedContent, { maxItems: 5 })

// Parse only feed metadata (skip all items)
const { format, feed } = parseAnyFeed(feedContent, { maxItems: 0 })
```

> [!IMPORTANT]
> The universal parser uses detection functions to identify feed formats. For maximum reliability when you know the format in advance, use format-specific parsers.