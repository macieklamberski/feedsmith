# Feedsmith

[![tests](https://github.com/macieklamberski/feedsmith/actions/workflows/test.yml/badge.svg)](https://github.com/macieklamberski/feedsmith/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/macieklamberski/feedsmith/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/feedsmith)
[![npm version](https://img.shields.io/npm/v/feedsmith.svg)](https://www.npmjs.com/package/feedsmith)
[![license](https://img.shields.io/npm/l/feedsmith.svg)](https://github.com/macieklamberski/feedsmith/blob/main/LICENSE)

Robust and fast JavaScript parser and generator for RSS, Atom, JSON Feed, and RDF feeds, with support for popular namespaces and OPML files.

Feedsmith provides both universal and format-specific parsers that maintain the original feed structure in a clean, object-oriented format while intelligently normalizing legacy elements. Access all feed data without compromising simplicity.

> [!IMPORTANT]
>
> You're viewing the README for the next version of Feedsmith, which is in the final stages of development. While the codebase is stable, the API may still undergo slight changes. For production use, it is recommended to use the latest stable version, 1.9.0:
> ```bash
> npm install feedsmith@1.9.0
> ```

[Features](#supported-formats)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Installation](#installation)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Parsing](#parsing)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Generating](#generating)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Benchmarks](#benchmarks)
&nbsp;&nbsp;·&nbsp;&nbsp;
[FAQ](#faq)

---

#### Leniency
* **Normalizes legacy elements** ✨ — Upgrades feed elements to their modern equivalents so that you never need to worry about reading feeds in older formats.
* **CaSe INSENsiTive** — Handles fields and attributes in any case (lowercase, uppercase, mixed).

#### Performance and type-safety
* **Fast parsing** — One of the fastest feed parsers in JavaScript (see [benchmarks](#benchmarks)).
* **Type-safe API** — TypeScript type definitions are available for each feed format, making it easy to work with the data.
* **Tree-shakable** — Only include the parts of the library you need, reducing bundle size.
* **Well-tested** — Comprehensive test suite with over 2000 tests and 99% code coverage.

#### Compatibility
* Works in Node.js and all modern browsers.
* Works with plain JavaScript, you don't need to use TypeScript.

## Supported formats

✅ Available
&nbsp;&nbsp;·&nbsp;&nbsp;
⌛️ Work in progress
&nbsp;&nbsp;·&nbsp;&nbsp;
📋 Planned


### Feeds

| Format | Versions | Parsing | Generating |
|--------|----------|---------|------------|
| [RSS](http://cyber.law.harvard.edu/rss/rss.html) | 0.9x, 2.0 | ✅ | ✅ |
| [Atom](https://tools.ietf.org/html/rfc4287) | 0.3, 1.0 | ✅ | ✅ |
| [JSON Feed](https://jsonfeed.org) | 1.0, 1.1 | ✅ | ✅ |
| [RDF](https://web.resource.org/rss/1.0/spec) | 0.9, 1.0 | ✅ | ⏳ |

### Namespaces

| Name | Prefix | Supported in | Parsing | Generating |
|------|--------|--------------|---------|------------|
| [Atom](http://www.w3.org/2005/Atom) | `<atom:*>`, `<a10:*>` | RSS, RDF | ✅ | ✅ |
| [Dublin Core](http://purl.org/dc/elements/1.1/) | `<dc:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Syndication](http://purl.org/rss/1.0/modules/syndication/) | `<sy:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Content](http://purl.org/rss/1.0/modules/content/) | `<content:*>` | RSS, RDF | ✅ | ✅ |
| [Slash](http://purl.org/rss/1.0/modules/slash/) | `<slash:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [iTunes](http://www.itunes.com/dtds/podcast-1.0.dtd) | `<itunes:*>` | RSS, Atom | ✅ | ✅ |
| [Podcast](https://podcastindex.org/namespace/1.0) | `<podcast:*>` | RSS | ✅ | ✅ |
| [Media RSS](http://search.yahoo.com/mrss/) | `<media:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [GeoRSS-Simple](http://www.georss.org/georss) | `<georss:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Atom Threading](https://www.ietf.org/rfc/rfc4685.txt) | `<thr:*>` | RSS, Atom | ✅ | ✅ |
| [Dublin Core Terms](http://purl.org/dc/terms/) | `<dcterms:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Well-Formed Web](http://wellformedweb.org/CommentAPI/) | `<wfw:*>` | RSS, Atom, RDF | ✅ | ✅ |
| [Administrative](https://web.resource.org/rss/1.0/modules/admin/) | `<admin:*>` | 📋 | 📋 | 📋 |
| [GML](http://www.opengis.net/gml) | `<gml:*>` | 📋 | 📋 | 📋 |
| [GeoRSS GML](http://www.opengis.net/gml) | `<georss:*>` | 📋 | 📋 | 📋 |

### Other

| Format | Versions | Parsing | Generating |
|--------|----------|---------|------------|
| [OPML](https://opml.org/) | 1.0, 2.0 | ✅ | ✅ |

## Installation

```bash
npm install feedsmith
```

## Parsing

### Universal feeds parser

The easiest way to parse any feed is to use the universal `parseFeed` function:

```ts
import { parseFeed } from 'feedsmith'

const { type, feed } = parseFeed('feed content')

console.log('Feed type:', type) // → rss, atom, json, rdf
console.log('Feed title:', feed.title)

if (type === 'rss') {
  console.log('RSS feed link:', feed.link)
}
```

### Dedicated feeds parsers

If you know the format in advance, you can use the format-specific parsers:

```ts
import { parseAtomFeed, parseJsonFeed, parseRssFeed, parseRdfFeed } from 'feedsmith'

// Parse the feed content
const atomFeed = parseAtomFeed('atom content')
const jsonFeed = parseJsonFeed('json content')
const rssFeed = parseRssFeed('rss content')
const rdfFeed = parseRdfFeed('rdf content')

// Then read the TypeScript suggestions for the specific feed type
rssFeed.title
rssFeed.dc?.creator
rssFeed.dc?.date
rssFeed.sy?.updateBase
rssFeed.items?.[0]?.title
```

### OPML parser

Parsing OPML files is as simple:

```ts
import { parseOpml } from 'feedsmith'

// Parse the OPML content
const opml = parseOpml('opml content')

// Then read the TypeScript suggestions
opml.head?.title
opml.body?.outlines?.[0].text
opml.body?.outlines?.[1].xmlUrl
```

### Returned values

The objects returned from the parser functions are highly comprehensive, aiming to recreate the actual feed structure and its values, including all the supported namespaces. Below are some examples of what is available.

```ts
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

atomFeed.title // → Example Feed
atomFeed.dc?.contributor // → Jane Smith
atomFeed.dc?.date // → 2022-01-01T12:00+00:00
atomFeed.sy?.updateFrequency // → 1
atomFeed.entries?.[0]?.title // → Example Entry
atomFeed.entries?.[0]?.dc?.creator // → Jack Jackson
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

<details>
<summary>Example of a more complex RSS feed 📜</summary>

```ts
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

rssFeed.title // → Sample Feed
rssFeed.textInput?.description // → Search this site:
rssFeed.items?.length // → 1
rssFeed.items?.[0]?.enclosure?.url // → http://example.org/audio/demo.mp3
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
      "source": { "title": "Example's Realm", "url": "http://www.example.org/links.xml" }
    }
  ]
}
```
</details>

<details>
<summary>Example of an OPML file 📜</summary>

```ts
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

opml.head?.title // → Tech Sites
opml.body?.outlines?.[0].text // → The Verge
opml.body?.outlines?.[1].xmlUrl // → https://techcrunch.com/feed/

```
</details>

For more examples, check the _*/references_ folders in the source code. There, you'll find the complete objects returned from the parser functions for the various feed formats and versions.

* Atom examples: [src/feeds/atom/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/atom/references),
* RSS examples: [src/feeds/rss/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rss/references),
* RDF examples: [src/feeds/rdf/references](https://github.com/macieklamberski/feedsmith/blob/main/src/feeds/rdf/references).
* OPML examples: [src/opml/references](https://github.com/macieklamberski/feedsmith/blob/main/src/opml/references).

### Error handling

If the feed is unrecognized or invalid, an `Error` will be thrown with a descriptive message.

```ts
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

### Format detection

You can detect feed formats without parsing them. Detect functions are designed to quickly identify the feed format by looking for its signature, such as the the root tag, version attribute or feed elements.

```ts
import { detectAtomFeed, detectJsonFeed, detectRssFeed, detectRdfFeed } from 'feedsmith'

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

## Generating

### Generating JSON Feed

Although JSON feeds are simply JSON objects that can be easily generated manually, the `generateJsonFeed` function provides helpful type hints, which can aid in feed generation. Additionally, you can use Date objects for dates, which are automatically converted to the correct format in the background.

```ts
import { generateJsonFeed } from 'feedsmith'

const jsonFeed = generateJsonFeed({
  title: 'My Example Feed',
  feed_url: 'https://example.com/feed.json',
  authors: [
    {
      name: 'John Doe',
      url: 'https://example.com/johndoe',
    },
  ],
  items: [
    {
      id: '1',
      content_html: '<p>Hello world</p>',
      url: 'https://example.com/post/1',
      title: 'First post',
      date_published: new Date('2019-03-07T00:00:00+01:00'),
      language: 'en-US',
    },
  ],
})
```

Will output:

```json
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "My Example Feed",
  "feed_url": "https://example.com/feed.json",
  "authors": [
    {
      "name": "John Doe",
      "url": "https://example.com/johndoe",
    },
  ],
  "items": [
    {
      "id": "1",
      "content_html": "<p>Hello world</p>",
      "url": "https://example.com/post/1",
      "title": "First post",
      "date_published": "2019-03-06T23:00:00.000Z",
      "language": "en-US",
    },
  ],
}
```

> [!NOTE]
> The functionality for generating the remaining feed formats is currently under development and will be introduced gradually. For more information, see the [Supported formats](#supported-formats).

### Generating OPML

```ts
import { generateOpml } from 'feedsmith'

const opml = generateOpml({
  head: {
    title: 'My Feed',
    dateCreated: new Date(),
  },
  body: {
    outlines: [
      {
        text: 'My Feed',
        type: 'rss',
        xmlUrl: 'https://example.com/feed.xml',
        htmlUrl: 'https://example.com',
      },
    ],
  },
})
```

Will output:

```xml
<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <head>
    <title>My Feed</title>
    <dateCreated>Fri, 11 Apr 2025 13:05:26 GMT</dateCreated>
  </head>
  <body>
    <outline text="My Feed" type="rss" xmlUrl="https://example.com/feed.xml" htmlUrl="https://example.com"/>
  </body>
</opml>
```

## Benchmarks

A comprehensive set of benchmarks, categorized by various file sizes, is available in the _/benchmarks_ directory. These benchmarks were conducted using both Tinybench and Benchmark.js.

[See full benchmark results →](benchmarks/README.md)

For a quick overview, here are the results of parsing RSS, Atom, and RDF feeds using various JS packages with Tinybench. Feedsmith's results are marked with an asterisk (`*`).

```
📊 RSS feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package                       │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼───────────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith *                   │ 2.15    │ 464.233      │ 431.238  │ 560.196  │ 33   │ baseline    │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.61    │ 619.751      │ 583.357  │ 702.199  │ 25   │ 1.3x slower │
│ 2 │ @gaphub/feed                  │ 1.51    │ 663.333      │ 615.706  │ 753.343  │ 23   │ 1.4x slower │
│ 3 │ podcast-feed-parser           │ 1.40    │ 713.043      │ 663.199  │ 822.646  │ 22   │ 1.5x slower │
│ 4 │ feedparser                    │ 0.99    │ 1013.059     │ 943.120  │ 1140.454 │ 15   │ 2.2x slower │
│ 5 │ @extractus/feed-extractor     │ 0.86    │ 1167.174     │ 1105.055 │ 1266.003 │ 13   │ 2.5x slower │
│ 6 │ feedme.js                     │ 0.74    │ 1347.627     │ 1192.642 │ 1633.812 │ 12   │ 2.9x slower │
│ 7 │ rss-parser                    │ 0.64    │ 1551.783     │ 1495.036 │ 1739.777 │ 10   │ 3.3x slower │
│ 8 │ @rowanmanning/feed-parser     │ 0.46    │ 2186.174     │ 2029.103 │ 2689.577 │ 7    │ 4.7x slower │
└───┴───────────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘

📊 Atom feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬─────────┬──────────────┬───────────┬───────────┬──────┬─────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms)  │ Max (ms)  │ Runs │ Performance │
├───┼───────────────────────────┼─────────┼──────────────┼───────────┼───────────┼──────┼─────────────┤
│ 0 │ feedsmith *               │ 0.45    │ 2218.248     │ 2195.860  │ 2258.982  │ 7    │ baseline    │
│ 1 │ @rowanmanning/feed-parser │ 0.18    │ 5553.175     │ 5249.846  │ 5861.476  │ 3    │ 2.5x slower │
│ 2 │ feedparser                │ 0.17    │ 6057.445     │ 5563.861  │ 6781.359  │ 3    │ 2.7x slower │
│ 3 │ @extractus/feed-extractor │ 0.15    │ 6685.829     │ 6494.192  │ 6984.887  │ 3    │ 3.0x slower │
│ 4 │ @gaphub/feed              │ 0.13    │ 7717.126     │ 6402.034  │ 9032.219  │ 2    │ 3.5x slower │
│ 5 │ feedme.js                 │ 0.12    │ 8053.625     │ 7935.369  │ 8171.881  │ 2    │ 3.6x slower │
│ 6 │ rss-parser                │ 0.08    │ 12999.252    │ 12819.434 │ 13179.070 │ 2    │ 5.9x slower │
└───┴───────────────────────────┴─────────┴──────────────┴───────────┴───────────┴──────┴─────────────┘

📊 RDF feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬──────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance  │
├───┼───────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 5.93    │ 168.678      │ 153.476  │ 191.892  │ 89   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 3.00    │ 333.512      │ 312.475  │ 387.156  │ 45   │ 2.0x slower  │
│ 2 │ @extractus/feed-extractor │ 1.80    │ 556.240      │ 504.258  │ 621.485  │ 27   │ 3.3x slower  │
│ 3 │ @gaphub/feed              │ 1.23    │ 815.776      │ 729.150  │ 1129.571 │ 19   │ 4.8x slower  │
│ 4 │ feedparser                │ 0.92    │ 1087.980     │ 1023.638 │ 1128.518 │ 14   │ 6.5x slower  │
│ 5 │ feedme.js                 │ 0.64    │ 1567.422     │ 1506.713 │ 1626.450 │ 10   │ 9.3x slower  │
│ 6 │ rss-parser                │ 0.42    │ 2368.398     │ 2288.041 │ 2438.408 │ 7    │ 14.0x slower │
└───┴───────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴──────────────┘
```

## FAQ

### Why should I use Feedsmith instead of alternative packages?

The key advantage of Feedsmith is that it preserves the original feed structure exactly as provided in each specific feed format.

Many alternative packages attempt to normalize data by:

* Merging distinct fields like `author`, `dc:creator`, and `creator` into a single property.
* Combining date fields such as `dc:date` and `pubDate` without preserving their sources.
* Handling multiple `<atom:link>` elements inconsistently, sometimes keeping only the first or last one or ignoring different `rel` attributes.
* Some libraries try to combine different feed formats into one universal structure.

While this approach can be useful for quick reading of feed data, it often results in a loss of information that may be crucial for certain applications, such as reading data from specific namespaces.

### Why are date fields returned as strings?

In the course of parsing hundreds of thousands of feeds, I have found that dates in feeds use many different formats. Rather than attempting to parse them all (and potentially introducing errors), dates are returned in their original string form. This approach allows you to use your preferred date parsing library or simply the `Date` object.

### Does Feedsmith validate feeds?

Feedsmith focuses on parsing feeds rather than validating them. It will extract whatever valid data it can find, even from partially valid feeds. This approach makes it more resilient when dealing with feeds found in the wild.

It will only fail if the feed is completely invalid or it does not contain all the fields required according to the specification.

### How does Feedsmith handle missing or incomplete data?

Feedsmith is designed to be forgiving. It will extract whatever valid data it can find and ignore missing or invalid elements. This makes it suitable for use with real-world feeds that may not strictly follow specifications.

### Does Feedsmith work in the browser?

Even though Feedsmith is more suited for the Node.js environments, it was also tested in modern browsers where it works seamlessly. It's provided as an ES module.

## Acknowledgements

* The library API is inspired by the [FeedKit library for Swift](https://github.com/nmdias/FeedKit).
* XML parsing is provided by [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser).
* HTML entity decoding is handled by [entities](https://github.com/fb55/entities).

## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright 2025 Maciej Lamberski
