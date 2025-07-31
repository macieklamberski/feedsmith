# Atom Feed Fields

Atom is a syndication format based on XML that provides a robust framework for web feeds. Feedsmith provides comprehensive parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.3, 1.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
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
// For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
export type Text = string

export type Link<TDate extends DateLike> = {
  href: string
  rel?: string
  type?: string
  hreflang?: string
  title?: string
  length?: number
  thr?: ThrLink<TDate>
}

export type Person = {
  name: string
  uri?: string
  email?: string
}

export type Category = {
  term: string
  scheme?: string
  label?: string
}

export type Generator = {
  text: string
  uri?: string
  version?: string
}

export type Source<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id?: string
  links?: Array<Link<TDate>>
  logo?: string
  rights?: Text
  subtitle?: Text
  title?: Text
  updated?: TDate
}

export type Entry<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  content?: Text
  contributors?: Array<Person>
  id: string
  links?: Array<Link<TDate>>
  published?: TDate
  rights?: Text
  source?: Source<TDate>
  summary?: Text
  title: Text
  updated: TDate
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  slash?: SlashItem
  itunes?: ItunesItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  thr?: ThrItem
  wfw?: WfwItem
  yt?: YtItem
}

export type Feed<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id: string
  links?: Array<Link<TDate>>
  logo?: string
  rights?: Text
  subtitle?: Text
  title: Text
  updated: TDate
  entries?: Array<Entry<TDate>>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  itunes?: ItunesFeed
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  yt?: YtFeed
}
```


## Related

- **[Parsing Atom Feeds](/parsing/#atom)** - How to parse Atom content
- **[Generating Atom Feeds](/generating/#atom)** - How to create Atom feeds
- **[Atom Detection](/parsing/detecting#atom)** - Detecting Atom format
