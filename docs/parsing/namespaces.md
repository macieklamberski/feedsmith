---
prev: Parsing › Examples
next: Parsing › Dates
---

# Parsing Namespaces

XML-based feeds (RSS, Atom, RDF) support namespace extensions that add rich metadata beyond the basic feed format. All supported namespaces are automatically parsed and custom prefixes are normalized.

## Accessing Namespace Data

Namespace elements in feeds are automatically parsed and attached to corresponding elements as objects:

```typescript
import { parseRssFeed } from 'feedsmith'

const feed = parseRssFeed(`
  <?xml version="1.0" encoding="UTF-8"?>
  <rss
    version="2.0"
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
  >
    <channel>
      <title>My Podcast</title>
      <itunes:author>John Doe</itunes:author>
      <dc:creator>John Doe</dc:creator>
      <item>
        <title>Episode 1</title>
        <itunes:duration>30:15</itunes:duration>
        <dc:date>2024-01-15</dc:date>
      </item>
    </channel>
  </rss>
`)

// Access namespace data
feed.itunes?.author
feed.dc?.creator
feed.items?.[0]?.itunes?.duration
feed.items?.[0]?.dc?.date
```

## Custom Prefix Normalization

If the feed contains a known namespace but is using it under a different prefix, Feedsmith will automatically normalize it to the standard prefix.

```xml
<!-- Feed with custom prefixes -->
<rss
  xmlns:podcast="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:dublincore="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <podcast:author>John Doe</podcast:author>
    <dublincore:creator>John Doe</dublincore:creator>
  </channel>
</rss>
```

```typescript
// Normalized in parsed object
feed.itunes?.author // "John Doe" - podcast: prefix normalized to itunes:
feed.dc?.creator // "John Doe" - creator: prefix normalized to dc:
```

## Supported Namespaces

For a complete list of supported namespaces and their compatibility with different feed formats, see the [supported formats](/#supported-formats) section.
