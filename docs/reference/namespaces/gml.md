---
title: "Reference: GML Namespace"
---

# GML Namespace Reference

The GML namespace carries the geometry of a GeoRSS location when a feed writes it in the GML form, inside `<georss:where>`, instead of as a GeoRSS Simple element.

> [!WARNING]
> Only the subset of GML that GeoRSS allows is supported: `Point`, `LineString`, `Polygon` with its exterior ring, `Envelope` and `CircleByCenterPoint`, with their attributes. GML itself is a much larger language, and elements outside this profile are ignored. GML is read only inside `<georss:where>`, never at feed or item level.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.opengis.net/gml</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://docs.ogc.org/cs/17-002r1/17-002r1.html" target="_blank">OGC GeoRSS Encoding Standard, GML profile</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;gml:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>,
        <a href="/reference/feeds/rdf">RDF</a>,
        inside <a href="/reference/namespaces/georss"><code>&lt;georss:where&gt;</code></a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>georss.where.gml</code></td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/gml/common/types.ts#reference

## Related

- **[GeoRSS Simple Namespace](/reference/namespaces/georss)** - The namespace that contains GML geometry
- **[W3C Basic Geo Namespace](/reference/namespaces/geo)** - Point coordinates as separate elements
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
