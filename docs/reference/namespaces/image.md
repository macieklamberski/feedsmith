---
title: "Reference: Image Namespace"
---

# Image Namespace Reference

The RSS 1.0 Image module adds an image to each item and a favicon to the channel or an item, with the image size and a Dublin Core title.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/rss/1.0/modules/image/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://web.resource.org/rss/1.0/modules/image/" target="_blank">RSS 1.0 Modules: Image</a> (Proposed)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;image:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/rdf">RDF</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>imageNs</code> (due to conflict with RSS's <code>image</code> element)</td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/image/common/types.ts#reference

The `image:item` element maps to `item`, and its `dc:title` child to `dc.titles`. The spec puts the image URL in `rdf:about` and an optional link for the item in `rdf:resource`. Both are kept as written, in `about` and `resource`.

Inferred from live feeds: the spec does not say how many `image:item` or `image:favicon` elements one item or channel may carry. Real feeds carry one, so both are singular.

## Related

- **[Media RSS Namespace](/reference/namespaces/media)** - Rich media metadata, including thumbnails
- **[Dublin Core Namespace](/reference/namespaces/dc)** - The title inside images and favicons
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
