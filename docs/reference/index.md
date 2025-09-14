# Universal Functions

Universal functions that work across all feed formats.

## Functions

### `parseFeed()`

Universal parser that automatically detects feed format and parses accordingly.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The feed content to parse (XML or JSON) |

#### Returns
`object` - Object containing:
- `format: 'rss' | 'atom' | 'rdf' | 'json'` - Detected feed format
- `feed: object` - Parsed feed with all fields optional and dates as strings

#### Example
```typescript
import { parseFeed } from 'feedsmith'

const { format, feed } = parseFeed(feedContent)
```

> [!IMPORTANT]
> The universal parser uses detection functions to identify feed formats. For maximum reliability when you know the format in advance, use format-specific parsers.