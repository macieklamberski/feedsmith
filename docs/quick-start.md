# Quick Start

This guide will get you up and running with Feedsmith in just a few minutes.

### Installation

```bash
npm install feedsmith
```

## Parse Any Feed

The simplest way to parse any feed is to use the universal `parseFeed` function:

```typescript
import { parseFeed } from 'feedsmith'

// Works with RSS, Atom, JSON Feed, and RDF
const { format, feed } = parseFeed(feedContent)

console.log('Feed format:', format) // rss, atom, json, rdf
console.log('Feed title:', feed.title)

if (format === 'rss') {
  console.log('RSS feed link:', feed.link)
}
```

## Format-Specific Parsers

If you know the format in advance, you can use the format-specific parsers:

```typescript
import { parseAtomFeed, parseJsonFeed, parseRssFeed, parseRdfFeed } from 'feedsmith'

// Parse specific formats
const atomFeed = parseAtomFeed('atom content')
const jsonFeed = parseJsonFeed('json content')
const rssFeed = parseRssFeed('rss content')
const rdfFeed = parseRdfFeed('rdf content')

// Access typed data
rssFeed.title
rssFeed.dc?.creator
rssFeed.items?.[0]?.title
```

## Parse OPML Files

Parsing OPML files is just as simple:

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml('opml content')

opml.head?.title
opml.body?.outlines?.[0].text
opml.body?.outlines?.[1].xmlUrl
```

## Generate a Feed

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
```

> [!NOTE]
> Analogous to the above examples, you can generate other feed formats using the format-specific functions `generateAtomFeed`, `generateJsonFeed`, `generateRdfFeed` functions, as well as OPML files using `generateOpml`.

## Error Handling

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

## What's Next?

- **[Parse feeds](/parsing)** — Learn about parsing different formats
- **[Generate feeds](/generating)** — Create RSS, Atom, and JSON feeds
- **[Work with namespaces](/parsing/namespaces)** — Access podcast, media, and other metadata
- **[API Reference](/api)** — Explore all available functions and types
- **[Benchmarks](/benchmarks)** — See how Feedsmith compares to other libraries
