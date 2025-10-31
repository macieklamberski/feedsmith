---
prev: Quick Start
next: Benchmarks
---

# TypeScript

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

### Working with DeepPartial

The `DeepPartial` type recursively makes all properties optional, including nested objects and arrays. This accurately represents the reality of parsed feeds where any field might be missing.

Use it to recreate the same type that parse functions return:

```typescript
import type { Rss, DeepPartial } from 'feedsmith/types'
import { parseRssFeed } from 'feedsmith'

const feed = parseRssFeed(xmlContent)

function processFeed(feed: DeepPartial<Rss.Feed<string>>) {
  console.log(feed.title) // string | undefined
}

function processItem(item: DeepPartial<Rss.Item<string>>) {
  console.log(item.title) // string | undefined
}

processFeed(feed)
```

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

## The TDate Parameter

The `TDate` generic parameter indicates how dates are represented in feed the typed objects. This differentiation is currently needed as Feedsmith intentionally does not parse dates ([see related page in the docs](/parsing/dates)).

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
