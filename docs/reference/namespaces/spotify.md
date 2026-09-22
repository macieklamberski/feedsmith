---
title: "Reference: Spotify Namespace"
---

# Spotify Namespace Reference

The Spotify namespace provides podcast-specific metadata for Spotify's podcast platform, including episode limits, country targeting, and Open Access settings for restricting playback to subscribers (feed-level partner and sandbox, item-level entitlement).

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.spotify.com/ns/rss</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>
        <a href="https://assets.ctfassets.net/jtdj514wr91r/4r4op9KhH3fY1t3BKt2eiH/7b1b682acf4c41baf79f9574d6dedd7f/Podcast_Delivery_Specification_v1.10_-_master_doc.pdf" target="_blank">Spotify Podcast Delivery Specification v1.10</a><br>
        <a href="https://developer.spotify.com/documentation/open-access/tutorials/content" target="_blank">Spotify Open Access</a>
      </td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;spotify:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>spotify</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> For details on type parameters (`TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tstrict).

<<< @/../src/namespaces/spotify/common/types.ts#reference

## Related

- **[iTunes Namespace](/reference/namespaces/itunes)** - Traditional podcast metadata
- **[Podcast Namespace](/reference/namespaces/podcast)** - Podcasting 2.0 features
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
