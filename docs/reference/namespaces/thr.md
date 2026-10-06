---
title: "Reference: Atom Threading Namespace"
---

# Atom Threading Namespace Reference

The Atom Threading namespace provides elements for representing threaded discussions and comment relationships in RSS and Atom feeds, enabling proper conversation threading.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/syndication/thread/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://datatracker.ietf.org/doc/html/rfc4685" target="_blank">RFC 4685 - Atom Threading Extensions</a></td>
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
> For details on type parameters (`TDate`, `TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/namespaces/thr/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
