---
title: "Reference: Atom Threading Namespace"
---

# Atom Threading Namespace

The Atom Threading namespace provides elements for representing threaded discussions and comment relationships in Atom feeds, enabling proper conversation threading.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/syndication/thread/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="http://purl.org/syndication/thread/1.0" target="_blank">Threading Extensions</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;thr:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>thr</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/thr/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
