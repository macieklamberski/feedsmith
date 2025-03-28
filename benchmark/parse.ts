import { Readable } from 'node:stream'
import { extractFromXml } from '@extractus/feed-extractor'
import { parseFeed as rowanmanningFeedParser } from '@rowanmanning/feed-parser'
import { rssParse as ulisesgasconRssFeedParser } from '@ulisesgascon/rss-feed-parser'
import { XMLParser } from 'fast-xml-parser'
import FeedMeJs from 'feedme'
import FeedParser from 'feedparser'
import RssParser from 'rss-parser'
import { parseAtomFeed, parseJsonFeed, parseRdfFeed, parseRssFeed } from '../src/index'
import { loadFeedFiles, runBenchmark, runTest } from './utils'

// This is a fast-xml-parser instance with settings comparable to those used by Feedsmith.
// The only difference is that here, trimming values and processing entities are enabled,
// while in Feedsmith, those features are disabled. Feedsmith uses a different approach for
// trimming/entities (more optimal), so the final output is the same.
const xmlParser = new XMLParser({
  trimValues: true,
  processEntities: true,
  htmlEntities: true,
  parseTagValue: false,
  parseAttributeValue: false,
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
})

const feedMeJs = (feed: string) => {
  const parser = new FeedMeJs(true)
  parser.write(feed)
  parser.end()
  return parser.done()
}

const feedParser = (feed: string) => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from([feed])
    const feedparser = new FeedParser({})
    const items: unknown[] = []

    feedparser.on('error', (error: Error) => reject(error))
    feedparser.on('readable', function () {
      let item: unknown = this.read()
      while (item !== null && item !== undefined) {
        items.push(item)
        item = this.read()
      }
    })
    feedparser.on('end', () => resolve(items))
    stream.pipe(feedparser)
  })
}

const rssParserInstance = new RssParser()
const rssParser = (feed: string) => {
  return rssParserInstance.parseString(feed)
}

const fastXmlParser = (feed: string) => {
  return xmlParser.parse(feed)
}

const jsonFilesStrings = loadFeedFiles('feeds/json', 10)
const jsonFilesObjects = Object.entries(jsonFilesStrings).reduce(
  (jsons, [name, json]) => {
    jsons[name] = JSON.parse(json)
    return jsons
  },
  {} as Record<string, unknown>,
)
const rssBigFiles = loadFeedFiles('feeds/rss-big', 10)
const rssSmallFiles = loadFeedFiles('feeds/rss-small', 10)
const atomBigFiles = loadFeedFiles('feeds/atom-big', 10)
const atomSmallFiles = loadFeedFiles('feeds/atom-small', 10)
const rdfFiles = loadFeedFiles('feeds/rdf', 10)

await runBenchmark('JSON feed parsing (100KB — 5MB)', {
  // '@extractus/feed-extractor' — does not properly parse and always returns empty feed.
  'feedsmith 👈': () => runTest(jsonFilesObjects, parseJsonFeed),
})

await runBenchmark('RSS feed parsing (5MB — 50MB)', {
  'rss-parser': () => runTest(rssBigFiles, rssParser),
  'fast-xml-parser': () => runTest(rssBigFiles, fastXmlParser),
  '@rowanmanning/feed-parser': () => runTest(rssBigFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rssBigFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rssBigFiles, extractFromXml),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssBigFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssBigFiles, feedParser),
  'feedsmith 👈': () => runTest(rssBigFiles, parseRssFeed),
})

await runBenchmark('RSS feed parsing (100KB — 5MB)', {
  'rss-parser': () => runTest(rssSmallFiles, rssParser),
  'fast-xml-parser': () => runTest(rssSmallFiles, fastXmlParser),
  '@rowanmanning/feed-parser': () => runTest(rssSmallFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rssSmallFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rssSmallFiles, extractFromXml),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssSmallFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssSmallFiles, feedParser),
  'feedsmith 👈': () => runTest(rssSmallFiles, parseRssFeed),
})

await runBenchmark('Atom feed parsing (5MB — 50MB)', {
  'rss-parser': () => runTest(atomBigFiles, rssParser),
  'fast-xml-parser': () => runTest(atomBigFiles, fastXmlParser),
  '@rowanmanning/feed-parser': () => runTest(atomBigFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(atomBigFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(atomBigFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomBigFiles, feedParser),
  'feedsmith 👈': () => runTest(atomBigFiles, parseAtomFeed),
})

await runBenchmark('Atom feed parsing (100KB — 5MB)', {
  'rss-parser': () => runTest(atomSmallFiles, rssParser),
  'fast-xml-parser': () => runTest(atomSmallFiles, fastXmlParser),
  '@rowanmanning/feed-parser': () => runTest(atomSmallFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(atomSmallFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(atomSmallFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomSmallFiles, feedParser),
  'feedsmith 👈': () => runTest(atomSmallFiles, parseAtomFeed),
})

await runBenchmark('RDF feed parsing (100KB — 5MB)', {
  'rss-parser': () => runTest(rdfFiles, rssParser),
  'fast-xml-parser': () => runTest(rdfFiles, fastXmlParser),
  '@rowanmanning/feed-parser': () => runTest(rdfFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rdfFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rdfFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support RDF feeds.
  feedparser: () => runTest(rdfFiles, feedParser),
  'feedsmith 👈': () => runTest(rdfFiles, parseRdfFeed),
})
