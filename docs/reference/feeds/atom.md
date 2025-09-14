# Atom Feed Reference

Atom is a syndication format based on XML that provides a robust framework for web feeds. Feedsmith provides comprehensive parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.3, 1.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/georss">GeoRSS-Simple</a>,
        <a href="/reference/namespaces/thr">Atom Threading</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Well-Formed Web</a>,
        <a href="/reference/namespaces/yt">YouTube</a>
      </td>
    </tr>
  </tbody>
</table>

## Functions

### `parseAtomFeed()`

Parses Atom feed content and returns a typed Atom object.

```typescript
import { parseAtomFeed } from 'feedsmith'

const atomFeed = parseAtomFeed(xmlContent)
// Returns: object with all fields optional and dates as strings
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The Atom XML content to parse |

#### Returns
`object` - Parsed Atom feed with all fields optional and dates as strings

### `generateAtomFeed()`

Generates Atom XML from feed data.

```typescript
import { generateAtomFeed } from 'feedsmith'

const xml = generateAtomFeed(feedData, {
  lenient: true,
  stylesheets: [{ type: 'text/xsl', href: '/feed.xsl' }]
})
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | Atom feed data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lenient` | `boolean` | `false` | Enable lenient mode for relaxed validation, see [Lenient Mode](/generating/lenient-mode) |
| `stylesheets` | `Stylesheet[]` | - | Add stylesheets for visual formatting, see [Feed Styling](/generating/styling) |

#### Returns
`string` - Generated Atom XML

### `detectAtomFeed()`

Detects if the provided content is an Atom feed.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The content to check |

#### Returns
`boolean` - `true` if content appears to be Atom format

#### Example
```typescript
import { detectAtomFeed } from 'feedsmith'

const isAtom = detectAtomFeed(xmlContent)
```

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/atom/common/types.ts#reference

## Related

- **[Parsing Atom Feeds](/parsing/examples#atom-feed)** - How to parse Atom content
- **[Generating Atom Feeds](/generating/examples#atom-feed)** - How to create Atom feeds
- **[Atom Detection](/parsing/detecting)** - Detecting Atom format
