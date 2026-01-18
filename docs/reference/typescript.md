---
title: "Reference: Working with TypeScript"
---

# Working with TypeScript

Feedsmith is built with TypeScript and provides comprehensive type definitions for all feed formats and namespaces.

## Importing Types

All types are available through the `feedsmith/types` export:

```typescript
import type { Rss, Atom, Json, Rdf, Opml } from 'feedsmith/types'
```

Each namespace contains the complete type system for that format:

```typescript
// RSS types
type Feed = Rss.Feed
type Item = Rss.Item
type Category = Rss.Category
type Enclosure = Rss.Enclosure

// Atom types
type AtomFeed = Atom.Feed
type Entry = Atom.Entry
type Link = Atom.Link

// JSON Feed types
type JsonFeed = Json.Feed
type JsonItem = Json.Item
type Author = Json.Author

// RDF types
type RdfFeed = Rdf.Feed

// OPML types
type Document = Opml.Document
type Outline = Opml.Outline
```

## Using Types with Parsing

When parsing, dates are returned as strings. Use `<string>` for the generic parameter:

```typescript
import type { Rss } from 'feedsmith/types'
import { parseRssFeed } from 'feedsmith'

const feed: Rss.Feed<string> = parseRssFeed(xmlContent)

// Access properties with full type safety
feed.title // string | undefined
feed.pubDate // string | undefined
feed.items?.[0]?.enclosures // Enclosure[] | undefined
```

> [!NOTE]
> Explicit typing is usually not required when parsing since the parse functions already return properly typed objects. TypeScript will automatically infer the correct types.

## Using Types with Generating

When generating, you can use `Date` objects. Use `<Date>` for the generic parameter:

```typescript
import type { Rss } from 'feedsmith/types'
import { generateRssFeed } from 'feedsmith'

const feed: Rss.Feed<Date> = {
  title: 'My Podcast',
  link: 'https://example.com',
  description: 'A great podcast',
  pubDate: new Date(),
  items: [{
    title: 'Episode 1',
    description: 'First episode',
    enclosures: [{
      url: 'https://example.com/ep1.mp3',
      length: 12345678,
      type: 'audio/mpeg'
    }]
  }]
}

const xml = generateRssFeed(feed)
```

<!-- TODO: Add example for working with namespaces. -->

## Complete Example

Here's an example on how you can utilize the types for sub-elements of the RSS feed while generating a podcast feed:

```typescript
import type { Rss } from 'feedsmith/types'
import { generateRssFeed } from 'feedsmith'

const items: Array<Rss.Item<Date>> = [{
  title: 'Episode 1: Introduction',
  description: 'Getting started with TypeScript',
  pubDate: new Date('2024-01-15T10:00:00Z'),
  enclosures: [{
    url: 'https://mypodcast.com/ep1.mp3',
    length: 45678901,
    type: 'audio/mpeg'
  }],
  itunes: {
    duration: '01:15:30',
    episode: 1,
    explicit: false
  }
}]

const feed: Rss.Feed<Date> = {
  title: 'My TypeScript Podcast',
  link: 'https://mypodcast.com',
  description: 'A podcast about TypeScript',
  language: 'en-us',
  pubDate: new Date(),
  itunes: {
    author: 'John Doe',
    owner: {
      name: 'John Doe',
      email: 'john@mypodcast.com'
    },
    image: 'https://mypodcast.com/artwork.jpg',
    category: [{ name: 'Technology' }],
    explicit: false
  },
  items
}

const xml = generateRssFeed(feed)
```

## The TDate Parameter {#tdate}

The `TDate` generic parameter indicates how dates are represented in the typed objects. This differentiation is needed as Feedsmith intentionally does not parse dates (see [Handling Dates](/parsing/dates)).

In general, use:
- `Type<string>` when parsing
- `Type<Date>` when generating

```typescript
// Parsing - dates are strings
const parsed: Rss.Feed<string> = parseRssFeed(xml)

// Generating - dates are Date objects
const generated: Rss.Feed<Date> = {
  title: 'Feed',
  link: 'https://example.com',
  description: 'Description',
  pubDate: new Date(), // Must be Date
  items: []
}
```

## The TStrict Parameter {#tstrict}

The `TStrict` generic parameter controls whether specification-required fields are enforced at compile time. When you pass `{ strict: true }` to generate functions, TypeScript uses the strict variant of the type, making required fields mandatory.

See [Strict Mode](/generating/strict-mode) for usage details.

### Requirable Markers {#requirable}

In type definitions, fields wrapped in `Requirable<T>` become mandatory when strict mode is enabled:

```typescript
// Type definition (simplified)
type Enclosure<TStrict> = Strict<{
  url: Requirable<string>     // Required in strict mode
  length: Requirable<number>  // Required in strict mode
  type: Requirable<string>    // Required in strict mode
}, TStrict>
```

Look for `Requirable<...>` in reference documentation to identify which fields become required in strict mode.
