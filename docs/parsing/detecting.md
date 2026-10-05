---
title: "Parsing Feeds: Detecting Format"
---

# Detecting Feed Format

You can quickly detect the feed format without parsing it.

## Any Format

Use `detectFeed` when you don't know the format in advance. It returns the format, or `undefined` when the content is not a feed.

```typescript
import { detectFeed } from 'feedsmith'

const format = detectFeed(content)
// 'rss' | 'atom' | 'rdf' | 'json' | undefined

if (!format) {
  console.log('This is not a feed')
}
```

It checks the formats in the same order as [`parseFeed`](/reference#parsefeed), so the two always agree on the format.

## Specific Format

Each format also has its own detect function:

```typescript
import {
  detectRssFeed,
  detectAtomFeed,
  detectRdfFeed,
  detectJsonFeed
} from 'feedsmith'

if (detectRssFeed(content)) {
  console.log('This is an RSS feed')
}

if (detectAtomFeed(content)) {
  console.log('This is an Atom feed')
}

if (detectRdfFeed(content)) {
  console.log('This is an RDF feed')
}

if (detectJsonFeed(content)) {
  console.log('This is a JSON feed')
}
```

> [!WARNING]
> Detect functions are designed to quickly identify the feed format by looking for its signature, such as the the root tag, version attribute or feed elements. They're accurate in most cases, but to be 100% certain that the feed is valid, parsing it is a more reliable approach.
