---
title: "Reference: Castbox Namespace"
---

# Castbox Namespace Reference

The Castbox namespace carries the Castbox identifiers of a podcast, its owner and its episodes, along with the podcast's visibility and the episode's premium flag, in RSS feeds hosted by Castbox.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://castbox.fm/dtds/podcast-1.0.dtd</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>No official documentation (inferred from live feeds)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;castbox:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>castbox</code></td>
    </tr>
  </tbody>
</table>

Castbox publishes no document for this namespace, and its URI does not resolve. Every element below is inferred from live feeds:

- `castbox:uid` on the channel, a 32-character hexadecimal identifier that several podcasts can share.
- `castbox:pid` on the channel, the numeric podcast identifier.
- `castbox:type` on the channel, empty or `private`.
- `castbox:tid` on the item, the numeric episode identifier.
- `castbox:episode_premium` on the item, empty, `yes` or `no`.

## Types

<<< @/../src/namespaces/castbox/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
