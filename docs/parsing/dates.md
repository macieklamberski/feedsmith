---
title: "Parsing Feeds: Parsing Dates"
---

# Parsing Dates

Dates in feeds do not always follow a format defined in the specifications, or even any consistent format. Instead of attempting to parse all of them and risking errors, Feedsmith returns dates in their original string form by default.

### Common Issues

- **RSS**: Should use RFC 2822 format, but many feeds use incorrect formats
- **Atom**: ISO 8601/RFC 3339 format, generally more consistent but still varies
- **Real-world problems**:
  - Missing timezone information
  - Invalid day/month combinations
  - Inconsistent formatting within the same feed
  - Localized date strings
  - Custom date formats

## Custom Date Parsing

Use the `parseDateFn` option to convert date strings into any format. The function receives the raw (trimmed) date string and its return value is used in the result.

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
