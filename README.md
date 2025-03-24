# Parsser

Modern JavaScript utility for parsing JSON Feed, Atom, RSS, and RDF feeds, with support for popular namespaces.

[![tests](https://github.com/macieklamberski/parsser/actions/workflows/test.yml/badge.svg)](https://github.com/macieklamberski/parsser/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/parsser.svg)](https://www.npmjs.com/package/parsser)
[![license](https://img.shields.io/npm/l/parsser.svg)](https://github.com/yourusername/parsser/blob/main/LICENSE)

## Features

#### Universal and dedicated parsers
* Parse any feed format with a single function that automatically identifies JSON Feed, Atom, RSS, and RDF feeds.
* Or… use dedicated functions when you know the feed type.
* Dublin Core, Syndication, Content, and Atom namespace support. Support for other namespaces is in the works.

#### Advantages
* Get access to all the information in the feed, as Parsser preserves the original feed structure exactly as provided in each specific format. TypeScript type definitions are available for each feed type, making it easy to work with the data.

#### Leniency
* **Normalizes legacy elements** ✨ — Upgrades feed elements to their modern equivalents so that you never need to worry about reading feeds in older formats.
* **CaSe INSENsiTive** — Handles XML tags in any case (lowercase, uppercase, mixed).

#### Performance and type-safety
* **Fast parsing** — Built on [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) for efficient XML processing.
* **Type-safe APIs** — Full TypeScript support with comprehensive type definitions.
* **Well tested** — Comprehensive test suite with over 450 tests and 99.9% code coverage based on `bun test --coverage`.
* **Tree-shakable** — Only include the parts of the library you need, reducing bundle size.

## Supported feeds and namespaces

#### Feeds

* [x] [Atom](https://tools.ietf.org/html/rfc4287) (versions: 0.3, 1.0)
* [x] [RSS](http://cyber.law.harvard.edu/rss/rss.html) (versions: 0.90, 0.91, 0.92, 0.93, 0.94, 2.0)
* [x] [JSON](https://jsonfeed.org) (versions: 1.0, 1.1)
* [x] [RDF](https://web.resource.org/rss/1.0/spec) (versions: 0.9, 1.0)

#### Namespaces

* [x] [Atom](http://www.w3.org/2005/Atom) (as both `<atom:*>` and `<a10:*>`)
* [x] [Dublin Core](http://purl.org/dc/elements/1.1/) (`<dc:*>`)
* [x] [Syndication](http://purl.org/rss/1.0/modules/syndication/) (`<sy:*>`)
* [x] [Content](http://purl.org/rss/1.0/modules/content/) (`<content:*>`)
* [ ] 🏗️ [Dublin Core Terms](http://purl.org/dc/terms/) (`<dcterms:*>`)
* [ ] 🏗️ [Media RSS](http://search.yahoo.com/mrss/) (`<media:*>`)
* [ ] 🏗️ [Geo RSS](http://www.georss.org/georss) (`<georss:*>`)
* [ ] 🏗️ [iTunes](http://www.itunes.com/dtds/podcast-1.0.dtd) (`<itunes:*>`)
* [ ] Need something else?

## Installation

```bash
npm install parsser
```

## Parsing feeds

### Universal parser

The easiest way to parse any feed is to use the universal `parseFeed` function:

```ts
import { parseFeed } from 'parsser'

const { type, feed } = parseFeed('feedContent')

console.log('Feed type:', type)
console.log('Feed title:', feed.title)

if (type === 'atom') {
  console.log('Atom feed ID:', feed.id)
}

if (type === 'rss') {
  console.log('RSS feed link:', feed.link)
}

if (type === 'json') {
  console.log('JSON feed version:', feed.version)
}

if (type === 'rdf') {
  console.log('RDF feed link:', feed.link)
}
```

### Dedicated parsers

If you know the format in advance, you can use the format-specific parsers:

```ts
import { parseAtomFeed, parseJsonFeed, parseRssFeed, parseRdfFeed } from 'parsser'

// Parse the feed content.
const atomFeed = parseAtomFeed(atomContent)
const jsonFeed = parseJsonFeed(jsonContent)
const rssFeed = parseRssFeed(rssContent)
const rdfFeed = parseRdfFeed(rdfContent)

// Then read the TypeScript suggestions for the specific feed type.
rssFeed?.title
rssFeed?.dc?.creator
rssFeed?.dc?.date
rssFeed?.sy?.updateBase
rssFeed?.items?.[0]?.title
```

### Returned values

The objects returned from the parser functions are highly comprehensive, aiming to recreate the actual feed structure and its values, including all the supported namespaces. Below are some examples of what is available.

```ts
import { parseAtomFeed } from 'parsser'

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

atomFeed?.title // → Example Feed
atomFeed?.dc?.contributor // → Jane Smith
atomFeed?.dc?.date // → 2022-01-01T12:00+00:00
atomFeed?.sy?.updateFrequency // → 1
atomFeed?.entries?.[0]?.title // → Example Entry
atomFeed?.entries?.[0]?.dc?.creator // → Jack Jackson
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
import { parseRssFeed } from 'parsser'

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

rssFeed?.title // → Sample Feed
rssFeed?.textInput?.description // → Search this site:
rssFeed?.items?.length // → 1
rssFeed?.items?.[0]?.enclosure?.url // → http://example.org/audio/demo.mp3
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

For more examples, check the _*/references_ folders located in the source code. There, you'll find the complete objects returned from the parser functions for all feed formats and versions.

* Atom examples: [src/feeds/atom/references](https://github.com/macieklamberski/parsser/blob/main/src/feeds/atom/references),
* JSON examples: [src/feeds/json/references](https://github.com/macieklamberski/parsser/blob/main/src/feeds/json/references),
* RSS examples: [src/feeds/rss/references](https://github.com/macieklamberski/parsser/blob/main/src/feeds/rss/references),
* RDF examples: [src/feeds/rdf/references](https://github.com/macieklamberski/parsser/blob/main/src/feeds/rdf/references).

### Error handling

If the feed is unrecognized or invalid, an `Error` will be thrown with a descriptive message.

```ts
import { parseFeed, parseJsonFeed } from 'parsser'

try {
  const universalFeed = parseFeed('<not-a-feed></not-a-feed>')
} catch (error) {
  // Error: Unrecognized feed format.
}

try {
  const jsonFeed = parseJsonFeed('{}')
} catch (error) {
  // Error: Invalid JSON feed.
}
```

### Format detection

You can detect feed formats without parsing them.

```ts
import { detectAtomFeed, detectJsonFeed, detectRssFeed, detectRdfFeed } from 'parsser'

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

**⚠️ Important note:** Detect functions are designed to quickly identify the type of feed. They specifically search for the signature of the feed, such as the `<rss>` tag in the case of RSS feeds. However, it is possible for the function to detect an RSS feed, even if that feed is invalid. Only when using the `parseRssFeed` function will the feed be fully validated.

## FAQ

### Why should I use Parsser instead of alternative modules?

As stated in the Features section, the key advantage of Parsser is that it preserves the original feed structure exactly as provided in each specific feed format.

Many competing packages attempt to normalize data by:
* Merging distinct fields like `author`, `dc:creator`, and `creator` into a single property.
* Combining date fields such as `dc:date` and `pubDate` without preserving their source.
* Handling multiple `<atom:link>` elements inconsistently, sometimes only keeping the first/last one or ignoring different `rel` attributes.

Some libraries try to combine different feed formats into one universal structure, which can lead to loss of information.

Also, Parsser is a bit faster than other packages. Still, this is not a very differentiated space and other newer packages can catch up.

### Why are date fields returned as strings?

In the course of parsing hundreds of thousands of feeds, we've found that dates in feeds use many different formats. Rather than attempting to parse them all (and potentially introducing errors), we return dates in their original string form, allowing you to use your preferred date parsing library.

### Does Parsser validate feeds?

Parsser focuses on parsing feeds rather than validating them. It will extract whatever valid data it can find, even from partially valid feeds. This approach makes it more resilient when dealing with feeds found in the wild.

It will only fail if the feed is completely invalid or it does not contain all the fields required according to the specification.

### How does Parsser handle missing or incomplete data?

Parsser is designed to be forgiving. It will extract whatever valid data it can find and ignore missing or invalid elements. This makes it suitable for use with real-world feeds that may not strictly follow specifications.

### Does Parsser work in the browser?

Even though Parsser is more suited for the Node.js environments, it was also tested in modern browsers where it works seamlessly. It's provided as an ES module.

## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright © 2025, Maciej Lamberski

## Acknowledgements

- The library API is inspired by the [FeedKit library for Swift](https://github.com/nmdias/FeedKit),
- XML parsing is provided by [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser),
- HTML entity decoding is handled by [entities](https://github.com/fb55/entities).
