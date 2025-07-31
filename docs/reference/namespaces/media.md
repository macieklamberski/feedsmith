# Media RSS Namespace Fields

The Media RSS namespace provides rich media metadata for RSS feeds, enabling comprehensive description of multimedia content including videos, images, and audio files.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://search.yahoo.com/mrss/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;media:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Rating = {
  value: string
  scheme?: string
}

export type TitleOrDescription = {
  value: string
  type?: string
}

export type Thumbnail = {
  url: string
  height?: number
  width?: number
  time?: string
}

export type Category = {
  name: string
  scheme?: string
  label?: string
}

export type Hash = {
  value: string
  algo?: string
}

export type Player = {
  url: string
  height?: number
  width?: number
}

export type Credit = {
  value: string
  role?: string
  scheme?: string
}

export type Copyright = {
  value: string
  url?: string
}

export type Text = {
  value: string
  type?: string
  lang?: string
  start?: string
  end?: string
}

export type Restriction = {
  value: string
  relationship: string
  type?: string
}

export type Community = {
  starRating?: StarRating
  statistics?: Statistics
  tags?: Array<Tag>
}

export type StarRating = {
  average?: number
  count?: number
  min?: number
  max?: number
}

export type Statistics = {
  views?: number
  favorites?: number
}

export type Tag = {
  name: string
  weight: number
}

export type Embed = {
  url: string
  width?: number
  height?: number
  params?: Array<Param>
}

export type Param = {
  name: string
  value: string
}

export type Status = {
  state: string
  reason?: string
}

export type Price = {
  type?: string
  info?: string
  price?: number
  currency?: string
}

export type License = {
  name?: string
  type?: string
  href?: string
} & ({ name: string } | { href: string })

export type SubTitle = {
  type?: string
  lang?: string
  href: string
}

export type PeerLink = {
  type?: string
  href: string
}

export type Rights = {
  status?: string
}

export type Scene = {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
}

export type Location = {
  description?: string
  start?: string
  end?: string
  lat?: number
  lng?: number
}

export type CommonElements = {
  ratings?: Array<Rating>
  title?: TitleOrDescription
  description?: TitleOrDescription
  keywords?: Array<string>
  thumbnails?: Array<Thumbnail>
  categories?: Array<Category>
  hashes?: Array<Hash>
  player?: Player
  credits?: Array<Credit>
  copyright?: Copyright
  texts?: Array<Text>
  restrictions?: Array<Restriction>
  community?: Community
  comments?: Array<string>
  embed?: Embed
  responses?: Array<string>
  backLinks?: Array<string>
  status?: Status
  prices?: Array<Price>
  licenses?: Array<License>
  subTitles?: Array<SubTitle>
  peerLinks?: Array<PeerLink>
  locations?: Array<Location>
  rights?: Rights
  scenes?: Array<Scene>
}

export type Content = {
  url: string
  fileSize?: number
  type?: string
  medium?: string
  isDefault?: boolean
  expression?: string
  bitrate?: number
  framerate?: number
  samplingrate?: number
  channels?: number
  duration?: number
  height?: number
  width?: number
  lang?: string
} & CommonElements

export type Group = {
  contents?: Array<Content>
} & CommonElements

export type ItemOrFeed = {
  group?: Group
  contents?: Array<Content>
} & CommonElements
```

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
