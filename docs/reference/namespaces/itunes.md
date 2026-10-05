---
title: "Reference: iTunes Namespace"
---

# iTunes Namespace Reference

The iTunes namespace provides podcast-specific metadata for RSS and Atom feeds. This namespace is essential for podcast distribution through Apple Podcasts and other podcast platforms.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.itunes.com/dtds/podcast-1.0.dtd</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>
        <a href="https://web.archive.org/web/20160103214456/http://www.apple.com/itunes/podcasts/specs.html" target="_blank">Making a Podcast</a> (Original, Web Archive)<br>
        <a href="https://help.apple.com/itc/podcasts_connect/#/itcb54353390" target="_blank">A Podcaster’s Guide to RSS</a> (Apple)
      </td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;itunes:*&gt;</code></td>
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
      <td><code>itunes</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> For details on type parameters (`TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tstrict).

<<< @/../src/namespaces/itunes/common/types.ts#reference

## Related

- **[Podcast Namespace](/reference/namespaces/podcast)** - Podcasting 2.0 extensions
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
