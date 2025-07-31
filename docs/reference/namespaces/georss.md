# GeoRSS-Simple Namespace Fields

The GeoRSS-Simple namespace enables geographic tagging of RSS feeds and items, allowing publishers to associate location information with their content.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.georss.org/georss</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;georss:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Point = {
  lat: number
  lng: number
}

export type Line = {
  points: Array<Point>
}

export type Polygon = {
  points: Array<Point>
}

export type Box = {
  lowerCorner: Point
  upperCorner: Point
}

export type ItemOrFeed = {
  point?: Point
  line?: Line
  polygon?: Polygon
  box?: Box
  featureTypeTag?: string
  relationshipTag?: string
  featureName?: string
  elev?: number
  floor?: number
  radius?: number
}
```

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
