# Google Play Podcast Namespace Reference

The Google Play Podcast namespace provides podcast-specific metadata for feed and episode information optimized for Google Play's podcast platform, including author details, content descriptions, and content policies.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>https://www.google.com/schemas/play-podcasts/1.0/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.google.com/schemas/play-podcasts/1.0/">Google Play Podcast Namespace</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;googleplay:*&gt;</code></td>
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
      <td><code>googleplay</code></td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> For details on type parameters (`TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tstrict).

<<< @/../src/namespaces/googleplay/common/types.ts#reference

## Related

- **[iTunes Namespace](/reference/namespaces/itunes)** - Apple Podcasts metadata
- **[Podcast Namespace](/reference/namespaces/podcast)** - Modern Podcasting 2.0 features
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works