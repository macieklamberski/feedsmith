---
title: "Reference: Blogger Namespace"
---

# Blogger Namespace Reference

The Blogger namespace carries the adult content flag that Blogger writes on the feeds of blogs marked as adult.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://schemas.google.com/blogger/2008</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>No official documentation (inferred from live feeds)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;blogger:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>blogger</code></td>
    </tr>
  </tbody>
</table>

Google documents no element in this namespace, in the Blogger Data API guides or elsewhere. Every element below is inferred from live feeds:

- `blogger:adultContent` on the Atom feed and the RSS channel, holding `true`.

## Types

<<< @/../src/namespaces/blogger/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
