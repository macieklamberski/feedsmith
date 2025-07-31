# RSS Feed Fields

RSS (Really Simple Syndication) is one of the most widely used web feed formats. Feedsmith automatically normalizes legacy elements to their modern equivalents.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.9x, 2.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/atom">Atom</a>,
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/content">Content</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/podcast">Podcast</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/georss">GeoRSS-Simple</a>,
        <a href="/reference/namespaces/thr">Atom Threading</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Well-Formed Web</a>
      </td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Person = string

export type Category = {
  name: string
  domain?: string
}

export type Cloud = {
  domain: string
  port: number
  path: string
  registerProcedure: string
  protocol: string
}

export type Image = {
  url: string
  title: string
  link: string
  description?: string
  height?: number
  width?: number
}

export type TextInput = {
  title: string
  description: string
  name: string
  link: string
}

export type Enclosure = {
  url: string
  length: number
  type: string
}

export type SkipHours = Array<number>

export type SkipDays = Array<string>

export type Guid = {
  value: string
  isPermaLink?: boolean
}

export type Source = {
  title: string
  url?: string
}

export type Item<TDate extends DateLike> = {
  title?: string
  link?: string
  description?: string
  authors?: Array<Person>
  categories?: Array<Category>
  comments?: string
  enclosures?: Array<Enclosure>
  guid?: Guid
  pubDate?: TDate
  source?: Source
  content?: ContentItem
  atom?: AtomEntry<TDate>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  slash?: SlashItem
  itunes?: ItunesItem
  podcast?: PodcastItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  thr?: ThrItem
  wfw?: WfwItem
} & ({ title: string } | { description: string })

export type Feed<TDate extends DateLike> = {
  title: string
  // INFO: Spec mentions required "link", but the "link" might be missing as well when the
  // atom:link rel="self" is present so that's why the "link" is not required in this type.
  link?: string
  description: string
  language?: string
  copyright?: string
  managingEditor?: Person
  webMaster?: Person
  pubDate?: TDate
  lastBuildDate?: TDate
  categories?: Array<Category>
  generator?: string
  docs?: string
  cloud?: Cloud
  ttl?: number
  image?: Image
  rating?: string
  textInput?: TextInput
  skipHours?: Array<number>
  skipDays?: Array<string>
  items?: Array<Item<TDate>>
  atom?: AtomFeed<TDate>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  itunes?: ItunesFeed
  podcast?: PodcastFeed<TDate>
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
```


## Related

- **[Parsing RSS Feeds](/parsing/#rss)** - How to parse RSS content
- **[Generating RSS Feeds](/generating/#rss)** - How to create RSS feeds
- **[RSS Detection](/parsing/detecting#rss)** - Detecting RSS format
