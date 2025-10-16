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

## Features

### Core

* **Comprehensive support** 🎯 — Supports all major feed formats and namespaces.
* **Preserves structure** 📦 — Parsed feed object maintains the original feed structure making it easy to access the data.
* **Smart namespace handling** 🧠 — Normalizes custom namespace prefixes to standard ones (e.g., `<custom:creator>` becomes `dc.creator`).
* **Parsing & generating** 🔩 — Use one package for both parsing and generating feeds.

### Leniency
* **Normalizes legacy elements** ✨ — Upgrades feed elements to their modern equivalents so that you never need to worry about reading feeds in older formats.
* **CaSe INSENsiTive** 🐍 — Handles fields and attributes in any case (lowercase, uppercase, mixed).
* **Namespace URI tolerance** 🔧 — Accepts non-official namespace URIs (HTTPS variants, case variations, trailing slashes, whitespace).
* **Forgiving** 🤝 — Gracefully handles malformed or incomplete feeds and extracts valid data. This makes it suitable for use with real-world feeds that may not strictly follow specifications.

### Performance and Type-Safety
* **Ultrafast parsing** ⚡ — One of the fastest JavaScript feed parsers ([see benchmarks](/benchmarks)).
* **Type-safe API** 🛟 — Built with TypeScript from the ground up, it provides complete type definitions for every feed format and namespace.
* **Tree-shakable** 🍃 — Only include the parts of the library you need, reducing bundle size.
* **Well-tested** 🔬 — Comprehensive test suite with over 2000 tests and 99% code coverage.

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

| Format | Versions | Parsing | Generating |
|--------|----------|---------|------------|
| [RSS](http://cyber.law.harvard.edu/rss/rss.html) | 0.9x, 2.0 | ✅ | ✅ |
| [Atom](https://tools.ietf.org/html/rfc4287) | 0.3, 1.0 | ✅ | ✅ |
| [RDF](https://web.resource.org/rss/1.0/spec) | 0.9, 1.0 | ✅ | ⏳ |
| [JSON Feed](https://jsonfeed.org) | 1.0, 1.1 | ✅ | ✅ |

### Namespaces

| Name | Prefix | Supported in | Parsing | Generating |
|------|---------|--------------|---------|------------|
| [Atom](http://www.w3.org/2005/Atom) | `<atom:*>` | RSS, RDF | ✅ | ✅ |
| [Dublin Core](http://purl.org/dc/elements/1.1/) | `<dc:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Syndication](http://purl.org/rss/1.0/modules/syndication/) | `<sy:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Content](http://purl.org/rss/1.0/modules/content/) | `<content:*>` | RSS, RDF | ✅ | ✅ |
| [Slash](http://purl.org/rss/1.0/modules/slash/) | `<slash:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [iTunes](http://www.itunes.com/dtds/podcast-1.0.dtd) | `<itunes:*>` | RSS, Atom | ✅ | ✅ |
| [Podcast](https://podcastindex.org/namespace/1.0) | `<podcast:*>` | RSS | ✅ | ✅ |
| [RawVoice](https://blubrry.com/developer/rawvoice-rss/) | `<rawvoice:*>` | RSS | ✅ | ✅ |
| [Podlove Simple Chapters](http://podlove.org/simple-chapters) | `<psc:*>` | RSS, Atom | ✅ | ✅ |
| [Media RSS](http://search.yahoo.com/mrss/) | `<media:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [GeoRSS-Simple](http://www.georss.org/georss) | `<georss:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Atom Threading](https://www.ietf.org/rfc/rfc4685.txt) | `<thr:*>` | RSS, Atom | ✅ | ✅ |
| [Dublin Core Terms](http://purl.org/dc/terms/) | `<dcterms:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Well-Formed Web](http://wellformedweb.org/CommentAPI/) | `<wfw:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Source](http://source.scripting.com/) | `<source:*>` | RSS | ✅ | ✅ |
| [YouTube](https://www.youtube.com/feeds/videos.xml) | `<yt:*>` | Atom | ✅ | ✅ |

### Other

| Format | Versions | Parsing | Generating |
|--------|----------|---------|------------|
| [OPML](https://opml.org/) | 1.0, 2.0 | ✅ | ✅ |

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

### Handle Errors

```typescript
try {
  const { format, feed } = parseFeed(content)
  // Use the feed
} catch (error) {
  console.error('Invalid feed:', error.message)
}
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
