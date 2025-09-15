# Quick Start

This guide will get you up and running with Feedsmith in just a few minutes.


## Installation

Feedsmith works in both Node.js and modern browsers as an ES module. It was tested in both environments, ensuring compatibility and reliability.

Install the package using your preferred package manager:

::: code-group

```bash [npm]
npm install feedsmith
```

```bash [yarn]
yarn add feedsmith
```

```bash [pnpm]
pnpm add feedsmith
```

```bash [bun]
bun add feedsmith
```

:::

Or using CDN:

::: code-group

```html [unpkg]
<script type="module">
  import { parseFeed } from 'https://unpkg.com/feedsmith@latest/dist/index.js'

  const { format, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

```html [jsDelivr]
<script type="module">
  import { parseFeed } from 'https://cdn.jsdelivr.net/npm/feedsmith@latest/dist/index.js'

  const { format, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

```html [esm.sh]
<script type="module">
  import { parseFeed } from 'https://esm.sh/feedsmith@latest'

  const { format, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

:::

## Parse Any Feed

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

## Parse Specific Feed Formats

If you know the format in advance, you can use the format-specific parsers:

```typescript
import {
  parseRssFeed,
  parseAtomFeed,
  parseRdfFeed,
  parseJsonFeed
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

// You can also generate other formats:
// - generateAtomFeed() for Atom feeds
// - generateJsonFeed() for JSON feeds
// - generateOpml() for OPML files
```

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

- **[Parse feeds](/parsing/)** — Learn about parsing different formats
- **[Work with namespaces](/parsing/namespaces)** — Access podcast, media, and other metadata
- **[Generate feeds](/generating/)** — Create feeds in various formats
- **[API Reference](/reference/)** — Explore all available functions and types
- **[Benchmarks](/benchmarks)** — See how Feedsmith compares to other libraries
