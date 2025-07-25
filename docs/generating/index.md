# Generating Feeds

Create RSS, Atom, JSON Feed, and OPML files with full namespace support.

## Overview

Feed generation is straightforward - provide the feed data and get back a properly formatted string:

```typescript
import {
  generateRssFeed,
  generateAtomFeed,
  generateJsonFeed,
  generateOpml
} from 'feedsmith'

// Generate different formats
const rss = generateRssFeed({ /* feed data */ })
const atom = generateAtomFeed({ /* feed data */ })
const json = generateJsonFeed({ /* feed data */ })
const opml = generateOpml({ /* opml data */ })
```

## Returned Values

The generation functions return properly formatted strings ready to use. Below are examples of what is generated for each format.

### RSS Feed

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
      author: 'john@myblog.com (John Doe)',
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

### Atom Feed

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

### JSON Feed

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

### OPML File

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
