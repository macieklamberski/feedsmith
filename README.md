# Feedsmith

[![codecov](https://codecov.io/gh/macieklamberski/feedsmith/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/feedsmith)
[![npm version](https://img.shields.io/npm/v/feedsmith.svg)](https://www.npmjs.com/package/feedsmith)
[![license](https://img.shields.io/npm/l/feedsmith.svg)](https://github.com/macieklamberski/feedsmith/blob/main/LICENSE)

Fast, all‑in‑one JavaScript feed parser and generator for RSS, Atom, RDF, and JSON Feed, with support for popular namespaces and OPML files.

Feedsmith offers universal and format‑specific parsers that maintain the original feed structure in a clean, object-oriented format while intelligently normalizing legacy elements. Access all feed data without compromising simplicity.

**[Read full docs ↗](https://feedsmith.dev)**
&nbsp;&nbsp;·&nbsp;&nbsp;
[Quick Start](#quick-start)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Why Feedsmith?](#why-feedsmith)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Benchmarks →](benchmarks/README.md)

---

> [!IMPORTANT]
> **Feedsmith 3.x is in final stages of development.** Check out the [v3.x guide](https://next.feedsmith.dev/migration/v2-to-v3) to explore new features and learn how to upgrade. Install it with:
>
> `npm install feedsmith@next`

---

## Features

### Core

* **Comprehensive support** — Supports all major feed formats and namespaces.
* **Preserves structure** — Parsed feed object maintains the original feed structure making it easy to access the data.
* **Smart namespace handling** — Normalizes custom namespace prefixes to standard ones (e.g., `<custom:creator>` becomes `dc.creator`).
* **Parsing & generating** — Use one package for both parsing and generating feeds.

### Leniency
* **Normalizes legacy elements** — Upgrades feed elements to their modern equivalents so that you never need to worry about reading feeds in older formats.
* **CaSe INSENsiTive** — Handles fields and attributes in any case (lowercase, uppercase, mixed).
* **Namespace URI tolerance** — Accepts non-official namespace URIs (HTTPS variants, case variations, trailing slashes, whitespace).
* **Forgiving** — Gracefully handles malformed or incomplete feeds and extracts valid data. This makes it suitable for use with real-world feeds that may not strictly follow specifications.

### Performance
* **Ultrafast parsing** — One of the fastest JavaScript feed parsers ([see benchmarks](/benchmarks)).
* **Type-safe API** — Built with TypeScript from the ground up, it provides complete type definitions for every feed format and namespace.
* **Tree-shakable** — Only include the parts of the library you need, reducing bundle size.
* **Well-tested** — Comprehensive test suite with over 2000 tests and 99% code coverage.

### Compatibility
* Works in Node.js 14.0.0+ and modern browsers.
* Supports both CommonJS and ES modules.
* Works with plain JavaScript, you don't need to use TypeScript.

## Supported Formats

Feedsmith aims to fully support all major feed formats and namespaces in complete alignment with their specifications.

✅ Available
&nbsp;&nbsp;·&nbsp;&nbsp;
⌛️ Work in progress
&nbsp;&nbsp;·&nbsp;&nbsp;
📋 Planned

### Feeds

| Format | Versions | Parse | Generate |
|--------|----------|-------|----------|
| [RSS](https://feedsmith.dev/reference/feeds/rss) | 0.9x, 2.0 | ✅ | ✅ |
| [Atom](https://feedsmith.dev/reference/feeds/atom) | 0.3, 1.0 | ✅ | ✅ |
| [RDF](https://feedsmith.dev/reference/feeds/rdf) | 0.9, 1.0 | ✅ | 📋 |
| [JSON Feed](https://feedsmith.dev/reference/feeds/json) | 1.0, 1.1 | ✅ | ✅ |

### Other

| Format | Versions | Parse | Generate |
|--------|----------|-------|----------|
| [OPML](https://feedsmith.dev/reference/other/opml) | 1.0, 2.0 | ✅ | ✅ |

### Feed Namespaces

| Name | Prefix | Supported in | Parse | Generate |
|------|---------|--------------|-------|----------|
| [Atom](https://feedsmith.dev/reference/namespaces/atom) | `<atom:*>` | RSS, RDF | ✅ | ✅ |
| [Dublin Core](https://feedsmith.dev/reference/namespaces/dc) | `<dc:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Dublin Core Terms](https://feedsmith.dev/reference/namespaces/dcterms) | `<dcterms:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Syndication](https://feedsmith.dev/reference/namespaces/sy) | `<sy:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Content](https://feedsmith.dev/reference/namespaces/content) | `<content:*>` | RSS, RDF | ✅ | ✅ |
| [Slash](https://feedsmith.dev/reference/namespaces/slash) | `<slash:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [iTunes](https://feedsmith.dev/reference/namespaces/itunes) | `<itunes:*>` | RSS, Atom | ✅ | ✅ |
| [Podcast Index](https://feedsmith.dev/reference/namespaces/podcast) | `<podcast:*>` | RSS | ✅ | ✅ |
| [Podlove Simple Chapters](https://feedsmith.dev/reference/namespaces/psc) | `<psc:*>` | RSS, Atom | ✅ | ✅ |
| [Media RSS](https://feedsmith.dev/reference/namespaces/media) | `<media:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Google Play Podcast](https://feedsmith.dev/reference/namespaces/googleplay) | `<googleplay:*>` | RSS, Atom | ✅ | ✅ |
| [Spotify](https://feedsmith.dev/reference/namespaces/spotify) | `<spotify:*>` | RSS | ✅ | ✅ |
| [Acast](https://feedsmith.dev/reference/namespaces/acast) | `<acast:*>` | RSS | ✅ | ✅ |
| [RawVoice](https://feedsmith.dev/reference/namespaces/rawvoice) | `<rawvoice:*>` | RSS | ✅ | ✅ |
| [FeedPress](https://feedsmith.dev/reference/namespaces/feedpress) | `<feedpress:*>` | RSS | ✅ | ✅ |
| [arXiv](https://feedsmith.dev/reference/namespaces/arxiv) | `<arxiv:*>` | Atom | ✅ | ✅ |
| [OpenSearch](https://feedsmith.dev/reference/namespaces/opensearch) | `<opensearch:*>` | RSS, Atom | ✅ | ✅ |
| [PRISM](https://feedsmith.dev/reference/namespaces/prism) | `<prism:*>` | RSS | ✅ | ✅ |
| [ccREL](https://feedsmith.dev/reference/namespaces/cc) | `<cc:*>` | RSS, Atom | ✅ | ✅ |
| [Creative Commons](https://feedsmith.dev/reference/namespaces/creativecommons) | `<creativeCommons:*>` | RSS, Atom | ✅ | ✅ |
| [Atom Threading](https://feedsmith.dev/reference/namespaces/thr) | `<thr:*>` | RSS, Atom | ✅ | ✅ |
| [Atom Publishing Protocol](https://feedsmith.dev/reference/namespaces/app) | `<app:*>` | Atom | ✅ | ✅ |
| [Comment API](https://feedsmith.dev/reference/namespaces/wfw) | `<wfw:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Administrative](https://feedsmith.dev/reference/namespaces/admin) | `<admin:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Pingback](https://feedsmith.dev/reference/namespaces/pingback) | `<pingback:*>` | RSS, Atom | ✅ | ✅ |
| [Trackback](https://feedsmith.dev/reference/namespaces/trackback) | `<trackback:*>` | RSS, Atom | ✅ | ✅ |
| [Source](https://feedsmith.dev/reference/namespaces/source) | `<source:*>` | RSS | ✅ | ✅ |
| [blogChannel](https://feedsmith.dev/reference/namespaces/blogchannel) | `<blogChannel:*>` | RSS | ✅ | ✅ |
| [YouTube](https://feedsmith.dev/reference/namespaces/yt) | `<yt:*>` | Atom | ✅ | ✅ |
| [W3C Basic Geo](https://feedsmith.dev/reference/namespaces/geo) | `<geo:*>` | RSS, Atom | ✅ | ✅ |
| [GeoRSS Simple](https://feedsmith.dev/reference/namespaces/georss) | `<georss:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [RDF](https://feedsmith.dev/reference/namespaces/rdf) | `<rdf:*>` | RDF | ✅ | ✅ |

## Quick Start

This guide will get you up and running with Feedsmith in just a few minutes.

For a full overview of all the features, visit the [documentation website](https://feedsmith.dev).

### Installation

```bash
npm install feedsmith
```

> **Migrating from v1.x?** Check out the [migration guide](https://feedsmith.dev/migration-to-2.x).

### Parse Any Feed

The simplest way to parse any feed is to use the universal `parseFeed` function:

```typescript
import { parseFeed } from 'feedsmith'

// Works with RSS, Atom, RDF, and JSON Feed
const { format, feed } = parseFeed(feedContent)

console.log('Feed format:', format) // rss, atom, json, rdf
console.log('Feed title:', feed.title)

if (format === 'rss') {
  console.log('RSS feed link:', feed.link)
}
```

### Parse Specific Feed Formats

If you know the format in advance, you can use the format-specific parsers:

```typescript
import {
  parseAtomFeed,
  parseJsonFeed,
  parseRssFeed,
  parseRdfFeed
} from 'feedsmith'

// Parse specific formats
const rssFeed = parseRssFeed('rss content')
const atomFeed = parseAtomFeed('atom content')
const rdfFeed = parseRdfFeed('rdf content')
const jsonFeed = parseJsonFeed('json content')

// Access typed data
rssFeed.title
rssFeed.dc?.creator
rssFeed.items?.[0]?.title
```

### Parse OPML Files

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml('opml content')

opml.head?.title
opml.body?.outlines?.[0].text
opml.body?.outlines?.[1].xmlUrl
```

### Generate a Feed

```typescript
import { generateRssFeed } from 'feedsmith'

const rss = generateRssFeed({
  title: 'My Blog',
  link: 'https://example.com',
  description: 'A simple blog',
  items: [{
    title: 'Hello World',
    link: 'https://example.com/hello',
    description: 'My first post',
    pubDate: new Date()
  }]
})

console.log(rss) // Complete RSS XML

// You can also generate other formats:
// - generateAtomFeed() for Atom feeds
// - generateJsonFeed() for JSON feeds
// - generateOpml() for OPML files
```

### Error Handling

If the feed is unrecognized or invalid, an `Error` will be thrown with a descriptive message.

```typescript
import { parseFeed, parseJsonFeed } from 'feedsmith'

try {
  const universalFeed = parseFeed('<not-a-feed></not-a-feed>')
} catch (error) {
  // Error: Unrecognized feed format
}

try {
  const jsonFeed = parseJsonFeed('{}')
} catch (error) {
  // Error: Invalid feed format
}
```

### TypeScript Types

Feedsmith provides comprehensive TypeScript types for all feed formats:

```typescript
import type { Rss, Atom, Json, Opml } from 'feedsmith/types'

// Access all types for a format
type Feed = Rss.Feed
type Item = Rss.Item
type Category = Rss.Category
type Enclosure = Rss.Enclosure
```

## Why Feedsmith?

Why should you use this library over the alternatives?

The key advantage of Feedsmith is that it preserves the original feed structure exactly as defined in each specific feed format.

Many alternative packages attempt to normalize data by:

* Merging distinct fields like `author`, `dc:creator`, and `creator` into a single property.
* Combining date fields such as `dc:date` and `pubDate` without preserving their sources.
* Handling multiple `<atom:link>` elements inconsistently, sometimes keeping only the first or last one or ignoring different `rel` attributes.
* Some libraries try to combine different feed formats into one universal structure.

While this approach can be useful for quick reading of feed data, it often results in a loss of information that may be crucial for certain applications, such as reading data from specific namespaces.

## Acknowledgements

* The library API is inspired by the [FeedKit library for Swift](https://github.com/nmdias/FeedKit).
* XML parsing is provided by [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser).
* HTML entity decoding is handled by [entities](https://github.com/fb55/entities).
