---
title: "Reference: FeedBurner Namespace"
---

# FeedBurner Namespace Reference

The FeedBurner namespace carries the metadata FeedBurner adds when it proxies a feed. The element that matters most is `origLink`: FeedBurner rewrites each item's `<link>` to a tracking URL and puts the publisher's own URL here, so a consumer that wants the real article reads `origLink` rather than `link`.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://rssnamespace.org/feedburner/ext/1.0</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;feedburner:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>feedburner</code></td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/feedburner/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
