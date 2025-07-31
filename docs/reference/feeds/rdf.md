# RDF Feed Fields

RDF (Resource Description Framework) Site Summary is an early XML-based syndication format that uses RDF metadata. Feedsmith provides full parsing capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.9, 1.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/atom">Atom</a>,
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/content">Content</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/georss">GeoRSS-Simple</a>,
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
export type Image = {
  title: string
  link: string
  url?: string
}

export type TextInput = {
  title: string
  description: string
  name: string
  link: string
}

export type Item<TDate extends DateLike> = {
  title: string
  link: string
  description?: string
  atom?: AtomEntry<TDate>
  content?: ContentItem
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  slash?: SlashItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  wfw?: WfwItem
}

export type Feed<TDate extends DateLike> = {
  title: string
  link: string
  description: string
  image?: Image
  items?: Array<Item<TDate>>
  textInput?: TextInput
  atom?: AtomFeed<TDate>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
```


## Related

- **[Parsing RDF Feeds](/parsing/#rdf)** - How to parse RDF content
- **[RDF Detection](/parsing/detecting#rdf)** - Detecting RDF format