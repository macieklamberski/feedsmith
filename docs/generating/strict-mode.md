---
prev: Generating › Styling
next: Generating › Examples
---

# Strict Mode

Enable compile-time validation of required fields when generating feeds.

## Overview

By default, Feedsmith is lenient - all fields are optional to accommodate real-world feeds that may not follow specifications exactly. Strict mode enforces specification-required fields at compile time, catching missing data before runtime.

```typescript
import { generateRssFeed } from 'feedsmith'

// Lenient mode (default) - compiles fine even with missing required fields
const rss = generateRssFeed({ title: 'My Feed' })

// Strict mode - TypeScript error if required fields are missing
const rss = generateRssFeed(
  {
    title: 'My Feed',
    link: 'https://example.com',
    description: 'A complete feed'
  },
  { strict: true }
)
```

## Enabling Strict Mode

Pass `strict: true` in the options to enable compile-time validation:

```typescript
import {
  generateRssFeed,
  generateAtomFeed,
  generateJsonFeed,
  generateOpml
} from 'feedsmith'

// RSS with strict mode
const rss = generateRssFeed(feedData, { strict: true })

// Atom with strict mode
const atom = generateAtomFeed(feedData, { strict: true })

// JSON Feed with strict mode
const json = generateJsonFeed(feedData, { strict: true })

// OPML with strict mode
const opml = generateOpml(opmlData, { strict: true })
```

## Date Objects Required

In strict mode, date fields must be JavaScript `Date` objects, not strings:

```typescript
// Lenient mode - strings work fine
generateRssFeed({
  title: 'Feed',
  link: 'https://example.com',
  description: 'Description',
  pubDate: '2024-01-01T00:00:00Z' // String dates allowed
})

// Strict mode - must use Date objects
generateRssFeed(
  {
    title: 'Feed',
    link: 'https://example.com',
    description: 'Description',
    pubDate: new Date('2024-01-01') // Date object required
  },
  { strict: true }
)
```

## Required Fields

See the reference documentation for required fields in strict mode:

- [RSS Reference](/reference/feeds/rss#type-definitions)
- [Atom Reference](/reference/feeds/atom#type-definitions)
- [JSON Feed Reference](/reference/feeds/json-feed#type-definitions)
- [OPML Reference](/reference/opml#type-definitions)

Some namespaces also have required fields for their nested types. Look for `Requirable<...>` in type definitions to identify fields that become required in strict mode.

## Combining with Other Options

Strict mode can be combined with other generation options:

```typescript
generateRssFeed(
  {
    title: 'My Feed',
    link: 'https://example.com',
    description: 'A complete feed',
    items: []
  },
  {
    strict: true,
    stylesheets: [{ type: 'text/xsl', href: '/feed.xsl' }]
  }
)
```

## When to Use Strict Mode

**Use strict mode when:**
- Building new feeds from scratch where you control all data
- You want TypeScript to catch missing required fields
- Following specifications precisely matters for your use case

**Use lenient mode (default) when:**
- Processing feeds from external sources
- Migrating existing feeds that may be incomplete

## Related

- **[Generating Feeds](/generating/)** - Overview of feed generation
- **[TypeScript Guide](/reference/typescript)** - Working with Feedsmith types
