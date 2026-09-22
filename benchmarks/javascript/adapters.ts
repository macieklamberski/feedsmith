import { Readable } from 'node:stream'

export type Format = 'rss' | 'atom' | 'rdf' | 'json' | 'opml'
export type Adapter = (content: string, format: Format) => unknown | Promise<unknown>
export type AdapterFactory = () => Promise<Adapter>

// Each factory dynamically imports only the library it benchmarks, so a subprocess loads
// nothing it does not need. This keeps process startup minimal and roughly equal to the
// cross-language runners, instead of every run paying to load all libraries at once.
export const adapterFactories: Record<string, AdapterFactory> = {
  'rss-parser': async () => {
    const { default: RssParser } = await import('rss-parser')
    const instance = new RssParser()
    return (content) => instance.parseString(content)
  },

  '@gaphub/feed': async () => {
    const { FeedParser } = await import('@gaphub/feed')
    const instance = new FeedParser()
    return (content, format) =>
      format === 'opml' ? instance.parseOPMLString(content) : instance.parseString(content)
  },

  '@rowanmanning/feed-parser': async () => {
    const { parseFeed } = await import('@rowanmanning/feed-parser')
    // Calling toJSON forces eager evaluation; otherwise properties are lazy-loaded on
    // demand, which would not match the behavior of the other parsers.
    return (content) => parseFeed(content).toJSON()
  },

  feedme: async () => {
    const { default: FeedMeJs } = await import('feedme')
    return (content) => {
      const parser = new FeedMeJs(true)
      parser.write(content)
      parser.end()
      return parser.done()
    }
  },

  '@extractus/feed-extractor': async () => {
    const { extractFromXml } = await import('@extractus/feed-extractor')
    return (content) => extractFromXml(content)
  },

  '@ulisesgascon/rss-feed-parser': async () => {
    const { rssParse } = await import('@ulisesgascon/rss-feed-parser')
    return (content) => rssParse(content)
  },

  feedparser: async () => {
    const { default: FeedParser } = await import('feedparser')
    return (content) =>
      new Promise((resolve, reject) => {
        const stream = Readable.from([content])
        const feedparser = new FeedParser({})
        const items: Array<unknown> = []

        feedparser.on('error', (error: Error) => reject(error))
        feedparser.on('readable', () => {
          let item: unknown = feedparser.read()
          while (item !== null && item !== undefined) {
            items.push(item)
            item = feedparser.read()
          }
        })
        feedparser.on('end', () => resolve(items))
        stream.pipe(feedparser)
      })
  },

  'podcast-feed-parser': async () => {
    const { getPodcastFromFeed } = await import('podcast-feed-parser')
    return (content) => getPodcastFromFeed(content)
  },

  'node-opml-parser': async () => {
    const { default: nodeOpmlParser } = await import('node-opml-parser')
    return (content) => {
      let items: unknown

      nodeOpmlParser(content, (_error: unknown, result: unknown) => {
        items = result
      })

      return items
    }
  },

  'opml-to-json': async () => {
    const { opmlToJSON } = await import('opml-to-json')
    return (content) => opmlToJSON(content)
  },

  opml: async () => {
    const { default: opmlPackage } = await import('opml')
    return (content) => {
      let items: unknown

      opmlPackage.parse(content, (_error: unknown, result: unknown) => {
        items = result
      })

      return items
    }
  },

  opmlparser: async () => {
    const { default: OpmlParser } = await import('opmlparser')
    return (content) =>
      new Promise((resolve, reject) => {
        const stream = Readable.from([content])
        const parser = new OpmlParser({})
        const outlines: Array<unknown> = []

        parser.on('error', (error: Error) => reject(error))
        parser.on('readable', () => {
          let item: unknown = parser.read()
          while (item !== null && item !== undefined) {
            outlines.push(item)
            item = parser.read()
          }
        })
        parser.on('end', () => resolve(outlines))
        stream.pipe(parser)
      })
  },

  feedsmith: async () => {
    const { parseRssFeed, parseAtomFeed, parseRdfFeed, parseJsonFeed, parseOpml } = await import(
      '../../src/index'
    )
    return (content, format) => {
      switch (format) {
        case 'json':
          return parseJsonFeed(JSON.parse(content))
        case 'opml':
          return parseOpml(content)
        case 'atom':
          return parseAtomFeed(content)
        case 'rdf':
          return parseRdfFeed(content)
        default:
          return parseRssFeed(content)
      }
    }
  },

  'feedsmith-released': async () => {
    const { parseRssFeed, parseAtomFeed, parseRdfFeed, parseJsonFeed, parseOpml } = await import(
      'feedsmith'
    )
    return (content, format) => {
      switch (format) {
        case 'json':
          return parseJsonFeed(JSON.parse(content))
        case 'opml':
          return parseOpml(content)
        case 'atom':
          return parseAtomFeed(content)
        case 'rdf':
          return parseRdfFeed(content)
        default:
          return parseRssFeed(content)
      }
    }
  },
}
