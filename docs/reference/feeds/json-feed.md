# JSON Feed Fields

JSON Feed is a syndication format based on JSON that provides a simple, straightforward way to publish feeds. Feedsmith provides full parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 1.1</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>None (JSON-based format)</td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Author = {
  name?: string
  url?: string
  avatar?: string
}

export type Attachment = {
  url: string
  mime_type: string
  title?: string
  size_in_bytes?: number
  duration_in_seconds?: number
}

export type Item<TDate extends DateLike> = {
  id: string
  url?: string
  external_url?: string
  title?: string
  content_html?: string
  content_text?: string
  summary?: string
  image?: string
  banner_image?: string
  date_published?: TDate
  date_modified?: TDate
  tags?: Array<string>
  authors?: Array<Author>
  language?: string
  attachments?: Array<Attachment>
} & ({ content_html: string } | { content_text: string })

export type Hub = {
  type: string
  url: string
}

export type Feed<TDate extends DateLike> = {
  title: string
  home_page_url?: string
  feed_url?: string
  description?: string
  user_comment?: string
  next_url?: string
  icon?: string
  favicon?: string
  language?: string
  expired?: boolean
  hubs?: Array<Hub>
  authors?: Array<Author>
  items: Array<Item<TDate>>
}
```

## Related

- **[Parsing JSON Feeds](/parsing/#json-feed)** - How to parse JSON Feed content
- **[Generating JSON Feeds](/generating/#json-feed)** - How to create JSON feeds
- **[JSON Feed Detection](/parsing/detecting#json-feed)** - Detecting JSON Feed format