---
prev: Parsing › Detecting
next: Generating › Overview
---

# Parsing Examples

This page provides comprehensive examples of parsing different feed formats with Feedsmith, showing both the input XML/JSON and the returned JavaScript objects.

> [!TIP]
> For more examples, check the _*/references_ folders in the source code. There, you'll find the complete outputs returned from the parse functions for the various feed formats and versions.
>
> * Atom examples: [src/feeds/atom/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/atom/references)
> * RSS examples: [src/feeds/rss/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rss/references)
> * RDF examples: [src/feeds/rdf/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rdf/references)
> * OPML examples: [src/opml/references](https://github.com/macieklamberski/feedsmith/blob/main/src/opml/references)

## Atom Feed

```typescript
import { parseAtomFeed } from 'feedsmith'

const atomFeed = parseAtomFeed(`
  <?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  >
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

## RSS Feed

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
      "enclosures": [
        {
          "url": "http://example.org/audio/demo.mp3",
          "length": 1069871,
          "type": "audio/mpeg"
        }
      ],
      "guid": { "value": "http://example.org/guid/1", "isPermaLink": true },
      "pubDate": "Thu, 05 Sep 2002 0:00:01 GMT",
      "source": {
        "title": "Example's Realm",
        "url": "http://www.example.org/links.xml"
      }
    }
  ]
}
```

## RDF Feed

```typescript
import { parseRdfFeed } from 'feedsmith'

const rdfFeed = parseRdfFeed(`
  <?xml version="1.0"?>
  <rdf:RDF
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns="http://purl.org/rss/1.0/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
  >
    <channel rdf:about="http://example.org/rss">
      <title>Example Feed</title>
      <link>http://example.org/</link>
      <description>A simple RDF feed example</description>
      <dc:creator>John Doe</dc:creator>
      <dc:date>2024-01-15T12:00:00Z</dc:date>
      <items>
        <rdf:Seq>
          <rdf:li resource="http://example.org/item1" />
        </rdf:Seq>
      </items>
    </channel>
    <item rdf:about="http://example.org/item1">
      <title>First Article</title>
      <link>http://example.org/item1</link>
      <description>This is the first article in our RDF feed</description>
      <dc:creator>Jane Smith</dc:creator>
      <dc:date>2024-01-15T10:00:00Z</dc:date>
    </item>
  </rdf:RDF>
`)
```

Returns:

```json
{
  "title": "Example Feed",
  "link": "http://example.org/",
  "description": "A simple RDF feed example",
  "items": [
    {
      "title": "First Article",
      "link": "http://example.org/item1",
      "description": "This is the first article in our RDF feed",
      "dc": {
        "creator": "Jane Smith",
        "date": "2024-01-15T10:00:00Z"
      }
    }
  ],
  "dc": {
    "creator": "John Doe",
    "date": "2024-01-15T12:00:00Z"
  }
}
```

## JSON Feed

```typescript
import { parseJsonFeed } from 'feedsmith'

const jsonFeed = parseJsonFeed(`{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "My Blog",
  "home_page_url": "https://example.com/",
  "feed_url": "https://example.com/feed.json",
  "description": "A blog about web development",
  "authors": [
    {
      "name": "John Doe",
      "url": "https://example.com/about"
    }
  ],
  "items": [
    {
      "id": "1",
      "title": "Getting Started with JSON Feed",
      "content_text": "JSON Feed is a pragmatic syndication format...",
      "url": "https://example.com/posts/json-feed-intro",
      "date_published": "2024-01-15T12:00:00Z",
      "authors": [
        {
          "name": "Jane Smith"
        }
      ]
    }
  ]
}`)
```

Returns:

```json
{
  "title": "My Blog",
  "home_page_url": "https://example.com/",
  "feed_url": "https://example.com/feed.json",
  "description": "A blog about web development",
  "authors": [
    {
      "name": "John Doe",
      "url": "https://example.com/about"
    }
  ],
  "items": [
    {
      "id": "1",
      "title": "Getting Started with JSON Feed",
      "content_text": "JSON Feed is a pragmatic syndication format...",
      "url": "https://example.com/posts/json-feed-intro",
      "date_published": "2024-01-15T12:00:00Z",
      "authors": [
        {
          "name": "Jane Smith"
        }
      ]
    }
  ]
}
```

## OPML

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

### Extra Outline Attributes

OPML files often contain custom attributes for specific applications or feed readers. You can parse these extra attributes by providing the `extraOutlineAttributes` option with the list of attribute names to extract:

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml(`
  <?xml version="1.0" encoding="utf-8"?>
  <opml version="2.0">
    <head>
      <title>My Feeds</title>
    </head>
    <body>
      <outline
        text="Hacker News"
        type="rss"
        xmlUrl="https://news.ycombinator.com/rss"
        htmlUrl="https://news.ycombinator.com"
        customIcon="https://example.com/icons/hn.png"
        updateInterval="30"
        isPrivate="true"
        tags="tech,news"
      />
      <outline
        text="Tech Folder"
        customColor="#FF5733"
      >
        <outline
          text="GitHub Blog"
          xmlUrl="https://github.blog/feed/"
          customIcon="https://example.com/icons/github.png"
          isPinned="true"
        />
      </outline>
    </body>
  </opml>
`, {
  extraOutlineAttributes: [
    'customIcon',
    'updateInterval',
    'isPrivate',
    'tags',
    'customColor',
    'isPinned'
  ]
})
```

Returns:

```json
{
  "head": {
    "title": "My Feeds"
  },
  "body": {
    "outlines": [
      {
        "text": "Hacker News",
        "type": "rss",
        "xmlUrl": "https://news.ycombinator.com/rss",
        "htmlUrl": "https://news.ycombinator.com",
        "customIcon": "https://example.com/icons/hn.png",
        "updateInterval": "30",
        "isPrivate": "true",
        "tags": "tech,news"
      },
      {
        "text": "Tech Folder",
        "customColor": "#FF5733",
        "outlines": [
          {
            "text": "GitHub Blog",
            "xmlUrl": "https://github.blog/feed/",
            "customIcon": "https://example.com/icons/github.png",
            "isPinned": "true"
          }
        ]
      }
    ]
  }
}
```

> [!NOTE]
> Extra attributes are case-insensitive when parsing. The attribute `customIcon` will match `customicon`, `CustomIcon`, or any other case variation in the XML.
