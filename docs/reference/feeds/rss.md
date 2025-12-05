# RSS Feed Reference

RSS (Really Simple Syndication) is one of the most widely used web feed formats. Feedsmith automatically normalizes legacy elements to their modern equivalents.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.9x, 2.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/atom">Atom</a>,
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/content">Content</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/podcast">Podcast Index</a>,
        <a href="/reference/namespaces/rawvoice">RawVoice</a>,
        <a href="/reference/namespaces/psc">Podlove Simple Chapters</a>,
        <a href="/reference/namespaces/googleplay">Google Play Podcast</a>,
        <a href="/reference/namespaces/spotify">Spotify</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/geo">W3C Basic Geo</a>,
        <a href="/reference/namespaces/georss">GeoRSS Simple</a>,
        <a href="/reference/namespaces/thr">Atom Threading</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Comment API</a>,
        <a href="/reference/namespaces/admin">Administrative</a>,
        <a href="/reference/namespaces/pingback">Pingback</a>,
        <a href="/reference/namespaces/trackback">Trackback</a>,
        <a href="/reference/namespaces/source">Source</a>,
        <a href="/reference/namespaces/cc">ccREL</a>,
        <a href="/reference/namespaces/creativecommons">Creative Commons</a>,
        <a href="/reference/namespaces/feedpress">FeedPress</a>,
        <a href="/reference/namespaces/opensearch">OpenSearch</a>
      </td>
    </tr>
  </tbody>
</table>

## Functions

### `parseRssFeed()`

Parses RSS feed content and returns a typed RSS object.

```typescript
import { parseRssFeed } from 'feedsmith'

const rssFeed = parseRssFeed(xmlContent)
// Returns: object with all fields optional and dates as strings

// Limit number of items parsed
const rssFeed = parseRssFeed(xmlContent, { maxItems: 10 })
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The RSS XML content to parse |
| `options` | `object` | Optional parsing settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | - | Limit the number of items parsed. Use `0` to skip items entirely, useful when only feed metadata is needed |

#### Returns
`object` - Parsed RSS feed with all fields optional and dates as strings

### `generateRssFeed()`

Generates RSS XML from feed data.

```typescript
import { generateRssFeed } from 'feedsmith'

const xml = generateRssFeed(feedData, {
  stylesheets: [{ type: 'text/xsl', href: '/feed.xsl' }]
})
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | RSS feed data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `stylesheets` | `Stylesheet[]` | - | Add stylesheets for visual formatting, see [Feed Styling](/generating/styling) |

#### Returns
`string` - Generated RSS XML

### `detectRssFeed()`

Detects if the provided content is an RSS feed.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The content to check |

#### Returns
`boolean` - `true` if content appears to be RSS format

#### Example
```typescript
import { detectRssFeed } from 'feedsmith'

const isRss = detectRssFeed(xmlContent)
```

## Types

All RSS types are available under the `Rss` namespace:

```typescript
import type { Rss } from 'feedsmith/types'

// Access any type from the definitions below
type Feed = Rss.Feed<Date>
type Item = Rss.Item<Date>
type Category = Rss.Category
type Enclosure = Rss.Enclosure
// … see type definitions below for all available types
```

See the [TypeScript guide](/typescript) for usage examples.

### Type Definitions

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/rss/common/types.ts#reference

## Related

- **[Parsing RSS Feeds](/parsing/examples#rss-feed)** - How to parse RSS content
- **[Generating RSS Feeds](/generating/examples#rss-feed)** - How to create RSS feeds
- **[RSS Detection](/parsing/detecting)** - Detecting RSS format
