import { Readable } from 'node:stream'
import { extractFromXml } from '@extractus/feed-extractor'
import { FeedParser as GapHubFeedParser } from '@gaphub/feed'
import { parseFeed as rowanmanningFeedParser } from '@rowanmanning/feed-parser'
import { rssParse as ulisesgasconRssFeedParser } from '@ulisesgascon/rss-feed-parser'
import FeedMeJs from 'feedme'
import FeedParser from 'feedparser'
import RssParser from 'rss-parser'
import { parseAtomFeed, parseJsonFeed, parseRdfFeed, parseRssFeed } from '../src/index'
import { loadFeedFiles, runBenchmarks, runTest } from './utils'

const gaphubFeedParserInstance = new GapHubFeedParser()
const gaphubFeedParser = (feed: string) => {
  return gaphubFeedParserInstance.parseString(feed)
}

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

const jsonFilesStrings = loadFeedFiles('feeds/json', 10)
const jsonFilesObjects = Object.entries(jsonFilesStrings).reduce(
  (jsons, [name, json]) => {
    jsons[name] = JSON.parse(json)
    return jsons
  },
  {} as Record<string, unknown>,
)
const rssBigFiles = loadFeedFiles('feeds/rss-big', 10)
const rssSmallFiles = loadFeedFiles('feeds/rss-small', 50)
const atomBigFiles = loadFeedFiles('feeds/atom-big', 10)
const atomSmallFiles = loadFeedFiles('feeds/atom-small', 50)
const rdfFiles = loadFeedFiles('feeds/rdf', 50)

await runBenchmarks('RSS feed parsing (10 files × 5MB — 50MB)', {
  'rss-parser': () => runTest(rssBigFiles, rssParser),
  '@gaphub/feed': () => runTest(rssBigFiles, gaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rssBigFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rssBigFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rssBigFiles, extractFromXml),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssBigFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssBigFiles, feedParser),
  'feedsmith *': () => runTest(rssBigFiles, parseRssFeed),
})

await runBenchmarks('RSS feed parsing (50 files × 100KB — 5MB)', {
  'rss-parser': () => runTest(rssSmallFiles, rssParser),
  '@gaphub/feed': () => runTest(rssSmallFiles, gaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rssSmallFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rssSmallFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rssSmallFiles, extractFromXml),
  '@ulisesgascon/rss-feed-parser': () => runTest(rssSmallFiles, ulisesgasconRssFeedParser),
  feedparser: () => runTest(rssSmallFiles, feedParser),
  'feedsmith *': () => runTest(rssSmallFiles, parseRssFeed),
})

await runBenchmarks('Atom feed parsing (10 files × 5MB — 50MB)', {
  'rss-parser': () => runTest(atomBigFiles, rssParser),
  '@gaphub/feed': () => runTest(atomBigFiles, gaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(atomBigFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(atomBigFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(atomBigFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomBigFiles, feedParser),
  'feedsmith *': () => runTest(atomBigFiles, parseAtomFeed),
})

await runBenchmarks('Atom feed parsing (50 files × 100KB — 5MB)', {
  'rss-parser': () => runTest(atomSmallFiles, rssParser),
  '@gaphub/feed': () => runTest(atomSmallFiles, gaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(atomSmallFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(atomSmallFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(atomSmallFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support Atom feeds.
  feedparser: () => runTest(atomSmallFiles, feedParser),
  'feedsmith *': () => runTest(atomSmallFiles, parseAtomFeed),
})

await runBenchmarks('RDF feed parsing (50 files × 100KB — 5MB)', {
  'rss-parser': () => runTest(rdfFiles, rssParser),
  '@gaphub/feed': () => runTest(rdfFiles, gaphubFeedParser),
  '@rowanmanning/feed-parser': () => runTest(rdfFiles, rowanmanningFeedParser),
  'feedme.js': () => runTest(rdfFiles, feedMeJs),
  '@extractus/feed-extractor': () => runTest(rdfFiles, extractFromXml),
  // @ulisesgascon/rss-feed-parser — does not support RDF feeds.
  feedparser: () => runTest(rdfFiles, feedParser),
  'feedsmith *': () => runTest(rdfFiles, parseRdfFeed),
})

await runBenchmarks('JSON feed parsing (50 files × 100KB — 5MB)', {
  // '@extractus/feed-extractor' — does not properly parse and always returns empty feed.
  'feedsmith *': () => runTest(jsonFilesObjects, parseJsonFeed),
})
