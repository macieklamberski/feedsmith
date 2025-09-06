# Functions Reference

## Parsing Functions
- `parseFeed(content)` - Universal parser for any format
- `parseRssFeed(content)` - RSS parser
- `parseAtomFeed(content)` - Atom parser
- `parseRdfFeed(content)` - RDF parser
- `parseJsonFeed(content)` - JSON Feed parser
- `parseOpml(content)` - OPML parser

## Generation Functions
- `generateRssFeed(data, options?)` - Create RSS feeds
- `generateAtomFeed(data, options?)` - Create Atom feeds
- `generateJsonFeed(data)` - Create JSON feeds
- `generateOpml(data, options?)` - Create OPML files

> [!INFO]
> XML-based generation functions (`generateRssFeed`, `generateAtomFeed`, `generateOpml`) accept an optional `options` parameter. For the available options, see the [Styling documentation](/generating/styling).

## Detection Functions
- `detectRssFeed(content)` - Check if content is RSS
- `detectAtomFeed(content)` - Check if content is Atom
- `detectRdfFeed(content)` - Check if content is RDF
- `detectJsonFeed(content)` - Check if content is JSON Feed
