import {
  parseAtomFeed as releasedParseAtomFeed,
  parseJsonFeed as releasedParseJsonFeed,
  parseOpml as releasedParseOpml,
  parseRdfFeed as releasedParseRdfFeed,
  parseRssFeed as releasedParseRssFeed,
} from 'feedsmith'
import {
  parseAtomFeed,
  parseJsonFeed,
  parseOpml,
  parseRdfFeed,
  parseRssFeed,
} from '../../src/index'
import { loadFeedFiles, runBenchmarks, runTest } from './utils'

const jsonFilesStrings = loadFeedFiles('../files/json', 10)
const jsonFilesObjects = Object.entries(jsonFilesStrings).reduce(
  (jsons, [name, json]) => {
    jsons[name] = JSON.parse(json)
    return jsons
  },
  {} as Record<string, unknown>,
)
const rssBigFiles = loadFeedFiles('../files/rss-big', 10)
const rssSmallFiles = loadFeedFiles('../files/rss-small', 100)
const atomBigFiles = loadFeedFiles('../files/atom-big', 10)
const atomSmallFiles = loadFeedFiles('../files/atom-small', 100)
const rdfFiles = loadFeedFiles('../files/rdf', 100)
const opmlFiles = loadFeedFiles('../files/opml', 10)

await runBenchmarks('RSS feed parsing (10 files × 5MB–50MB)', {
  'feedsmith (released)': () => runTest(rssBigFiles, releasedParseRssFeed),
  'feedsmith (local)': () => runTest(rssBigFiles, parseRssFeed),
})

await runBenchmarks('RSS feed parsing (100 files × 100KB–5MB)', {
  'feedsmith (released)': () => runTest(rssSmallFiles, releasedParseRssFeed),
  'feedsmith (local)': () => runTest(rssSmallFiles, parseRssFeed),
})

await runBenchmarks('Atom feed parsing (10 files × 5MB–50MB)', {
  'feedsmith (released)': () => runTest(atomBigFiles, releasedParseAtomFeed),
  'feedsmith (local)': () => runTest(atomBigFiles, parseAtomFeed),
})

await runBenchmarks('Atom feed parsing (100 files × 100KB–5MB)', {
  'feedsmith (released)': () => runTest(atomSmallFiles, releasedParseAtomFeed),
  'feedsmith (local)': () => runTest(atomSmallFiles, parseAtomFeed),
})

await runBenchmarks('RDF feed parsing (100 files × 100KB–5MB)', {
  'feedsmith (released)': () => runTest(rdfFiles, releasedParseRdfFeed),
  'feedsmith (local)': () => runTest(rdfFiles, parseRdfFeed),
})

await runBenchmarks('JSON feed parsing (50 files × 100KB–5MB)', {
  'feedsmith (released)': () => runTest(jsonFilesObjects, releasedParseJsonFeed),
  'feedsmith (local)': () => runTest(jsonFilesObjects, parseJsonFeed),
})

await runBenchmarks('OPML parsing (50 files × 100KB–500KB)', {
  'feedsmith (released)': () => runTest(opmlFiles, releasedParseOpml),
  'feedsmith (local)': () => runTest(opmlFiles, parseOpml),
})
