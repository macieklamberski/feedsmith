---
title: Migrating from 2.x to 3.x
---

# Migrating from 2.x to 3.x

This guide covers all breaking changes when upgrading from Feedsmith 2.x to 3.x. Each breaking change is detailed with specific upgrade steps and examples.

> [!IMPORTANT]
> Version 3.x inverts the default behavior: feeds are now lenient by default (all fields optional), with strict mode available as an opt-in via `{ strict: true }`.

## Installation

Update your package to the latest 3.x version:

```bash
npm install feedsmith@latest
```

## Breaking Changes

### Strict Mode Now Opt-In

In 2.x, generate functions enforced spec-required fields by default and required `{ lenient: true }` to make all fields optional. In 3.x, this is inverted: all fields are optional by default and `{ strict: true }` enables compile-time validation of spec-required fields.

#### Before (2.x)
```typescript
import { generateRssFeed } from 'feedsmith'

// Strict mode (default) - required fields and Date objects
const xml = generateRssFeed({
  title: 'My Blog',
  description: 'A blog about things',
  pubDate: new Date('2024-01-01'),
})

// Lenient mode - all optional, string dates accepted
const xml = generateRssFeed({
  title: 'My Blog',
  pubDate: '2024-01-01T00:00:00Z',
}, { lenient: true })
```

#### After (3.x)
```typescript
import { generateRssFeed } from 'feedsmith'

// Lenient mode (default) - all optional, string dates accepted
const xml = generateRssFeed({
  title: 'My Blog',
  pubDate: '2024-01-01T00:00:00Z',
})

// Strict mode - required fields and Date objects
const xml = generateRssFeed({
  title: 'My Blog',
  description: 'A blog about things',
  pubDate: new Date('2024-01-01'),
}, { strict: true })
```

#### Migration Steps
1. Remove `{ lenient: true }` from all generate function calls (it's now the default)
2. Add `{ strict: true }` if you want to preserve v2's default strict behavior

### `DeepPartial` Type Removed

The `DeepPartial` utility type is no longer exported from `feedsmith/types`. Since all type fields are now optional by default, this type is no longer needed.

#### Before (2.x)
```typescript
import type { DeepPartial, Rss } from 'feedsmith/types'

const processFeed = (feed: DeepPartial<Rss.Feed<string>>) => {
  console.log(feed.title)
}
```

#### After (3.x)
```typescript
import type { Rss } from 'feedsmith/types'

// All fields already optional - DeepPartial not needed
const processFeed = (feed: Rss.Feed<string>) => {
  console.log(feed.title)
}
```

#### Migration Steps
1. Remove `DeepPartial` from your imports
2. Use base types directly (`Rss.Feed`, `Atom.Feed`, etc.)

### All Type Fields Now Optional by Default

Previously required fields in type definitions are now optional by default. Use strict mode types if you need compile-time enforcement.

#### Before (2.x)
```typescript
import type { Rss } from 'feedsmith/types'

// TypeScript enforced required fields
const feed: Rss.Feed<Date> = {
  title: 'My Blog',
  description: 'Required by type',
  // link was already optional
}

// Items required title OR description
const item: Rss.Item<Date> = {
  title: 'Post Title', // Required by discriminated union
}
```

#### After (3.x)
```typescript
import type { Rss } from 'feedsmith/types'

// All fields optional by default
const feed: Rss.Feed<Date> = {
  title: 'My Blog',
  // description no longer required by type
}

// Items have all optional fields
const item: Rss.Item<Date> = {
  // No fields required by type
}

// Use strict type parameter for compile-time enforcement
const strictFeed: Rss.Feed<Date, Rss.Person, true> = {
  title: 'My Blog',
  description: 'Required in strict mode',
}
```

#### Migration Steps
1. If you relied on TypeScript to enforce required fields, add `true` as the last type parameter
2. Alternatively, add runtime validation for required fields

### Media Namespace: Deprecated Field Removed

The deprecated `group` field has been removed from `MediaNs.ItemOrFeed` to align with the [Media RSS specification](https://www.rssboard.org/media-rss):
- `group` → `groups` (spec allows multiple `media:group` elements)

#### Before (2.x)
```typescript
import type { MediaNs } from 'feedsmith/types'

const media: MediaNs.ItemOrFeed = {
  group: {
    contents: [{ url: 'https://example.com/video.mp4' }],
  },
}
```

#### After (3.x)
```typescript
import type { MediaNs } from 'feedsmith/types'

const media: MediaNs.ItemOrFeed = {
  groups: [
    {
      contents: [{ url: 'https://example.com/video.mp4' }],
    },
  ],
}
```

#### Migration Steps
1. Replace `group` with `groups` (wrap the object in an array)
2. If you were accessing `media.group`, change to `media.groups?.[0]`

### Podcast Namespace: Deprecated Fields Removed

Deprecated fields have been removed from `PodcastNs.Item` and `PodcastNs.Feed` to align with the [Podcasting 2.0 specification](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md):

- `location` → `locations` (spec allows multiple `podcast:location` elements)
- `value` → `values` (spec allows multiple `podcast:value` elements)
- `chats` → `chat` (spec allows only one `podcast:chat` element)

#### Before (2.x)
```typescript
import type { PodcastNs } from 'feedsmith/types'

const podcast: PodcastNs.Item = {
  location: { name: 'New York' },
  value: { type: 'lightning', method: 'keysend' },
  chats: [{ server: 'irc.example.com', protocol: 'irc' }],
}
```

#### After (3.x)
```typescript
import type { PodcastNs } from 'feedsmith/types'

const podcast: PodcastNs.Item = {
  locations: [{ name: 'New York' }],
  values: [{ type: 'lightning', method: 'keysend' }],
  chat: { server: 'irc.example.com', protocol: 'irc' },
}
```

#### Migration Steps
1. Replace `location` with `locations` (wrap in array)
2. Replace `value` with `values` (wrap in array)
3. Replace `chats` with `chat` (use `chats[0]` if you had multiple)

## New Features

### Improved Error Handling

Parsing functions now throw dedicated error types for better error handling:

- `DetectError` — thrown when input doesn't match the expected feed format
- `ParseError` — thrown when XML parsing fails

Additionally, the new `detailedErrors` option provides line and column numbers for XML errors:

```typescript
import { parseRssFeed, DetectError, ParseError } from 'feedsmith'

try {
  parseRssFeed('<rss><invalid', { detailedErrors: true })
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.line)   // 1
    console.log(error.column) // 14
  }
}
```

See [Error Handling](/parsing/errors) for more details.

### XML Namespace Support

RSS, Atom, and RDF feeds now support the [XML namespace](/reference/namespaces/xml) (`xml:*` attributes). The `xml` property is available on both feed and item levels, providing access to `xml:lang`, `xml:base`, `xml:space`, and `xml:id` attributes.

## Migration Checklist

Use this checklist to ensure a complete migration:

- Remove `{ lenient: true }` from all generate function calls
- Add `{ strict: true }` where you need compile-time validation of required fields
- Remove `DeepPartial` from imports
- Update type parameters if using strict types directly (add `true` as last parameter)
- Replace Media namespace deprecated field (`group` → `groups`)
- Replace Podcast namespace deprecated fields (`location` → `locations`, `value` → `values`, `chats` → `chat`)
- Test feed generation to ensure output is correct
- Update error handling to use `DetectError` and `ParseError` instead of generic `Error`
