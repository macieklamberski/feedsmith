import { Readable } from 'node:stream'
import { extractFromXml as testExtractusFeedExtractor } from '@extractus/feed-extractor'
import { FeedParser as GapHubFeedParser } from '@gaphub/feed'
import { parseFeed as rowanmanningFeedParser } from '@rowanmanning/feed-parser'
import { rssParse as ulisesgasconRssFeedParser } from '@ulisesgascon/rss-feed-parser'
import FeedMeJs from 'feedme'
import FeedParser from 'feedparser'
import nodeOpmlParser from 'node-opml-parser'
import opmlPackage from 'opml'
import { opmlToJSON as testOpmlToJson } from 'opml-to-json'
import OpmlParser from 'opmlparser'
import { getPodcastFromFeed as testPodcastFeedParser } from 'podcast-feed-parser'
import RssParser from 'rss-parser'
import { parseAtomFeed, parseJsonFeed, parseOpml, parseRdfFeed, parseRssFeed } from '../src/index'
import { loadFeedFiles, runBenchmarks, runTest } from './utils'

const gaphubFeedParserInstance = new GapHubFeedParser()
const testGaphubFeedParser = (feed: string) => {
  return gaphubFeedParserInstance.parseString(feed)
}

const testGaphubFeedParserOpml = async (xml: string) => {
  return gaphubFeedParserInstance.parseOPMLString(xml)
}

const testFeedMeJs = (feed: string) => {
  const parser = new FeedMeJs(true)
  parser.write(feed)
  parser.end()
  return parser.done()
}

const testFeedParser = (feed: string) => {
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

const testRowanmanningFeedParser = (feed: string) => {
  // To test the same behavior across all parsers, we need to call the toJSON method.
  // Otherwise, all properties are lazy-loaded on demand, which does not accurately
  // represent the behavior of other parsers.
  return rowanmanningFeedParser(feed).toJSON()
}

const rssParserInstance = new RssParser()
const testRssParser = (feed: string) => {
  return rssParserInstance.parseString(feed)
}

const testOpmlParser = async (xml: string) => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from([xml])
    const parser = new OpmlParser({})
    const outlines: unknown[] = []

    parser.on('error', (error: Error) => reject(error))
    parser.on('readable', function () {
      let item: unknown = this.read()
      while (item !== null && item !== undefined) {
        outlines.push(item)
        item = this.read()
      }
    })
    parser.on('end', () => resolve(outlines))
    stream.pipe(parser)
  })
}

const testNodeOpmlParser = async (xml: string) => {
  let items: unknown

  nodeOpmlParser(xml, (_error, result: unknown) => {
    items = result
  })

  return items
}

const testOpmlPackage = async (xml: string) => {
  let items: unknown

  opmlPackage.parse(xml, (_error, result: unknown) => {
    items = result
  })

  return items
}

const jsonFilesStrings = loadFeedFiles('files/json', 10)
const jsonFilesObjects = Object.entries(jsonFilesStrings).reduce(
  (jsons, [name, json]) => {
    jsons[name] = JSON.parse(json)
    return jsons
  },
  {} as Record<string, unknown>,
)
const rssBigFiles = loadFeedFiles('files/rss-big', 10)
const rssSmallFiles = loadFeedFiles('files/rss-small', 100)
const atomBigFiles = loadFeedFiles('files/atom-big', 10)
const atomSmallFiles = loadFeedFiles('files/atom-small', 100)
const rdfFiles = loadFeedFiles('files/rdf', 100)
const opmlFiles = loadFeedFiles('files/opml', 10)

await runBenchmarks('RSS feed parsing (10 files × 5MB–50MB)', {
  'rss-parser': () => runTest(rssBigFiles, testRssParser),
  '@gaphub/feed': () => runTest(rssBigFiles, testGaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rssBigFiles, testRowanmanningFeedParser),
  'feedme.js': () => runTest(rssBigFiles, testFeedMeJs),
  '@extractus/feed-extractor': () => runTest(rssBigFiles, testExtractusFeedExtractor),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssBigFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssBigFiles, testFeedParser),
  'podcast-feed-parser': () => runTest(rssBigFiles, testPodcastFeedParser),
  'feedsmith *': () => runTest(rssBigFiles, parseRssFeed),
})

await runBenchmarks('RSS feed parsing (100 files × 100KB–5MB)', {
  'rss-parser': () => runTest(rssSmallFiles, testRssParser),
  '@gaphub/feed': () => runTest(rssSmallFiles, testGaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rssSmallFiles, testRowanmanningFeedParser),
  'feedme.js': () => runTest(rssSmallFiles, testFeedMeJs),
  '@extractus/feed-extractor': () => runTest(rssSmallFiles, testExtractusFeedExtractor),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssSmallFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssSmallFiles, testFeedParser),
  'podcast-feed-parser': () => runTest(rssSmallFiles, testPodcastFeedParser),
  'feedsmith *': () => runTest(rssSmallFiles, parseRssFeed),
})

await runBenchmarks('Atom feed parsing (10 files × 5MB–50MB)', {
  'rss-parser': () => runTest(atomBigFiles, testRssParser),
  '@gaphub/feed': () => runTest(atomBigFiles, testGaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(atomBigFiles, testRowanmanningFeedParser),
  'feedme.js': () => runTest(atomBigFiles, testFeedMeJs),
  '@extractus/feed-extractor': () => runTest(atomBigFiles, testExtractusFeedExtractor),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomBigFiles, testFeedParser),
  // podcast-feed-parser — does not support Atom feeds.
  'feedsmith *': () => runTest(atomBigFiles, parseAtomFeed),
})

await runBenchmarks('Atom feed parsing (100 files × 100KB–5MB)', {
  'rss-parser': () => runTest(atomSmallFiles, testRssParser),
  '@gaphub/feed': () => runTest(atomSmallFiles, testGaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(atomSmallFiles, testRowanmanningFeedParser),
  'feedme.js': () => runTest(atomSmallFiles, testFeedMeJs),
  '@extractus/feed-extractor': () => runTest(atomSmallFiles, testExtractusFeedExtractor),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomSmallFiles, testFeedParser),
  // podcast-feed-parser — does not support Atom feeds.
  'feedsmith *': () => runTest(atomSmallFiles, parseAtomFeed),
})

await runBenchmarks('RDF feed parsing (100 files × 100KB–5MB)', {
  'rss-parser': () => runTest(rdfFiles, testRssParser),
  '@gaphub/feed': () => runTest(rdfFiles, testGaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rdfFiles, testRowanmanningFeedParser),
  'feedme.js': () => runTest(rdfFiles, testFeedMeJs),
  '@extractus/feed-extractor': () => runTest(rdfFiles, testExtractusFeedExtractor),
  // @ulisesgascon/rss-feed-parser — does not support RDF feeds.
  feedparser: () => runTest(rdfFiles, testFeedParser),
  // podcast-feed-parser — does not support RDF feeds.
  'feedsmith *': () => runTest(rdfFiles, parseRdfFeed),
})

await runBenchmarks('JSON feed parsing (50 files × 100KB–5MB)', {
  // '@extractus/feed-extractor' — does not properly parse and always returns empty feed.
  'feedsmith *': () => runTest(jsonFilesObjects, parseJsonFeed),
})

await runBenchmarks('OPML parsing (50 files × 100KB–500KB)', {
  '@gaphub/feed': () => runTest(opmlFiles, testGaphubFeedParserOpml),
  'node-opml-parser': () => runTest(opmlFiles, testNodeOpmlParser),
  'opml-to-json': () => runTest(opmlFiles, testOpmlToJson),
  opml: () => runTest(opmlFiles, testOpmlPackage),
  opmlparser: () => runTest(opmlFiles, testOpmlParser),
  'feedsmith *': () => runTest(opmlFiles, parseOpml),
})
