# Migration from 1.x to 2.x

This guide covers all breaking changes and new features when upgrading from Feedsmith 1.x to 2.x. Each breaking change is detailed with specific upgrade steps and examples.

> [!IMPORTANT]
> Version 2.x introduces significant improvements including enhanced type safety, comprehensive feed generation support, and better namespace handling. However, it includes several breaking changes that require code updates.

## Installation

Update your package to the latest 2.x version:

```bash
npm install feedsmith@latest
```

## Breaking Changes

### `parseFeed` Return Type Property Rename

The `parseFeed` function now returns `format` instead of `type` to better align with industry terminology.

#### Before (1.x)
```typescript
import { parseFeed } from 'feedsmith'

const result = parseFeed(feedContent)
console.log(result.type) // rss, atom, json, rdf
```

#### After (2.x)
```typescript
import { parseFeed } from 'feedsmith'

const result = parseFeed(feedContent)
console.log(result.format) // rss, atom, json, rdf
```

#### Migration Steps
1. Replace all instances of `result.type` with `result.format`

### RSS GUID Structure Change

RSS feed item GUIDs are now structured objects instead of plain strings to properly handle the `isPermaLink` attribute.

#### Before (1.x)
```typescript
const rssFeed = parseRssFeed(content)
const guid = rssFeed.items?.[0]?.guid // string
```

#### After (2.x)
```typescript
const rssFeed = parseRssFeed(content)
const guid = rssFeed.items?.[0]?.guid?.value // string
const isPermaLink = rssFeed.items?.[0]?.guid?.isPermaLink // boolean | undefined
```

#### Migration Steps
1. Replace `item.guid` with `item.guid?.value` when accessing the GUID string
2. Use `item.guid?.isPermaLink` to check if the GUID is a permalink

### Podcast Namespace `contentLink` Casing

The `contentlink` elements in the Podcast namespace are now properly cased as `contentLink`.

#### Before (1.x)
```typescript
const contentLinks = feed.podcast?.contentlink // lowercase
```

#### After (2.x)
```typescript
const contentLinks = feed.podcast?.contentLink // camelCase
```

#### Migration Steps
1. Update access to podcast content links from `contentlink` to `contentLink`
2. This affects RSS feeds using the Podcast namespace

### Enhanced Type System

The type system has been significantly enhanced with generic types and stricter type safety.

#### Before (1.x)
```typescript
// Simple type definitions
interface RssFeed {
  title: string
  items: RssItem[]
}
```

#### After (2.x)
```typescript
// Generic type system with DateLike parameter
type RssFeed<TDate extends DateLike = string> = DeepPartial<{
  title: string
  items: RssItem<TDate>[]
  // All fields are now optional at type level
}>
```

#### Migration Steps
1. All feed properties are now properly typed as optional, reflecting real-world feed variability
2. Use optional chaining (`?.`) when accessing feed properties
3. Consider using type guards for critical properties
4. The enhanced typing may reveal previously hidden bugs in your code

### RSS Enclosure Structure Change

RSS feed items now support multiple enclosures as an array instead of a single enclosure object.

#### Before (1.x)
```typescript
const rssFeed = parseRssFeed(content)
const enclosure = rssFeed.items?.[0]?.enclosure // single Enclosure object
if (enclosure) {
  console.log(enclosure.url)
  console.log(enclosure.type)
  console.log(enclosure.length)
}
```

#### After (2.x)
```typescript
const rssFeed = parseRssFeed(content)
const enclosures = rssFeed.items?.[0]?.enclosures // Array<Enclosure>
if (enclosures?.length) {
  console.log(enclosures[0].url)
  console.log(enclosures[0].type)
  console.log(enclosures[0].length)
}
```

#### Migration Steps
1. Replace `item.enclosure` with `item.enclosures?.[0]` for single enclosure access
2. Update code to handle multiple enclosures by iterating over the `enclosures` array
3. Check for array length instead of truthy enclosure object

## New Features

### Comprehensive Feed Generation

Version 2.x introduces complete feed generation support:

```typescript
import {
  generateRssFeed,
  generateAtomFeed,
  generateJsonFeed,
  generateOpml
} from 'feedsmith'

// Generate RSS feed
const rss = generateRssFeed({
  title: 'My Blog',
  link: 'https://example.com',
  description: 'A blog about development',
  items: [/* items */]
})

// Generate Atom feed
const atom = generateAtomFeed({
  id: 'https://example.com/feed',
  title: 'My Blog',
  updated: new Date(),
  entries: [/* entries */]
})
```

### Stylesheet Support

Add stylesheets to generated XML feeds:

```typescript
const rss = generateRssFeed(feedData, {
  stylesheets: [{
    type: 'text/xsl',
    href: '/feed.xsl'
  }]
})
```

### Enhanced Namespace Support

New namespaces have been added:

- **Dublin Core Terms (`dcterms`)**: Extended metadata support
- **Well-Formed Web (`wfw`)**: Comment API support
- **YouTube (`yt`)**: YouTube-specific extensions

```typescript
// Access new namespace data
const feed = parseRssFeed(content)
console.log(feed.dcterms?.created)
console.log(feed.wfw?.commentRss)
console.log(feed.yt?.channelId)
```

### Automatic Namespace Normalization

Custom namespace prefixes are automatically normalized to standard ones:

```typescript
// Input: <custom:creator>John Doe</custom:creator>
// Automatically becomes: feed.dc.creator
```

## Migration Checklist

Use this checklist to ensure a complete migration:

- Update `result.type` to `result.format` in all `parseFeed` calls
- Change `item.guid` to `item.guid?.value` for RSS feeds
- Change `item.enclosure` to `item.enclosures?.[0]` for RSS feeds
- Change `podcast.contentlink` to `podcast.contentLink`
- Add optional chaining (`?.`) for all feed property access
- Test with your existing feeds to ensure proper parsing
- Consider utilizing new generation features
- Explore enhanced namespace support for richer data access
