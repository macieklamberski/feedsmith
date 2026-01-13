---
title: "Parsing Feeds: Namespaces"
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
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
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
  xmlns:dublincore="http://purl.org/dc/elements/1.1/"
  xmlns:podcast="http://www.itunes.com/dtds/podcast-1.0.dtd"
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

## Namespace URI Tolerance

Feedsmith accepts namespace URIs even when they don't exactly match the official specification. This makes it compatible with real-world feeds that may use variations:

```xml
<!-- HTTPS instead of HTTP -->
<rss xmlns:dc="https://purl.org/dc/elements/1.1/">

<!-- Different capitalization -->
<rss xmlns:dc="HTTP://PURL.ORG/DC/ELEMENTS/1.1/">

<!-- With or without trailing slash -->
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd/">

<!-- Whitespace around URI -->
<rss xmlns:dc="  http://purl.org/dc/elements/1.1/  ">
```

All of these variations are automatically recognized and normalized, so you can reliably access namespace data regardless of how the feed declares it.

## Alternative URI Variants

Real-world feeds often use unofficial namespace URI variants. These include HTTPS instead of HTTP, trailing slashes added or removed, or alternative domain paths. Feedsmith recognizes these variations to ensure broad compatibility. See the [complete list of recognized URI variants](https://github.com/macieklamberski/feedsmith/blob/main/src/common/config.ts#L37).

## Supported Namespaces

For a complete list of supported namespaces and their compatibility with different feed formats, see the [supported formats](/#supported-formats) section.
