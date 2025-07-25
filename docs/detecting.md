# Format Detection

You can quickly detect the feed format without parsing it.

```ts
import {
  detectAtomFeed,
  detectJsonFeed,
  detectRssFeed,
  detectRdfFeed
} from 'feedsmith'

if (detectAtomFeed(content)) {
  console.log('This is an Atom feed')
}

if (detectJsonFeed(content)) {
  console.log('This is a JSON feed')
}

if (detectRssFeed(content)) {
  console.log('This is an RSS feed')
}

if (detectRdfFeed(content)) {
  console.log('This is an RDF feed')
}
```

> [!WARNING]
> Detect functions are designed to quickly identify the feed format by looking for its signature, such as the the root tag, version attribute or feed elements. They're accurate in most cases, but not always. To be 100% certain that the feed is valid, parsing it is a more reliable approach.
