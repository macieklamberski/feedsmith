# JSON Feed Reference

JSON Feed is a syndication format based on JSON that provides a simple, straightforward way to publish feeds. Feedsmith provides full parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 1.1</td>
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
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The JSON Feed content to parse |

#### Returns
`object` - Parsed JSON Feed with all fields optional and dates as strings

### `generateJsonFeed()`

Generates JSON Feed from feed data.

```typescript
import { generateJsonFeed } from 'feedsmith'

const json = generateJsonFeed(feedData, {
  lenient: true
})
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | JSON Feed data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lenient` | `boolean` | `false` | Enable lenient mode for relaxed validation, see [Lenient Mode](/generating/lenient-mode) |

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

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/json/common/types.ts#reference

## Related

- **[Parsing JSON Feeds](/parsing/examples#json-feed)** - How to parse JSON Feed content
- **[Generating JSON Feeds](/generating/examples#json-feed)** - How to create JSON feeds
- **[JSON Feed Detection](/parsing/detecting)** - Detecting JSON Feed format