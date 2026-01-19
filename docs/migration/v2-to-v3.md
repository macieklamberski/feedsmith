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

In version 2.x, generate functions enforced spec-required fields by default and to make all fields optional, it required passing `{ lenient: true }`. In 3.x, this is inverted: all fields are optional by default and `{ strict: true }` enables compile-time validation of spec-required fields.

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

### All Type Fields Now Optional by Default

Related to the above, previously required fields in type definitions are now optional by default. Pass `true` as the strict type parameter if you need compile-time enforcement.

#### Before (2.x)
```typescript
import type { Atom } from 'feedsmith/types'

// TypeScript enforced required fields
const entry: Atom.Entry<Date> = {
  id: 'https://example.com/post/1',
  title: 'Post Title',
  updated: new Date('2024-01-01'),
}
```

#### After (3.x)
```typescript
import type { Atom } from 'feedsmith'

// All fields optional by default
const entry: Atom.Entry<Date> = {
  title: 'Post Title',
}

// Pass `true` for compile-time enforcement
const strictEntry: Atom.Entry<Date, true> = {
  id: 'https://example.com/post/1',
  title: 'Post Title',
  updated: new Date('2024-01-01'),
}
```

#### Migration Steps
1. If you relied on TypeScript to enforce required fields, add `true` as the last type parameter
2. Alternatively, add runtime validation for required fields

### `DeepPartial` Type Removed

The `DeepPartial` utility type has been removed. Since all type fields are now optional by default, this type is no longer needed.

#### Before (2.x)
```typescript
import type { DeepPartial, Rss } from 'feedsmith/types'

const processFeed = (feed: DeepPartial<Rss.Feed<string>>) => {
  console.log(feed.title)
}
```

#### After (3.x)
```typescript
import type { Rss } from 'feedsmith'

// All fields already optional - DeepPartial not needed
const processFeed = (feed: Rss.Feed<string>) => {
  console.log(feed.title)
}
```

#### Migration Steps
1. Remove `DeepPartial` from your imports
2. Use base types directly (`Rss.Feed`, `Atom.Feed`, etc.)

### Types Entry Point Removed

The `feedsmith/types` entry point has been removed. All types are now exported from the main `feedsmith` entry point. Additionally, deprecated type aliases (`RssFeed`, `AtomFeed`, `JsonFeed`, `RdfFeed`, `Opml`) have been removed.

#### Before (2.x)
```typescript
import type { Rss } from 'feedsmith/types'
import { parseRssFeed } from 'feedsmith'
```

#### After (3.x)
```typescript
import { type Rss, parseRssFeed } from 'feedsmith'
```

#### Migration Steps
1. Change `feedsmith/types` imports to `feedsmith`
2. Replace deprecated type aliases: `RssFeed` → `Rss.Feed`, `AtomFeed` → `Atom.Feed`, etc.

### Media Namespace: Deprecated Field Removed

The deprecated `group` field has been removed to align with the [Media RSS specification](https://www.rssboard.org/media-rss):
- `group` → `groups` (spec allows multiple `media:group` elements)

#### Before (2.x)
```typescript
const feed = parseRssFeed(xml)
const group = feed.media?.group
```

#### After (3.x)
```typescript
const feed = parseRssFeed(xml)
const group = feed.media?.groups?.[0]
```

#### Migration Steps
1. Replace `group` with `groups`
2. Access the first element: `media.group` → `media.groups?.[0]`

### Podcast Namespace: Deprecated Fields Removed

Deprecated fields have been removed to align with the [Podcasting 2.0 specification](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md):

- `location` → `locations` (spec allows multiple `podcast:location` elements)
- `value` → `values` (spec allows multiple `podcast:value` elements)
- `chats` → `chat` (spec allows only one `podcast:chat` element)

#### Before (2.x)
```typescript
const feed = parseRssFeed(xml)
const location = feed.items?.[0]?.podcast?.location
const value = feed.items?.[0]?.podcast?.value
const chat = feed.items?.[0]?.podcast?.chats?.[0]
```

#### After (3.x)
```typescript
const feed = parseRssFeed(xml)
const location = feed.items?.[0]?.podcast?.locations?.[0]
const value = feed.items?.[0]?.podcast?.values?.[0]
const chat = feed.items?.[0]?.podcast?.chat
```

#### Migration Steps
1. Replace `location` with `locations` (wrap in array)
2. Replace `value` with `values` (wrap in array)
3. Replace `chats` with `chat` (use `chats[0]` if you had multiple)

### Dublin Core Namespace: Singular Fields Removed

Deprecated singular fields have been removed to align with the [Dublin Core specification](https://www.dublincore.org/specifications/dublin-core/dces/) where all elements are repeatable:

- `title` → `titles`
- `creator` → `creators`
- `subject` → `subjects`
- `description` → `descriptions`
- `publisher` → `publishers`
- `contributor` → `contributors`
- `date` → `dates`
- `type` → `types`
- `format` → `formats`
- `identifier` → `identifiers`
- `source` → `sources`
- `language` → `languages`
- `relation` → `relations`
- `coverage` (now array)
- `rights` (now array)

#### Before (2.x)
```typescript
const feed = parseRssFeed(xml)
const title = feed.dc?.title
const creator = feed.dc?.creator
const coverage = feed.dc?.coverage
```

#### After (3.x)
```typescript
const feed = parseRssFeed(xml)
const title = feed.dc?.titles?.[0]
const creator = feed.dc?.creators?.[0]
const coverage = feed.dc?.coverage?.[0]
```

#### Migration Steps
1. Replace singular fields with plural equivalents (e.g., `dc.title` → `dc.titles?.[0]`)
2. Fields that kept their name (`coverage`, `rights`) are now arrays: `dc.coverage` → `dc.coverage?.[0]`

### Dublin Core Terms Namespace: Singular Fields Removed

Deprecated singular fields have been removed to align with the [Dublin Core Terms specification](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) where all elements are repeatable:

- `title` → `titles`
- `creator` → `creators`
- `subject` → `subjects`
- `description` → `descriptions`
- `publisher` → `publishers`
- `contributor` → `contributors`
- `date` → `dates`
- `type` → `types`
- `format` → `formats`
- `identifier` → `identifiers`
- `source` → `sources`
- `language` → `languages`
- `relation` → `relations`
- `abstract` → `abstracts`
- `audience` → `audiences`
- `alternative` → `alternatives`
- `educationLevel` → `educationLevels`
- `extent` → `extents`
- `hasFormat` → `hasFormats`
- `hasPart` → `hasParts`
- `hasVersion` → `hasVersions`
- `instructionalMethod` → `instructionalMethods`
- `license` → `licenses`
- `mediator` → `mediators`
- `medium` → `mediums`
- `provenance` → `provenances`
- `rightsHolder` → `rightsHolders`
- `spatial` → `spatials`
- `temporal` → `temporals`
- `accrualMethod` → `accrualMethods`
- `accrualPeriodicity` → `accrualPeriodicities`
- `accrualPolicy` → `accrualPolicies`
- `bibliographicCitation` → `bibliographicCitations`
- Plus 21 fields that kept their name but are now arrays (e.g., `created`, `modified`, `issued`, `valid`)

#### Before (2.x)
```typescript
const feed = parseRssFeed(xml)
const title = feed.dcterms?.title
const creator = feed.dcterms?.creator
const created = feed.dcterms?.created
```

#### After (3.x)
```typescript
const feed = parseRssFeed(xml)
const title = feed.dcterms?.titles?.[0]
const creator = feed.dcterms?.creators?.[0]
const created = feed.dcterms?.created?.[0]
```

#### Migration Steps
1. Replace singular fields with plural equivalents (e.g., `dcterms.title` → `dcterms.titles?.[0]`)
2. Fields that kept their name (e.g., `created`, `modified`) are now arrays: `dcterms.created` → `dcterms.created?.[0]`

## New Features

### XML Namespace Support

Version 3.x adds support for the [XML namespace](/reference/namespaces/xml) (`xml:*` attributes) in RSS, Atom, and RDF feeds. The `xml` property is available on both feed and item levels, providing access to `xml:lang`, `xml:base`, `xml:space`, and `xml:id` attributes.

## Migration Checklist

Use this checklist to ensure a complete migration:

- Remove `{ lenient: true }` from all generate function calls
- Add `{ strict: true }` where you need compile-time validation of required fields
- Update type parameters if using strict types directly (add `true` as last parameter)
- Remove `DeepPartial` from imports
- Change `feedsmith/types` imports to `feedsmith`
- Replace Media namespace deprecated field (`group` → `groups`)
- Replace Podcast namespace deprecated fields (`location` → `locations`, `value` → `values`, `chats` → `chat`)
- Replace Dublin Core singular fields with plural arrays (e.g., `title` → `titles`)
- Replace Dublin Core Terms singular fields with plural arrays (e.g., `title` → `titles`)
- Test feed generation to ensure output is correct
