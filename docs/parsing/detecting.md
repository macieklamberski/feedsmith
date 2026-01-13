---
title: "Parsing Feeds: Detecting Format"
---

# Detecting Format

You can quickly detect the feed format without parsing it.

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
