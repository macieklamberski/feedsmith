# JSON Feed Reference

JSON Feed is a syndication format based on JSON that provides a simple, straightforward way to publish feeds. Feedsmith provides full parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 1.1</td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.jsonfeed.org/version/1.1/" target="_blank">JSON Feed 1.1 Specification</a></td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>None (JSON-based format)</td>
    </tr>
  </tbody>
</table>

## Functions

### `parseJsonFeed()`

Parses JSON Feed content and returns a typed JSON Feed object.

```typescript
import { parseJsonFeed } from 'feedsmith'

const jsonFeed = parseJsonFeed(jsonContent)
// Returns: object with all fields optional and dates as strings

// Limit number of items parsed
const jsonFeed = parseJsonFeed(jsonContent, { maxItems: 10 })
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The JSON Feed content to parse |
| `options` | `object` | Optional parsing settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | - | Limit the number of items parsed. Use `0` to skip items entirely, useful when only feed metadata is needed |

#### Returns
`object` - Parsed JSON Feed with all fields optional and dates as strings

### `generateJsonFeed()`

Generates JSON Feed from feed data.

```typescript
import { generateJsonFeed } from 'feedsmith'

const json = generateJsonFeed(feedData)
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | JSON Feed data to generate |

#### Returns
`object` - Generated JSON Feed

### `detectJsonFeed()`

Detects if the provided content is a JSON Feed.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The content to check |

#### Returns
`boolean` - `true` if content appears to be JSON Feed format

#### Example
```typescript
import { detectJsonFeed } from 'feedsmith'

const isJsonFeed = detectJsonFeed(jsonContent)
```

## Types

All JSON Feed types are available under the `Json` namespace:

```typescript
import type { Json } from 'feedsmith/types'

// Access any type from the definitions below
type Feed = Json.Feed<Date>
type Item = Json.Item<Date>
type Author = Json.Author
type Attachment = Json.Attachment
// … see type definitions below for all available types
```

See the [TypeScript guide](/reference/typescript) for usage examples.

### Type Definitions

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/json/common/types.ts#reference

## Related

- **[Parsing JSON Feeds](/parsing/examples#json-feed)** - How to parse JSON Feed content
- **[Generating JSON Feeds](/generating/examples#json-feed)** - How to create JSON feeds
- **[JSON Feed Detection](/parsing/detecting)** - Detecting JSON Feed format