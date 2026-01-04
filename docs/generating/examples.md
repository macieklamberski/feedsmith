---
prev: Generating › Lenient Mode
next: Reference › Functions
---

# Generating Examples

This page provides comprehensive examples of generating different feed formats with Feedsmith, showing both the JavaScript input and the generated XML/JSON output.

> [!TIP]
> For more examples, check the _*/references_ folders in the source code. There, you'll find the complete outputs returned from the generate functions for the various feed formats and versions.
>
> * Atom examples: [src/feeds/atom/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/atom/references)
> * RSS examples: [src/feeds/rss/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rss/references)
> * RDF examples: [src/feeds/rdf/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rdf/references)
> * OPML examples: [src/opml/references](https://github.com/macieklamberski/feedsmith/blob/main/src/opml/references)

## RSS Feed

```typescript
import { generateRssFeed } from 'feedsmith'

const rssFeed = generateRssFeed({
  title: 'My Tech Blog',
  link: 'https://myblog.com',
  description: 'Thoughts on web development and technology',
  language: 'en-US',
  pubDate: new Date('2024-01-15T12:00:00Z'),
  items: [
    {
      title: 'Introduction to TypeScript',
      link: 'https://myblog.com/posts/intro-to-typescript',
      description: 'Learn the basics of TypeScript and why you should use it',
      pubDate: new Date('2024-01-15T10:00:00Z'),
      guid: 'https://myblog.com/posts/intro-to-typescript',
      authors: ['john@myblog.com (John Doe)'],
      categories: [{ name: 'TypeScript' }, { name: 'Programming' }]
    }
  ]
})
```

Generates:

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>My Tech Blog</title>
    <link>https://myblog.com</link>
    <description>Thoughts on web development and technology</description>
    <language>en-US</language>
    <pubDate>Mon, 15 Jan 2024 12:00:00 GMT</pubDate>
    <item>
      <title>Introduction to TypeScript</title>
      <link>https://myblog.com/posts/intro-to-typescript</link>
      <description>Learn the basics of TypeScript and why you should use it</description>
      <author>john@myblog.com (John Doe)</author>
      <guid>https://myblog.com/posts/intro-to-typescript</guid>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <category>TypeScript</category>
      <category>Programming</category>
    </item>
  </channel>
</rss>
```

### RSS with Stylesheet

You can add XML stylesheets to make feeds browser-friendly by providing the `stylesheets` option:

```typescript
import { generateRssFeed } from 'feedsmith'

const rssFeed = generateRssFeed({
  title: 'My Tech Blog',
  link: 'https://myblog.com',
  description: 'Thoughts on web development',
  items: [
    {
      title: 'Hello World',
      link: 'https://myblog.com/hello',
      description: 'First post'
    }
  ]
}, {
  stylesheets: [{
    type: 'text/xsl',
    href: '/styles/feed.xsl'
  }]
})
```

Generates (showing first lines):

```xml
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl"?>
<rss version="2.0">
  <!-- rest of the feed -->
</rss>
```

> [!NOTE]
> For details on stylesheet options and advanced usage, see the [Feed Styling](/generating/styling) guide.

### Using TypeScript

Build type-safe RSS feeds using the exported types:

```typescript
import type { Rss } from 'feedsmith/types'
import { generateRssFeed } from 'feedsmith'

// Define items with full type safety
const items: Array<Rss.Item<Date>> = [{
  title: 'New Episode',
  description: 'Episode description',
  enclosures: [{
    url: 'https://example.com/audio.mp3',
    length: 12345678,
    type: 'audio/mpeg'
  }]
}]

// Build the feed
const feed: Rss.Feed<Date> = {
  title: 'My Podcast',
  link: 'https://example.com',
  description: 'A podcast',
  items
}

const xml = generateRssFeed(feed)
```

For more details on using types, see the [TypeScript guide](/reference/typescript).

## Atom Feed

```typescript
import { generateAtomFeed } from 'feedsmith'

const atomFeed = generateAtomFeed({
  id: 'https://myblog.com/feed',
  title: 'My Tech Blog',
  updated: new Date('2024-01-15T12:00:00Z'),
  links: [
    { href: 'https://myblog.com/feed.xml', rel: 'self' },
    { href: 'https://myblog.com', rel: 'alternate' }
  ],
  entries: [
    {
      id: 'https://myblog.com/posts/1',
      title: 'Introduction to TypeScript',
      updated: new Date('2024-01-15T10:00:00Z'),
      content: '<p>Learn the basics of TypeScript and why you should use it</p>',
      links: [{ href: 'https://myblog.com/posts/intro-to-typescript' }],
      categories: [{ term: 'typescript', label: 'TypeScript' }]
    }
  ]
})
```

Generates:

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://myblog.com/feed</id>
  <title>My Tech Blog</title>
  <updated>2024-01-15T12:00:00.000Z</updated>
  <link href="https://myblog.com/feed.xml" rel="self"/>
  <link href="https://myblog.com" rel="alternate"/>
  <entry>
    <id>https://myblog.com/posts/1</id>
    <title>Introduction to TypeScript</title>
    <updated>2024-01-15T10:00:00.000Z</updated>
    <link href="https://myblog.com/posts/intro-to-typescript"/>
    <content>Learn the basics of TypeScript and why you should use it</content>
    <category term="typescript" label="TypeScript"/>
  </entry>
</feed>
```


## JSON Feed

```typescript
import { generateJsonFeed } from 'feedsmith'

const jsonFeed = generateJsonFeed({
  title: 'My Tech Blog',
  home_page_url: 'https://myblog.com',
  feed_url: 'https://myblog.com/feed.json',
  items: [
    {
      id: '1',
      url: 'https://myblog.com/posts/intro-to-typescript',
      title: 'Introduction to TypeScript',
      content_html: '<p>Learn the basics of TypeScript and why you should use it</p>',
      date_published: new Date('2024-01-15T10:00:00Z'),
      tags: ['typescript', 'programming']
    }
  ]
})
```

Generates:

```json
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "My Tech Blog",
  "home_page_url": "https://myblog.com",
  "feed_url": "https://myblog.com/feed.json",
  "items": [
    {
      "id": "1",
      "url": "https://myblog.com/posts/intro-to-typescript",
      "title": "Introduction to TypeScript",
      "content_html": "<p>Learn the basics of TypeScript and why you should use it</p>",
      "date_published": "2024-01-15T10:00:00.000Z",
      "tags": ["typescript", "programming"]
    }
  ]
}
```

## OPML

```typescript
import { generateOpml } from 'feedsmith'

const opml = generateOpml({
  head: {
    title: 'My Feed Subscriptions',
    dateCreated: new Date('2024-01-15T12:00:00Z')
  },
  body: {
    outlines: [
      {
        text: 'Tech Blogs',
        title: 'Technology Feeds',
        outlines: [
          {
            text: 'TechCrunch',
            type: 'rss',
            xmlUrl: 'https://techcrunch.com/feed/',
            htmlUrl: 'https://techcrunch.com'
          },
          {
            text: 'The Verge',
            type: 'rss',
            xmlUrl: 'https://www.theverge.com/rss/index.xml',
            htmlUrl: 'https://www.theverge.com'
          }
        ]
      }
    ]
  }
})
```

Generates:

```xml
<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <head>
    <title>My Feed Subscriptions</title>
    <dateCreated>Mon, 15 Jan 2024 12:00:00 GMT</dateCreated>
  </head>
  <body>
    <outline text="Tech Blogs" title="Technology Feeds">
      <outline text="TechCrunch" type="rss" xmlUrl="https://techcrunch.com/feed/" htmlUrl="https://techcrunch.com"/>
      <outline text="The Verge" type="rss" xmlUrl="https://www.theverge.com/rss/index.xml" htmlUrl="https://www.theverge.com"/>
    </outline>
  </body>
</opml>
```

### Extra Outline Attributes

You can generate OPML files with custom outline attributes by providing them in the outline objects and specifying their names in the `extraOutlineAttributes` option:

```typescript
import { generateOpml } from 'feedsmith'

const opml = generateOpml({
  head: {
    title: 'My Custom Feed List',
    dateCreated: new Date('2024-01-15T12:00:00Z')
  },
  body: {
    outlines: [
      {
        text: 'Hacker News',
        type: 'rss',
        xmlUrl: 'https://news.ycombinator.com/rss',
        htmlUrl: 'https://news.ycombinator.com',
        customIcon: 'https://example.com/icons/hn.png',
        updateInterval: '30',
        isPrivate: 'true',
        tags: 'tech,news'
      },
      {
        text: 'Tech Folder',
        customColor: '#FF5733',
        outlines: [
          {
            text: 'GitHub Blog',
            type: 'rss',
            xmlUrl: 'https://github.blog/feed/',
            htmlUrl: 'https://github.blog',
            customIcon: 'https://example.com/icons/github.png',
            isPinned: 'true'
          }
        ]
      }
    ]
  }
}, {
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

Generates:

```xml
<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <head>
    <title>My Custom Feed List</title>
    <dateCreated>Mon, 15 Jan 2024 12:00:00 GMT</dateCreated>
  </head>
  <body>
    <outline text="Hacker News" type="rss" xmlUrl="https://news.ycombinator.com/rss" htmlUrl="https://news.ycombinator.com" customIcon="https://example.com/icons/hn.png" updateInterval="30" isPrivate="true" tags="tech,news"/>
    <outline text="Tech Folder" customColor="#FF5733">
      <outline text="GitHub Blog" type="rss" xmlUrl="https://github.blog/feed/" htmlUrl="https://github.blog" customIcon="https://example.com/icons/github.png" isPinned="true"/>
    </outline>
  </body>
</opml>
```
