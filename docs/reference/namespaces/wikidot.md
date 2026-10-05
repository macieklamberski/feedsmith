---
title: "Reference: Wikidot Namespace"
---

# Wikidot Namespace Reference

The Wikidot namespace carries the author of a forum post or page revision in the RSS feeds that Wikidot sites publish.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.wikidot.com/rss-namespace</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>No official documentation (inferred from live feeds)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;wikidot:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>wikidot</code></td>
    </tr>
  </tbody>
</table>

Wikidot never published a document for this namespace, and its URI does not resolve to one. Every element below is inferred from the feeds Wikidot sites serve:

- `wikidot:authorName`: item level, the author's display name. Anonymous posts carry only this element.
- `wikidot:authorUserId`: item level, the author's numeric Wikidot user ID, kept as a string.

## Types

<<< @/../src/namespaces/wikidot/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
