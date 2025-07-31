# Atom Namespace Fields

The Atom namespace allows RSS and RDF feeds to include Atom-specific elements, providing richer metadata and linking capabilities. This namespace provides partial Atom elements that can be embedded within other feed formats.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.w3.org/2005/Atom</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;atom:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
  </tbody>
</table>

## Structure

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

- **[Atom Feed Fields](/reference/feeds/atom)** - Complete Atom feed specification
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
