# Feed Styling

XML-based feeds (RSS, Atom) and OPML files support stylesheets to provide custom styling and transformations in browsers and feed readers.

## Overview

Stylesheets allow you to:

- **Transform feed appearance** in browsers and feed readers
- **Apply custom CSS styling** for better visual presentation
- **Create XSL transformations** to convert feeds to HTML pages
- **Support multiple stylesheets** with different media types
- **Provide alternate stylesheets** for user selection

When stylesheets are specified, Feedsmith automatically includes XML processing instructions in the generated feed, making it browser-friendly and customizable.

## Options

XML-based generation functions accept an optional `options` parameter where you can specify the `stylesheets` array with following fields:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `type` | ✔︎ | string | MIME type: `text/xsl` for XSL transformations, `text/css` for CSS styling |
| `href` | ✔︎ | string | URL path to the stylesheet file |
| `title` |  | string | Human-readable name for the stylesheet |
| `media` |  | string | Target media type (`screen`, `print`, `all`, etc.) |
| `charset` |  | string | Character encoding (defaults to feed encoding) |
| `alternate` |  | boolean | Whether the stylesheet is an alternative option |

## Examples

### Basic XSL Stylesheet

```typescript
import { generateRssFeed } from 'feedsmith'

const rssFeed = generateRssFeed(feedData, {
  stylesheets: [
    {
      type: 'text/xsl',
      href: '/styles/feed.xsl',
      title: 'Pretty Feed'
    }
  ]
})
```

### Multiple Stylesheets

```typescript
import { generateAtomFeed } from 'feedsmith'

const atomFeed = generateAtomFeed(feedData, {
  stylesheets: [
    {
      type: 'text/xsl',
      href: '/styles/feed.xsl',
      title: 'Pretty Feed',
      media: 'screen'
    },
    {
      type: 'text/css',
      href: '/styles/feed.css',
      media: 'screen',
      alternate: false
    }
  ]
})
```

### OPML with Stylesheet

```typescript
import { generateOpml } from 'feedsmith'

const opml = generateOpml(opmlData, {
  stylesheets: [
    {
      type: 'text/xsl',
      href: '/styles/opml.xsl',
      title: 'OPML Viewer'
    }
  ]
})
```

## Generated Output

When stylesheets are provided, they appear as XML processing instructions before the main content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl" title="Pretty Feed" media="screen"?>
<?xml-stylesheet type="text/css" href="/styles/feed.css" media="screen" alternate="no"?>
<rss version="2.0">
  <channel>
    <!-- … -->
  </channel>
</rss>
```
