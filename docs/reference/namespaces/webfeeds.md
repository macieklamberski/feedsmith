---
title: "Reference: WebFeeds Namespace"
---

# WebFeeds Namespace Reference

The WebFeeds namespace carries Feedly's feed extensions: a cover image, icon, logo and accent color for branding the feed, settings for related stories and analytics, and a featured image for each item.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://webfeeds.org/rss/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>
        No formal specification. The elements are documented by example in a Feedly blog post from 2015:<br>
        <a href="https://web.archive.org/web/20160811003109/https://blog.feedly.com/10-ways-to-optimize-your-feed-for-feedly/" target="_blank">10 Ways to Optimize Your Feed for Feedly</a> (Original, Web Archive)<br>
        <a href="https://devhd.wordpress.com/2015/07/31/10-ways-to-optimize-your-feed-for-feedly/" target="_blank">10 Ways to Optimize Your Feed for Feedly</a> (Feedly)<br>
        <a href="https://webfeeds.org/rss/1.0" target="_blank">WebFeeds RSS 1.0 Namespace Specification</a> (WebFeeds.org, unattributed)
      </td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;webfeeds:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a>, <a href="/reference/feeds/rdf">RDF</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>webfeeds</code></td>
    </tr>
  </tbody>
</table>

## Inferred from Feeds

The blog post shows each element in sample markup only, so these parts come from live feeds, not from a document:

- `webfeeds:partial` on the channel, a `true` or `false` value.
- `webfeeds:featuredImage` on items, with `url`, `type`, `width` and `height` attributes.
- The value types of every element, including the numeric `width` and `height`.

## Types

<<< @/../src/namespaces/webfeeds/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
