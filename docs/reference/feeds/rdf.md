# RDF Feed Reference

RDF (Resource Description Framework) Site Summary is an early XML-based syndication format that uses RDF metadata. Feedsmith provides full parsing capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.9, 1.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/atom">Atom</a>,
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/content">Content</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/georss">GeoRSS-Simple</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Well-Formed Web</a>
      </td>
    </tr>
  </tbody>
</table>

## Functions

### `parseRdfFeed()`

Parses RDF feed content and returns a typed RDF object.

```typescript
import { parseRdfFeed } from 'feedsmith'

const rdfFeed = parseRdfFeed(xmlContent)
// Returns: object with all fields optional and dates as strings
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The RDF XML content to parse |

#### Returns
`object` - Parsed RDF feed with all fields optional and dates as strings

### `generateRdfFeed()`

> [!NOTE]
> RDF feed generation is currently work in progress and not yet available.

### `detectRdfFeed()`

Detects if the provided content is an RDF feed.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The content to check |

#### Returns
`boolean` - `true` if content appears to be RDF format

#### Example
```typescript
import { detectRdfFeed } from 'feedsmith'

const isRdf = detectRdfFeed(xmlContent)
```

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/rdf/common/types.ts#reference

## Related

- **[Parsing RDF Feeds](/parsing/examples#rdf-feed)** - How to parse RDF content
- **[RDF Detection](/parsing/detecting)** - Detecting RDF format