---
title: "Reference: Atom Namespace"
---

# Atom Namespace

The Atom namespace allows RSS and RDF feeds to include Atom-specific elements, providing richer metadata and linking capabilities. This namespace provides partial Atom elements that can be embedded within other feed formats.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.w3.org/2005/Atom</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://datatracker.ietf.org/doc/html/rfc4287" target="_blank">RFC 4287 - Atom Syndication Format</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;atom:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>atom</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/atom/common/types.ts#reference

## Related

- **[Atom Feed Fields](/reference/feeds/atom)** - Complete Atom feed specification
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
