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
- Supports RSS, Atom, JSON Feed, and RDF formats
- Throws an error for unrecognized or invalid feeds

> [!IMPORTANT]
> The universal parser uses detection functions to identify the feed format. While these work well for most feeds, they might not perfectly detect all valid feeds, especially those with non-standard structures. If you know the feed format in advance, using a dedicated parser is more reliable.
> See more on the [feed format detection](/parsing/detecting).

## Dedicated Feed Parsers

When you know the feed format beforehand, use format-specific parsers for better performance and reliability:

```typescript
import {
  parseRssFeed,
  parseAtomFeed,
  parseJsonFeed,
  parseRdfFeed
} from 'feedsmith'

// Parse specific formats
const rssFeed = parseRssFeed(rssContent)
const atomFeed = parseAtomFeed(atomContent)
const jsonFeed = parseJsonFeed(jsonContent)
const rdfFeed = parseRdfFeed(rdfContent)

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

## Returned Values

The objects returned from the parser functions are highly comprehensive, aiming to recreate the actual feed structure and its values, including all the supported namespaces. Below are some examples of what is available.

> [!TIP]
> For more examples, check the _*/references_ folders in the source code. There, you'll find the complete outputs returned from the parse functions for the various feed formats and versions.
>
> * Atom examples: [src/feeds/atom/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/atom/references)
> * RSS examples: [src/feeds/rss/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rss/references)
> * RDF examples: [src/feeds/rdf/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rdf/references)
> * OPML examples: [src/opml/references](https://github.com/macieklamberski/feedsmith/blob/main/src/opml/references)

### Atom Feed

```typescript
import { parseAtomFeed } from 'feedsmith'

const atomFeed = parseAtomFeed(`
  <?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>Example Feed</title>
    <id>example-feed</id>
    <dc:creator>John Doe</dc:creator>
    <dc:contributor>Jane Smith</dc:contributor>
    <dc:date>2022-01-01T12:00+00:00</dc:date>
    <dc:description>This is an example of description.</dc:description>
    <sy:updateBase>2000-01-01T12:00+00:00</sy:updateBase>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <entry>
      <title>Example Entry</title>
      <id>example-entry</id>
      <dc:creator>Jack Jackson</dc:creator>
      <dc:date>2022-01-01T12:00+00:00</dc:date>
    </entry>
  </feed>
`)
```

Returns:

```json
{
  "id": "example-feed",
  "title": "Example Feed",
  "entries": [
    {
      "id": "example-entry",
      "title": "Example Entry",
      "dc": {
        "creator": "Jack Jackson",
        "date": "2022-01-01T12:00+00:00"
      }
    }
  ],
  "dc": {
    "creator": "John Doe",
    "description": "This is an example of description.",
    "contributor": "Jane Smith",
    "date": "2022-01-01T12:00+00:00"
  },
  "sy": {
    "updatePeriod": "hourly",
    "updateFrequency": 1,
    "updateBase": "2000-01-01T12:00+00:00"
  }
}
```

### RSS Feed

```typescript
import { parseRssFeed } from 'feedsmith'

const rssFeed = parseRssFeed(`
  <?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[Sample Feed]]></title>
      <link>http://example.org/</link>
      <description>For documentation &lt;em&gt;only&lt;/em&gt;</description>
      <language>en</language>
      <webMaster>webmaster@example.org</webMaster>
      <pubDate>Sat, 19 Mar 1988 07:15:00 GMT</pubDate>
      <lastBuildDate>Sat, 19 Mar 1988 07:15:00 GMT</lastBuildDate>
      <category domain="http://www.example.com/cusips">Examples2</category>
      <generator>Sample Toolkit</generator>
      <docs>http://feedvalidator.org/docs/rss2.html</docs>
      <cloud domain="rpc.example.com" port="80" path="/RPC2" registerProcedure="pingMe" protocol="soap" />
      <ttl>60</ttl>
      <image>
        <title>Example banner</title>
        <url>http://example.org/banner.png</url>
        <link>http://example.org/</link>
        <description>Quos placeat quod ea temporibus ratione</description>
        <width>80</width>
        <height>15</height>
      </image>
      <textInput>
        <title>Search</title>
        <description><![CDATA[Search this site:]]></description>
        <name>q</name>
        <link>http://example.org/mt/mt-search.cgi</link>
      </textInput>
      <skipHours>
        <hour>0</hour>
        <hour>20</hour>
        <hour>21</hour>
        <hour>22</hour>
        <hour>23</hour>
      </skipHours>
      <skipDays>
        <day>Monday</day>
        <day>Wednesday</day>
        <day>Friday</day>
      </skipDays>
      <item>
        <title>First item title</title>
        <link>http://example.org/item/1</link>
        <description>Some description of the first item.</description>
        <comments>http://example.org/comments/1</comments>
        <enclosure url="http://example.org/audio/demo.mp3" length="1069871" type="audio/mpeg" />
        <guid isPermaLink="true">http://example.org/guid/1</guid>
        <pubDate>Thu, 05 Sep 2002 0:00:01 GMT</pubDate>
        <source url="http://www.example.org/links.xml">Example's Realm</source>
      </item>
    </channel>
  </rss>
`)
```

Returns:

```json
{
  "title": "Sample Feed",
  "link": "http://example.org/",
  "description": "For documentation <em>only</em>",
  "language": "en",
  "webMaster": "webmaster@example.org",
  "pubDate": "Sat, 19 Mar 1988 07:15:00 GMT",
  "lastBuildDate": "Sat, 19 Mar 1988 07:15:00 GMT",
  "categories": [{ "name": "Examples2", "domain": "http://www.example.com/cusips" }],
  "generator": "Sample Toolkit",
  "docs": "http://feedvalidator.org/docs/rss2.html",
  "cloud": {
    "domain": "rpc.example.com",
    "port": 80,
    "path": "/RPC2",
    "registerProcedure": "pingMe",
    "protocol": "soap"
  },
  "ttl": 60,
  "image": {
    "url": "http://example.org/banner.png",
    "title": "Example banner",
    "link": "http://example.org/",
    "description": "Quos placeat quod ea temporibus ratione",
    "height": 15,
    "width": 80
  },
  "textInput": {
    "title": "Search",
    "description": "Search this site:",
    "name": "q",
    "link": "http://example.org/mt/mt-search.cgi"
  },
  "skipHours": [0, 20, 21, 22, 23],
  "skipDays": ["Monday", "Wednesday", "Friday"],
  "items": [
    {
      "title": "First item title",
      "link": "http://example.org/item/1",
      "description": "Some description of the first item.",
      "comments": "http://example.org/comments/1",
      "enclosure": {
        "url": "http://example.org/audio/demo.mp3",
        "length": 1069871,
        "type": "audio/mpeg"
      },
      "guid": "http://example.org/guid/1",
      "pubDate": "Thu, 05 Sep 2002 0:00:01 GMT",
      "source": {
        "title": "Example's Realm",
        "url": "http://www.example.org/links.xml"
      }
    }
  ]
}
```

### OPML File

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml(`
  <?xml version="1.0" encoding="utf-8"?>
  <opml version="2.0">
    <head>
      <title>Tech Sites</title>
      <dateCreated>Mon, 15 Jan 2024 09:45:30 GMT</dateCreated>
      <ownerName>Jack Smith</ownerName>
    </head>
    <body>
      <outline text="The Verge" type="rss" xmlUrl="https://www.theverge.com/rss/index.xml" htmlUrl="https://www.theverge.com/" title="The Verge" version="rss" />
      <outline text="TechCrunch" type="rss" xmlUrl="https://techcrunch.com/feed/" htmlUrl="https://techcrunch.com/" title="TechCrunch" version="rss" />
    </body>
  </opml>
`)
```

Returns:

```json
{
  "head": {
    "title": "Tech Sites",
    "dateCreated": "Mon, 15 Jan 2024 09:45:30 GMT",
    "ownerName": "Jack Smith"
  },
  "body": {
    "outlines": [
      {
        "text": "The Verge",
        "type": "rss",
        "xmlUrl": "https://www.theverge.com/rss/index.xml",
        "htmlUrl": "https://www.theverge.com/",
        "title": "The Verge",
        "version": "rss"
      },
      {
        "text": "TechCrunch",
        "type": "rss",
        "xmlUrl": "https://techcrunch.com/feed/",
        "htmlUrl": "https://techcrunch.com/",
        "title": "TechCrunch",
        "version": "rss"
      }
    ]
  }
}
```
