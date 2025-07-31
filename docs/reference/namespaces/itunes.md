# iTunes Namespace Fields

The iTunes namespace provides podcast-specific metadata for RSS and Atom feeds. This namespace is essential for podcast distribution through Apple Podcasts and other podcast platforms.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.itunes.com/dtds/podcast-1.0.dtd</code></td>
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
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Category = {
  text: string
  categories?: Array<Category>
}

export type Owner = {
  name?: string
  email?: string
}

export type Item = {
  duration?: number
  image?: string
  explicit?: boolean
  title?: string
  episode?: number
  season?: number
  episodeType?: string
  block?: boolean
  /** @deprecated Use standard RSS description instead. No longer used by Apple Podcasts. */
  summary?: string
  /** @deprecated No longer used by Apple Podcasts. */
  subtitle?: string
  /** @deprecated No longer used for search in Apple Podcasts. */
  keywords?: Array<string>
}

export type Feed = {
  image?: string
  categories?: Array<Category>
  explicit?: boolean
  author?: string
  title?: string
  type?: string
  newFeedUrl?: string
  block?: boolean
  complete?: boolean
  applePodcastsVerify?: string
  /** @deprecated Use standard RSS description instead. No longer used by Apple Podcasts. */
  summary?: string
  /** @deprecated No longer used by Apple Podcasts. */
  subtitle?: string
  /** @deprecated No longer used for search in Apple Podcasts. */
  keywords?: Array<string>
  /** @deprecated No longer required for submission to Apple Podcasts. */
  owner?: Owner
}
```

## Related

- **[Podcast Namespace](/reference/namespaces/podcast)** - Podcasting 2.0 extensions
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
