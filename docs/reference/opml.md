# OPML Fields

OPML (Outline Processor Markup Language) is a format for exchanging outline-structured information, commonly used for sharing feed subscription lists.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 2.0</td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

```typescript
export type Outline<TDate extends DateLike> = {
  text: string
  type?: string
  isComment?: boolean
  isBreakpoint?: boolean
  created?: TDate
  category?: string
  description?: string
  xmlUrl?: string
  htmlUrl?: string
  language?: string
  title?: string
  version?: string
  url?: string
  outlines?: Array<Outline<TDate>>
}

export type Head<TDate extends DateLike> = {
  title?: string
  dateCreated?: TDate
  dateModified?: TDate
  ownerName?: string
  ownerEmail?: string
  ownerId?: string
  docs?: string
  expansionState?: Array<number>
  vertScrollState?: number
  windowTop?: number
  windowLeft?: number
  windowBottom?: number
  windowRight?: number
}

export type Body<TDate extends DateLike> = {
  outlines?: Array<Outline<TDate>>
}

export type Opml<TDate extends DateLike> = {
  head?: Head<TDate>
  body?: Body<TDate>
}
```

## Related

- **[Parsing OPML](/parsing/#opml)** - How to parse OPML content
- **[Generating OPML](/generating/#opml)** - How to create OPML documents
- **[OPML Detection](/parsing/detecting#opml)** - Detecting OPML format
