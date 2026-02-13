---
title: "Parsing Feeds: Parsing Dates"
---

# Parsing Dates

Dates in feeds are notoriously unreliable — wrong formats, missing timezones, localized strings, inconsistencies within the same feed. Rather than shipping a built-in parser that handles some cases and silently fails on others, Feedsmith returns date strings as-is and lets you bring your own parsing logic via the `parseDateFn` option. This way you can use whichever date library (or the native `Date` constructor) fits your needs and handle edge cases on your terms.

The function receives the raw (trimmed) date string and its return value replaces it in the result.

### Using `Date` constructor

```typescript
import { parseFeed } from 'feedsmith'

const { feed } = parseFeed(xml, {
  parseDateFn: (raw) => new Date(raw),
})

feed.pubDate // Date
```

### Using a date library

```typescript
import { parseRssFeed } from 'feedsmith'
import { parse } from 'date-fns'

const feed = parseRssFeed(xml, {
  parseDateFn: (raw) => parse(raw, 'EEE, dd MMM yyyy HH:mm:ss xx', new Date()),
})

feed.pubDate // Date
```

### Type safety with `TDate`

All parse functions accept a generic `TDate` parameter that defaults to `string`. When `parseDateFn` is provided, `TDate` is inferred from its return type, so all date fields in the result are typed accordingly:

```typescript
import { parseAtomFeed } from 'feedsmith'

// Without parseDateFn — dates are strings.
const feed = parseAtomFeed(xml)
feed.updated // string | undefined

// With parseDateFn — dates match the return type.
const feed = parseAtomFeed(xml, {
  parseDateFn: (raw) => new Date(raw),
})
feed.updated // Date | undefined
```

### Scope

`parseDateFn` applies to **all** date fields across the feed, items, and every namespace (Dublin Core, DCTerms, Podcast, PRISM, Syndication, etc.).

### Error handling

Errors thrown by `parseDateFn` are not caught — they propagate to the caller. If a date string is empty or whitespace-only, `parseDateFn` is not called and the field is omitted from the result.
