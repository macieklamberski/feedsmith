# Atom Feed Reference

Atom is a syndication format based on XML that provides a robust framework for web feeds. Feedsmith provides comprehensive parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.3, 1.0</td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://tools.ietf.org/html/rfc4287" target="_blank">RFC 4287 - Atom Syndication Format</a></td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/psc">Podlove Simple Chapters</a>,
        <a href="/reference/namespaces/googleplay">Google Play Podcast</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/geo">W3C Basic Geo</a>,
        <a href="/reference/namespaces/georss">GeoRSS Simple</a>,
        <a href="/reference/namespaces/thr">Atom Threading</a>,
        <a href="/reference/namespaces/app">Atom Publishing Protocol</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Comment API</a>,
        <a href="/reference/namespaces/admin">Administrative</a>,
        <a href="/reference/namespaces/pingback">Pingback</a>,
        <a href="/reference/namespaces/trackback">Trackback</a>,
        <a href="/reference/namespaces/cc">ccREL</a>,
        <a href="/reference/namespaces/creativecommons">Creative Commons</a>,
        <a href="/reference/namespaces/opensearch">OpenSearch</a>,
        <a href="/reference/namespaces/arxiv">arXiv</a>,
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

// Limit number of entries parsed
const atomFeed = parseAtomFeed(xmlContent, { maxItems: 10 })
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The Atom XML content to parse |
| `options` | `object` | Optional parsing settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | - | Limit the number of entries parsed. Use `0` to skip entries entirely, useful when only feed metadata is needed |

#### Returns
`object` - Parsed Atom feed with all fields optional and dates as strings

### `generateAtomFeed()`

Generates Atom XML from feed data.

```typescript
import { generateAtomFeed } from 'feedsmith'

const xml = generateAtomFeed(feedData, {
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

All Atom types are available under the `Atom` namespace:

```typescript
import type { Atom } from 'feedsmith/types'

// Access any type from the definitions below
type Feed = Atom.Feed<Date>
type Entry = Atom.Entry<Date>
type Link = Atom.Link
type Person = Atom.Person
// … see type definitions below for all available types
```

See the [TypeScript guide](/reference/typescript) for usage examples.

### Type Definitions

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/atom/common/types.ts#reference

## Related

- **[Parsing Atom Feeds](/parsing/examples#atom-feed)** - How to parse Atom content
- **[Generating Atom Feeds](/generating/examples#atom-feed)** - How to create Atom feeds
- **[Atom Detection](/parsing/detecting)** - Detecting Atom format
