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
      <td><a href="https://podcasters.apple.com/support/823-podcast-requirements" target="_blank">Apple Podcasts Requirements</a></td>
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
