---
title: Feedsmith — Fast & Powerful JavaScript Feed Parser
---

# Feedsmith

Fast, all‑in‑one JavaScript feed parser and generator for RSS, Atom, RDF, and JSON Feed, with support for popular namespaces and OPML files.

Feedsmith offers universal and format‑specific parsers that maintain the original feed structure in a clean, object-oriented format while intelligently normalizing legacy elements. Access all feed data without compromising simplicity.

> [!IMPORTANT]
> **Feedsmith 3.x is in final stages of development.** Check out the [v3.x guide](https://v3.feedsmith.dev/migration/v2-to-v3) to explore new features and learn how to upgrade. Install it with:
>
> `npm install feedsmith@next`

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
* Works in Node.js and modern browsers.
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
| [RSS](/reference/feeds/rss) | 0.9x, 2.0 | ✅ | ✅ |
| [Atom](/reference/feeds/atom) | 0.3, 1.0 | ✅ | ✅ |
| [RDF](/reference/feeds/rdf) | 0.9, 1.0 | ✅ | 📋 |
| [JSON Feed](/reference/feeds/json-feed) | 1.0, 1.1 | ✅ | ✅ |

### Other

| Format | Versions | Parse | Generate |
|--------|----------|-------|----------|
| [OPML](/reference/opml) | 1.0, 2.0 | ✅ | ✅ |

### Feed Namespaces

| Name | Prefix | Supported in | Parse | Generate |
|------|---------|--------------|-------|----------|
| [Atom](/reference/namespaces/atom) | `<atom:*>` | RSS, RDF | ✅ | ✅ |
| [Dublin Core](/reference/namespaces/dc) | `<dc:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Dublin Core Terms](/reference/namespaces/dcterms) | `<dcterms:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Syndication](/reference/namespaces/sy) | `<sy:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Content](/reference/namespaces/content) | `<content:*>` | RSS, RDF | ✅ | ✅ |
| [Slash](/reference/namespaces/slash) | `<slash:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [iTunes](/reference/namespaces/itunes) | `<itunes:*>` | RSS, Atom | ✅ | ✅ |
| [Podcast Index](/reference/namespaces/podcast) | `<podcast:*>` | RSS | ✅ | ✅ |
| [Podlove Simple Chapters](/reference/namespaces/psc) | `<psc:*>` | RSS, Atom | ✅ | ✅ |
| [Media RSS](/reference/namespaces/media) | `<media:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Google Play Podcast](/reference/namespaces/googleplay) | `<googleplay:*>` | RSS, Atom | ✅ | ✅ |
| [Spotify](/reference/namespaces/spotify) | `<spotify:*>` | RSS | ✅ | ✅ |
| [Acast](/reference/namespaces/acast) | `<acast:*>` | RSS | ✅ | ✅ |
| [RawVoice](/reference/namespaces/rawvoice) | `<rawvoice:*>` | RSS | ✅ | ✅ |
| [FeedPress](/reference/namespaces/feedpress) | `<feedpress:*>` | RSS | ✅ | ✅ |
| [arXiv](/reference/namespaces/arxiv) | `<arxiv:*>` | Atom | ✅ | ✅ |
| [OpenSearch](/reference/namespaces/opensearch) | `<opensearch:*>` | RSS, Atom | ✅ | ✅ |
| [PRISM](/reference/namespaces/prism) | `<prism:*>` | RSS | ✅ | ✅ |
| [ccREL](/reference/namespaces/cc) | `<cc:*>` | RSS, Atom | ✅ | ✅ |
| [Creative Commons](/reference/namespaces/creativecommons) | `<creativeCommons:*>` | RSS, Atom | ✅ | ✅ |
| [Atom Threading](/reference/namespaces/thr) | `<thr:*>` | RSS, Atom | ✅ | ✅ |
| [Atom Publishing Protocol](/reference/namespaces/app) | `<app:*>` | Atom | ✅ | ✅ |
| [Comment API](/reference/namespaces/wfw) | `<wfw:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Administrative](/reference/namespaces/admin) | `<admin:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Pingback](/reference/namespaces/pingback) | `<pingback:*>` | RSS, Atom | ✅ | ✅ |
| [Trackback](/reference/namespaces/trackback) | `<trackback:*>` | RSS, Atom | ✅ | ✅ |
| [Source](/reference/namespaces/source) | `<source:*>` | RSS | ✅ | ✅ |
| [blogChannel](/reference/namespaces/blogchannel) | `<blogChannel:*>` | RSS | ✅ | ✅ |
| [YouTube](/reference/namespaces/yt) | `<yt:*>` | Atom | ✅ | ✅ |
| [W3C Basic Geo](/reference/namespaces/geo) | `<geo:*>` | RSS, Atom | ✅ | ✅ |
| [GeoRSS Simple](/reference/namespaces/georss) | `<georss:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [RDF](/reference/namespaces/rdf) | `<rdf:*>` | RDF | ✅ | ✅ |

## Why Feedsmith?

Why should you use this library over the alternatives?

The key advantage of Feedsmith is that it preserves the original feed structure exactly as defined in each specific feed format.

Many alternative packages attempt to normalize data by:

* Merging distinct fields like `author`, `dc:creator`, and `creator` into a single property.
* Combining date fields such as `dc:date` and `pubDate` without preserving their sources.
* Handling multiple `<atom:link>` elements inconsistently, sometimes keeping only the first or last one or ignoring different `rel` attributes.
* Some libraries try to combine different feed formats into one universal structure.

While this approach can be useful for quick reading of feed data, it often results in a loss of information that may be crucial for certain applications, such as reading data from specific namespaces.
