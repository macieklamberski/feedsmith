---
title: Parsing Feeds
---

# Parsing Feeds

Feedsmith provides powerful parsing capabilities for various feed formats. The library offers both a universal parser that automatically detects feed formats and dedicated parsers for when you know the format in advance.

## Universal Feed Parser

The simplest way to parse any feed is to use the universal `parseFeed` function:

```typescript
import { parseFeed } from 'feedsmith'

const content = `
  <?xml version="1.0"?>
  <rss version="2.0">
    <channel>
      <title>My Blog</title>
      <description>A blog about web development</description>
      <link>https://example.com</link>
      <item>
        <title>Getting Started with Feedsmith</title>
        <description>Learn how to parse and generate feeds</description>
        <link>https://example.com/posts/feedsmith-intro</link>
        <pubDate>Mon, 15 Jan 2024 12:00:00 GMT</pubDate>
      </item>
    </channel>
  </rss>
`

const result = parseFeed(content)
result.format // rss
result.feed.title // My Blog
result.feed.items?.length // 1
result.feed.items?.[0]?.title // Getting Started with Feedsmith
```

The universal parser:
- Automatically detects the feed format using format detection functions
- Returns an object with `format` and `feed` properties
- Supports RSS, Atom, RDF, and JSON Feed formats
- Throws `DetectError` or `ParseError` for invalid feeds

> [!IMPORTANT]
> The universal parser uses detection functions to identify the feed format. While these work well for most feeds, they might not perfectly detect all valid feeds, especially those with non-standard structures. If you know the feed format in advance, using a dedicated parser is more reliable.
> See more on the [feed format detection](/parsing/detecting).

## Dedicated Feed Parsers

When you know the feed format beforehand, use format-specific parsers for better performance and reliability:

```typescript
import {
  parseRssFeed,
  parseAtomFeed,
  parseRdfFeed,
  parseJsonFeed
} from 'feedsmith'

// Parse specific formats
const rssFeed = parseRssFeed(rssContent)
const atomFeed = parseAtomFeed(atomContent)
const rdfFeed = parseRdfFeed(rdfContent)
const jsonFeed = parseJsonFeed(jsonContent)

// Then read the TypeScript suggestions for the specific feed format
rssFeed.title
rssFeed.dc?.creator
rssFeed.dc?.date
rssFeed.sy?.updateBase
rssFeed.items?.[0]?.title
```

## OPML Parser

OPML (Outline Processor Markup Language) files, commonly used for feed subscription lists, have their own parser:

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml(opmlContent)

// Access OPML structure
opml.head?.title
opml.body?.outlines
```

## Error Handling

Parsing functions throw `DetectError` when the input doesn't match the expected format, or `ParseError` when XML parsing fails. See [Error Handling](/parsing/errors) for details on error types.

## Returned Values

The parsing functions return JavaScript objects representing the feed in its original structure. See [Parsing Examples](/parsing/examples) page for detailed examples of input and output for each feed format.
